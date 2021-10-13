// Copyright 2021, University of Colorado Boulder

/**
 * A class of an optical element in the simulation.
 * An optical element is the base class for a lens or a mirror.
 * Responsibility include the radius of curvature, the diameter and the curve
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapes from './OpticShapes.js';

// constants
const NORMALIZED_VALUE_RANGE = new Range( 0, 1 );

class Optic {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // {Optic.Type} type of optical element, MIRROR or LENS
      opticType: required( config.opticType ),

      // {Optic.Curve} initial curve of optical element, CONVEX or CONCAVE
      initialCurve: required( config.initialCurve ),

      // {Vector2} center of the optic
      initialPosition: required( config.initialPosition ),

      // {RangeWithValue} range of radius of curvature, in cm
      radiusOfCurvatureRange: required( config.radiusOfCurvatureRange ),

      // {RangeWithValue} range of index of refraction, a unitless ratio
      indexOfRefractionRange: required( config.indexOfRefractionRange ),

      // {RangeWithValue} range of height for the optic, in cm
      diameterRange: required( config.diameterRange )
    }, config );

    assert && assert( Optic.Type.includes( config.opticType ) );
    assert && assert( Optic.Curve.includes( config.initialCurve ) );
    assert && assert( config.initialPosition instanceof Vector2 );
    assert && assert( config.radiusOfCurvatureRange instanceof RangeWithValue );
    assert && assert( config.indexOfRefractionRange instanceof RangeWithValue );
    assert && assert( config.diameterRange instanceof RangeWithValue );

    // @private {Optic.Type} Type of the optical element ( valid choices: LENS and MIRROR)
    this.opticType = config.opticType;

    // @public type of Curvature of the optical element.
    //TODO rename Optic.Curve and curveProperty
    this.curveProperty = new EnumerationProperty( Optic.Curve, config.initialCurve );

    // @public {RangeWithValue}
    this.maxDiameter = config.diameterRange.max;

    // @public (read-only) position of the optical element. Use setY to set the y position.
    this.positionProperty = new Vector2Property( config.initialPosition );

    // @public radius of curvature of the optical element. Positive is converging.
    this.radiusOfCurvatureProperty = new NumberProperty( config.radiusOfCurvatureRange.defaultValue, {
      range: config.radiusOfCurvatureRange
    } );

    // @public height of the optical element - controls the optical aperture of the optical element
    this.diameterProperty = new NumberProperty( config.diameterRange.defaultValue, {
      range: config.diameterRange
    } );

    // @public index of refraction of the lens
    this.indexOfRefractionProperty = new NumberProperty( config.indexOfRefractionRange.defaultValue, {
      range: config.indexOfRefractionRange
    } );

    // @public {DerivedProperty.<number>} focal length of the optic
    // positive indicate the optic is converging whereas negative indicates the optic is diverging.
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.indexOfRefractionProperty, this.curveProperty ],
      ( radiusOfCurvature, indexOfRefraction, curve ) => {

        // a positive sign indicates the optic is converging
        // sign is determined based on the curve and the type of optic.
        const sign = this.getConvergingSign( curve );

        return sign * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }
    );

    // @public {DerivedProperty.<boolean>} is the optical element converging.
    this.isConvergingProperty = new DerivedProperty(
      [ this.curveProperty ],
      curve => this.isConverging( curve )
    );

    // @public {DerivedProperty.<number>} is the optical element converging.
    // +1 is the optical element is converging and -1 if it is diverging
    this.convergingSignProperty = new DerivedProperty(
      [ this.curveProperty ],
      curve => this.getConvergingSign( curve )
    );

    // @public {DerivedProperty.<OpticShapes>} shapes of the optical element
    this.shapesProperty = new DerivedProperty(
      [ this.curveProperty, this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( curve, radiusOfCurvature, diameter ) => new OpticShapes( config.opticType, curve, radiusOfCurvature, diameter )
    );
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.diameterProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.curveProperty.reset();
    this.indexOfRefractionProperty.reset();
  }

  /**
   * Sets the y position of the optical element while keeping the x-coordinate constant
   * @public
   * @param {number} y
   */
  setY( y ) {
    assert && assert( typeof y === 'number' && isFinite( y ) );
    this.positionProperty.value = new Vector2( this.positionProperty.value.x, y );
  }

  /**
   * Returns a boolean indicating if the optical element is a lens
   * @public
   * @returns {boolean}
   */
  isLens() {
    return ( this.opticType === Optic.Type.LENS );
  }

  /**
   * Returns a boolean indicating if the optical element is a mirror
   * @public
   * @returns {boolean}
   */
  isMirror() {
    return ( this.opticType === Optic.Type.MIRROR );
  }

  /**
   * Returns a boolean indicating if the optical element is concave
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConcave( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return ( curve === Optic.Curve.CONCAVE );
  }

  /**
   * Returns a boolean indicating if the optical element is convex
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConvex( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return ( curve === Optic.Curve.CONVEX );
  }

  /**
   * Returns a boolean indicating if the optical element has the potential to converge rays.
   * This is solely a property of the optical element.
   * A convex lens and a concave mirror are converging optical elements.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConverging( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return ( this.isConvex( curve ) && this.isLens() ) || ( this.isConcave( curve ) && this.isMirror() );
  }

  /**
   * Returns a boolean indicating if the optical element is convex
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isDiverging( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return !this.isConverging( curve );
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is converging and -1 is the element is diverging.
   * @public
   * @param {Optic.Curve} curve
   * @returns {number}
   */
  getConvergingSign( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return this.isConverging( curve ) ? 1 : -1;
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is convex and -1 is the element is concave.
   * @public
   * @param {Optic.Curve} curve
   * @returns {number}
   */
  getCurveSign( curve ) {
    assert && assert( Optic.Curve.includes( curve ) );
    return this.isConvex( curve ) ? 1 : -1;
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is a lens and -1 is the element is a mirror.
   * @public
   * @returns {number}
   */
  getTypeSign() {
    return this.isLens() ? 1 : -1;
  }

  /**
   * Returns the type of optical element (Possible values are CONCAVE and CONVEX).
   * @public
   * @returns {Optic.Curve}
   */
  getCurve() {
    return this.curveProperty.value;
  }

  /**
   * Returns a normalized value (with a max of 1) for the diameter
   * @public
   * @param {number} diameter
   * @returns {number}
   */
  getNormalizedDiameter( diameter ) {
    assert && assert( typeof diameter === 'number' && diameter > 0 );
    const normalizedDiameter = diameter / this.maxDiameter;
    assert && assert( NORMALIZED_VALUE_RANGE.contains( normalizedDiameter ) );
    return normalizedDiameter;
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
   * Gets the bounds of the optically "active" component
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
   * Returns a normalized value (between 0 and 1) for the index of refraction
   * @public
   * @param {number} indexOfRefraction - index of refraction
   * @returns {number}
   */
  getNormalizedIndex( indexOfRefraction ) {
    assert && assert( indexOfRefraction );
    const normalizedIndex = this.isLens() ?
                            this.indexOfRefractionProperty.range.getNormalizedValue( indexOfRefraction ) :
                            NORMALIZED_VALUE_RANGE.max;
    assert && assert( NORMALIZED_VALUE_RANGE.contains( normalizedIndex ) );
    return normalizedIndex;
  }

  /**
   * Returns the shape of the vertical line
   * @public
   * @returns {Shape}
   */
  getPrincipalLine() {

    // a very large extent
    const yMax = 800; // in cm

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
  getTopOpticPoint( sourcePoint, targetPoint ) {
    return this.getExtremumPoint( sourcePoint, targetPoint, true /* isTop */ );
  }

  /**
   * Returns the bottom position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @public
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @returns {Vector2}
   */
  getBottomOpticPoint( sourcePoint, targetPoint ) {
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

    // erode the bounds a tiny bit such that such that the point is always within the bounds
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const isConcave = this.isConcave( this.getCurve() );
    const leftPoint = isTop ? opticBounds.leftTop : opticBounds.leftBottom;
    const rightPoint = isTop ? opticBounds.rightTop : opticBounds.rightBottom;
    const centerPoint = isTop ? opticBounds.centerTop : opticBounds.centerBottom;
    const opticPoint = this.positionProperty.value;

    // extrema point along the direction of the ray - may not be on the optic itself
    let spotPoint;

    if ( this.isMirror() ) {

      // since mirror reflect light, the spot point on the mirror itself
      spotPoint = isConcave ? leftPoint : rightPoint;
    }
    else {

      // must be a lens
      if ( isConcave ) {

        // displacement vector from targetPoint to the right corner of the lens
        const rightTarget = rightPoint.minus( targetPoint );

        // displacement vector from sourcePoint to the left corner of the lens
        const leftSource = leftPoint.minus( sourcePoint );

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset1 = ( rightPoint.y - opticPoint.y ) + ( opticPoint.x - rightPoint.x ) *
                         rightTarget.y / rightTarget.x;

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset2 = ( leftPoint.y - opticPoint.y ) + ( opticPoint.x - leftPoint.x ) * leftSource.y / leftSource.x;

        // find the smallest offset to ensure that a ray will always hit both front and back surfaces
        const offsetY = Math.abs( yOffset1 ) < Math.abs( yOffset2 ) ? yOffset1 : yOffset2;

        // get the direction of the ray as measured from the source
        spotPoint = opticPoint.plusXY( 0, offsetY );
      }
      else {
        // must be a convex lens

        // spot is based on the edge point (which is centered horizontally on the optic)
        spotPoint = centerPoint;
      }
    }

    return spotPoint;
  }
}

Optic.Type = Enumeration.byKeys( [ 'LENS', 'MIRROR' ] );

//TODO rename to CurveType
Optic.Curve = Enumeration.byKeys( [ 'CONVEX', 'CONCAVE' ] );

geometricOptics.register( 'Optic', Optic );
export default Optic;