// Copyright 2021, University of Colorado Boulder

/**
 * Optic is the base class for an optic in this simulation, and supports lens and mirror.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapes from './OpticShapes.js';

class Optic {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // {Optic.Type} type of optic, MIRROR or LENS
      opticType: required( config.opticType ),

      // {Optic.Curve} initial curve of the optic, CONVEX or CONCAVE
      initialCurve: required( config.initialCurve ),

      // {Vector2} center of the optic
      initialPosition: required( config.initialPosition ),

      // {RangeWithValue} range of radius of curvature, in cm
      radiusOfCurvatureRange: required( config.radiusOfCurvatureRange ),

      // {RangeWithValue} range of index of refraction, a unitless ratio
      indexOfRefractionRange: required( config.indexOfRefractionRange ),

      // {RangeWithValue} range of height for the optic, in cm
      diameterRange: required( config.diameterRange ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, config );

    assert && assert( Optic.Type.includes( config.opticType ) );
    assert && assert( Optic.Curve.includes( config.initialCurve ) );
    assert && assert( config.initialPosition instanceof Vector2 );
    assert && assert( config.radiusOfCurvatureRange instanceof RangeWithValue );
    assert && assert( config.indexOfRefractionRange instanceof RangeWithValue );
    assert && assert( config.diameterRange instanceof RangeWithValue );

    // @private {Optic.Type} type of the optic
    //TODO handle with subclassing
    this.opticType = config.opticType;

    // @public type of curve of the optic
    this.curveProperty = new EnumerationProperty( Optic.Curve, config.initialCurve, {
      tandem: config.tandem.createTandem( 'curveProperty' ),
      phetioDocumentation: 'describes the shape of the optic\'s curve'
    } );

    // @public y coordinate is variable, while x coordinate is fixed
    // NOTE: The Flash version allowed free dragging of the lens. But things can get more chaotic if you allow free
    // dragging, and it didn't serve a specific learning goal. So for the HTML5 version, dragging is constrained to
    // vertical (the y axis). If you attempt to change this, beware that you may encounter assumptions (possibly
    // implicit) that will break the sim.
    this.yProperty = new NumberProperty( config.initialPosition.y, {
      units: 'cm',
      tandem: config.tandem.createTandem( 'yProperty' ),
      phetioDocumentation: 'The y (vertical) position of the optic'
    } );

    // @public {DerivedProperty.<number>} position of the optic
    this.positionProperty = new DerivedProperty( [ this.yProperty ],
      y => new Vector2( config.initialPosition.x, y ), {
        units: 'cm',
        tandem: config.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'The position of the geometric center of the optic. ' +
                             'The optic has a fixed x (horizontal) position, and a variable y (vertical) position. ' +
                             'See yPositionProperty to change the y position.'
      } );

    // @public radius of curvature of the optic, positive is converging
    this.radiusOfCurvatureProperty = new NumberProperty( config.radiusOfCurvatureRange.defaultValue, {
      units: 'cm',
      range: config.radiusOfCurvatureRange,
      tandem: config.tandem.createTandem( 'radiusOfCurvatureProperty' )
    } );

    // @public index of refraction of the lens
    this.indexOfRefractionProperty = new NumberProperty( config.indexOfRefractionRange.defaultValue, {
      range: config.indexOfRefractionRange,
      tandem: config.tandem.createTandem( 'indexOfRefractionProperty' )
    } );

    // @public diameter of the optic, controls the optic's aperture
    this.diameterProperty = new NumberProperty( config.diameterRange.defaultValue, {
      units: 'cm',
      range: config.diameterRange,
      tandem: config.tandem.createTandem( 'diameterProperty' )
    } );

    // @public {DerivedProperty.<number>} focal length of the optic
    // positive indicate the optic is converging whereas negative indicates the optic is diverging.
    this.focalLengthProperty = new DerivedProperty(
      [ this.curveProperty, this.radiusOfCurvatureProperty, this.indexOfRefractionProperty ],
      ( curve, radiusOfCurvature, indexOfRefraction ) => {

        // A positive sign indicates the optic is converging.
        // Sign is determined based on the curve and the type of optic.
        const sign = this.isConverging( curve ) ? 1 : -1;

        return sign * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }, {
        units: 'cm',
        tandem: config.tandem.createTandem( 'focalLengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    // @public {DerivedProperty.<Vector2>} focal point to the left of the optic
    this.leftFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( opticPosition, focalLength ) => opticPosition.plusXY( -Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: config.tandem.createTandem( 'leftFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      } );

    // @public {DerivedProperty.<Vector2>} focal point to the right of the optic
    this.rightFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( opticPosition, focalLength ) => opticPosition.plusXY( Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: config.tandem.createTandem( 'rightFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      } );

    // @public {DerivedProperty.<OpticShapes>} shapes related to the optic
    this.shapesProperty = new DerivedProperty(
      [ this.curveProperty, this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( curve, radiusOfCurvature, diameter ) => new OpticShapes( config.opticType, curve, radiusOfCurvature, diameter )
    );

    // @public PhET-iO only, cannot be controlled from the sim UI, and is not subject to reset.
    // See https://github.com/phetsims/geometric-optics/issues/252
    this.opticalAxisVisibleProperty = new BooleanProperty( true, {
      tandem: config.tandem.createTandem( 'opticalAxisVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.curveProperty.reset();
    this.yProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.indexOfRefractionProperty.reset();
    this.diameterProperty.reset();
  }

  /**
   * Convenience method for getting the maximum diameter, in cm.
   * @returns {number}
   * @public
   */
  get maxDiameter() {
    return this.diameterProperty.rangeProperty.value.max;
  }

  /**
   * Determines whether the optic is a lens.
   * @public
   * @returns {boolean}
   */
  isLens() {
    return ( this.opticType === Optic.Type.LENS );
  }

  /**
   * Determines whether the optic is a mirror.
   * @public
   * @returns {boolean}
   */
  isMirror() {
    return ( this.opticType === Optic.Type.MIRROR );
  }

  /**
   * Determines whether the optic is concave.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConcave( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return ( curve === Optic.Curve.CONCAVE );
  }

  /**
   * Determines whether the optic is convex.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConvex( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return ( curve === Optic.Curve.CONVEX );
  }

  /**
   * Determines whether the optic has the potential to converge rays.
   * A convex lens and a concave mirror are converging optics.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConverging( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return ( this.isConvex( curve ) && this.isLens() ) || ( this.isConcave( curve ) && this.isMirror() );
  }

  /**
   * Determines whether the optic has the potential to diverge rays.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isDiverging( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return !this.isConverging( curve );
  }

  //TODO handle with subclassing
  //TODO better documentation, why +1 and -1 ?
  /**
   * Convenience function for mathematical operations.
   * Returns +1 for a lens, -1 for a mirror.
   * @public
   * @returns {number}
   */
  getSign() {
    return this.isLens() ? 1 : -1;
  }

  /**
   * Returns a shape translated by the model position of the optic
   * @public
   * @param {Shape} shape
   * @returns {Shape}
   */
  translatedShape( shape ) {
    assert && assert( shape instanceof Shape );
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }

  /**
   * Gets the bounds of the optically "active" component, in model coordinates.
   * In practice, it means that we exclude the backing (fill) of the mirror
   * @public
   * @returns {Bounds2}
   */
  getOpticBounds() {
    const outlineShape = this.shapesProperty.value.outlineShape;
    const translatedShape = this.translatedShape( outlineShape );
    return translatedShape.getBounds();
  }

  /**
   * Returns the Shape of the vertical axis, in model coordinates.
   * @public
   * @returns {Shape}
   */
  getVerticalAxis() {

    const yMax = 800; // long enough for all zoom levels, in cm

    // a straight vertical line going through the middle of the optic
    const verticalLine = Shape.lineSegment( 0, yMax, 0, -yMax );

    return this.translatedShape( verticalLine );
  }

  /**
   * Returns the top position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @public
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @returns {Vector2}
   */
  getTopPoint( sourcePoint, targetPoint ) {
    return this.getExtremumPoint( sourcePoint, targetPoint, true /* isTop */ );
  }

  /**
   * Returns the bottom position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @public
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @returns {Vector2}
   */
  getBottomPoint( sourcePoint, targetPoint ) {
    return this.getExtremumPoint( sourcePoint, targetPoint, false /* isTop */ );
  }

  /**
   * Returns the most extreme position within the optic that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   * @private
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @param {boolean} isTop
   * @returns {Vector2}
   */
  getExtremumPoint( sourcePoint, targetPoint, isTop ) {
    assert && assert( sourcePoint instanceof Vector2 );
    assert && assert( targetPoint instanceof Vector2 );
    assert && assert( typeof isTop === 'boolean' );

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const isConcave = this.isConcave( this.curveProperty.value );
    const leftPoint = isTop ? opticBounds.leftTop : opticBounds.leftBottom;
    const rightPoint = isTop ? opticBounds.rightTop : opticBounds.rightBottom;

    // extremum point along the direction of the ray, may not be on the optic itself
    let extremumPoint;

    if ( this.isMirror() ) {

      // since mirror reflects light, the extremum point is on the mirror itself
      extremumPoint = isConcave ? leftPoint : rightPoint;
    }
    else {
      if ( isConcave ) {
        // a concave lens

        const opticPosition = this.positionProperty.value;

        // displacement vector from targetPoint to the right corner of the lens
        const rightTarget = rightPoint.minus( targetPoint );

        // displacement vector from sourcePoint to the left corner of the lens
        const leftSource = leftPoint.minus( sourcePoint );

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset1 = ( rightPoint.y - opticPosition.y ) + ( opticPosition.x - rightPoint.x ) *
                         rightTarget.y / rightTarget.x;

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset2 = ( leftPoint.y - opticPosition.y ) + ( opticPosition.x - leftPoint.x ) * leftSource.y / leftSource.x;

        // find the smallest offset to ensure that a ray will always hit both front and back surfaces
        const offsetY = Math.abs( yOffset1 ) < Math.abs( yOffset2 ) ? yOffset1 : yOffset2;

        // get the direction of the ray as measured from the source
        extremumPoint = opticPosition.plusXY( 0, offsetY );
      }
      else {
        // a convex lens
        // extremum point is based on the edge point (which is centered horizontally on the optic)
        extremumPoint = isTop ? opticBounds.centerTop : opticBounds.centerBottom;
      }
    }

    return extremumPoint;
  }
}

//TODO handle with subclassing
Optic.Type = Enumeration.byKeys( [ 'LENS', 'MIRROR' ] );

Optic.Curve = Enumeration.byKeys( [ 'CONVEX', 'CONCAVE' ] );

geometricOptics.register( 'Optic', Optic );
export default Optic;