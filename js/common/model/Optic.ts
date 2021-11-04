// Copyright 2021, University of Colorado Boulder

/**
 * Optic is the base class for an optic in this simulation, and supports lens and mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapes from './OpticShapes.js';
import OpticTypeEnum from './OpticTypeEnum.js';
import OpticShapeEnum, { OpticShapeValues } from './OpticShapeEnum.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Property from '../../../../axon/js/Property.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';

//TS revisit this options pattern
type OpticOptions = {
  position?: Vector2, // position of the optic, in cm
};

type OpticConfig = OpticOptions & {
  opticType: OpticTypeEnum, // type of optic, 'mirror' or 'lens'
  opticShape: OpticShapeEnum, // initial shape of the optic, 'convex' or 'concave'
  radiusOfCurvatureRange: RangeWithValue, // range of radius of curvature, in cm
  indexOfRefractionRange: RangeWithValue, // range of index of refraction, a unitless ratio
  diameterRange: RangeWithValue, // range of diameter, in cm
  tandem: Tandem
};

class Optic {

  // type of the optic
  //TODO replace with subclassing
  readonly opticType: OpticTypeEnum;

  // shape of the optic
  readonly opticShapeProperty: StringProperty;

  // y coordinate is variable, while x coordinate is fixed
  // NOTE: The Flash version allowed free dragging of the lens. But things can get more chaotic if you allow free
  // dragging, and it didn't serve a specific learning goal. So for the HTML5 version, dragging is constrained to
  // vertical (the y axis). If you attempt to change this, beware that you may encounter assumptions (possibly
  // implicit) that will break the sim.
  readonly yProperty: NumberProperty;

  // position of the optic
  readonly positionProperty: DerivedProperty<Vector2>;

  // radius of curvature of the optic, positive is converging
  readonly radiusOfCurvatureProperty: NumberProperty;

  // index of refraction
  readonly indexOfRefractionProperty: NumberProperty;

  // diameter of the optic, controls the optic's aperture
  readonly diameterProperty: NumberProperty;

  // focal length of the optic, positive=converging, negative=diverging
  readonly focalLengthProperty: DerivedProperty<number>;

  // focal point to the left of the optic
  readonly leftFocalPointProperty: DerivedProperty<Vector2>;

  // focal point to the right of the optic
  readonly rightFocalPointProperty: DerivedProperty<Vector2>;

  // shapes related to the optic
  readonly shapesProperty: DerivedProperty<OpticShapes>;

  // Determines whether the optical axis is visible.
  // PhET-iO only, cannot be controlled from the sim UI, and is not subject to reset.
  // See https://github.com/phetsims/geometric-optics/issues/252
  readonly opticalAxisVisibleProperty: BooleanProperty;

  /**
   * @param {OpticConfig} providedConfig
   */
  constructor( providedConfig: OpticConfig ) {

    const config = merge( {
      position: Vector2.ZERO,

      // phet-io options
      tandem: Tandem.REQUIRED
    } as Required<OpticOptions>, providedConfig ) as Required<OpticConfig>;

    this.opticType = config.opticType;

    this.opticShapeProperty = new Property<OpticShapeEnum>( config.opticShape, {
      validValues: OpticShapeValues,
      tandem: config.tandem.createTandem( 'opticShapeProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
      phetioDocumentation: 'describes the shape of the optic'
    } );

    this.yProperty = new NumberProperty( config.position.y, {
      units: 'cm',
      tandem: config.tandem.createTandem( 'yProperty' ),
      phetioDocumentation: 'The y (vertical) position of the optic'
    } );

    this.positionProperty = new DerivedProperty<Vector2>( [ this.yProperty ],
      ( y: number ) => new Vector2( config.position.x, y ), {
        units: 'cm',
        tandem: config.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'The position of the geometric center of the optic. ' +
                             'The optic has a fixed x (horizontal) position, and a variable y (vertical) position. ' +
                             'See yPositionProperty to change the y position.'
      } );

    this.radiusOfCurvatureProperty = new NumberProperty( config.radiusOfCurvatureRange.defaultValue, {
      units: 'cm',
      range: config.radiusOfCurvatureRange,
      tandem: config.tandem.createTandem( 'radiusOfCurvatureProperty' )
    } );

    this.indexOfRefractionProperty = new NumberProperty( config.indexOfRefractionRange.defaultValue, {
      range: config.indexOfRefractionRange,
      tandem: config.tandem.createTandem( 'indexOfRefractionProperty' )
    } );

    this.diameterProperty = new NumberProperty( config.diameterRange.defaultValue, {
      units: 'cm',
      range: config.diameterRange,
      tandem: config.tandem.createTandem( 'diameterProperty' )
    } );

    this.focalLengthProperty = new DerivedProperty<number>(
      [ this.opticShapeProperty, this.radiusOfCurvatureProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShapeEnum, radiusOfCurvature: number, indexOfRefraction: number ) => {

        // A positive sign indicates the optic is converging.
        // Sign is determined based on the shape and the type of optic.
        const sign = this.isConverging( opticShape ) ? 1 : -1;

        return sign * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }, {
        units: 'cm',
        tandem: config.tandem.createTandem( 'focalLengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    this.leftFocalPointProperty = new DerivedProperty<Vector2>(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position: Vector2, focalLength: number ) => position.plusXY( -Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: config.tandem.createTandem( 'leftFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      } );

    this.rightFocalPointProperty = new DerivedProperty<Vector2>(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position: Vector2, focalLength: number ) => position.plusXY( Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: config.tandem.createTandem( 'rightFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      } );

    this.shapesProperty = new DerivedProperty<OpticShapes>(
      [ this.opticShapeProperty, this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number ) =>
        new OpticShapes( config.opticType, opticShape, radiusOfCurvature, diameter )
    );

    this.opticalAxisVisibleProperty = new BooleanProperty( true, {
      tandem: config.tandem.createTandem( 'opticalAxisVisibleProperty' )
    } );
  }

  public reset() {
    this.opticShapeProperty.reset();
    this.yProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.indexOfRefractionProperty.reset();
    this.diameterProperty.reset();
  }

  /**
   * Convenience method for getting the maximum diameter, in cm.
   * @returns {number}
   */
  public get maxDiameter() {
    return this.diameterProperty.rangeProperty.value.max;
  }

  /**
   * Determines whether the optic is a lens.
   * @returns {boolean}
   */
  public isLens() {
    return ( this.opticType === 'lens' );
  }

  /**
   * Determines whether the optic is a mirror.
   * @returns {boolean}
   */
  public isMirror() {
    return ( this.opticType === 'mirror' );
  }

  /**
   * Determines whether the optic is concave.
   * @param {OpticShapeEnum} opticShape
   * @returns {boolean}
   */
  public isConcave( opticShape: OpticShapeEnum ) {
    return ( opticShape === 'concave' );
  }

  /**
   * Determines whether the optic is convex.
   * @param {OpticShapeEnum} opticShape
   * @returns {boolean}
   */
  public isConvex( opticShape: OpticShapeEnum ) {
    return ( opticShape === 'convex' );
  }

  /**
   * Determines whether the optic has the potential to converge rays.
   * A convex lens and a concave mirror are converging optics.
   * @param {OpticShapeEnum} opticShape
   * @returns {boolean}
   */
  public isConverging( opticShape: OpticShapeEnum ) {
    return ( this.isConvex( opticShape ) && this.isLens() ) || ( this.isConcave( opticShape ) && this.isMirror() );
  }

  /**
   * Determines whether the optic has the potential to diverge rays.
   * @param {OpticShapeEnum} opticShape
   * @returns {boolean}
   */
  public isDiverging( opticShape: OpticShapeEnum ) {
    return !this.isConverging( opticShape );
  }

  //TODO handle with subclassing
  //TODO better documentation, why +1 and -1 ?
  /**
   * Convenience function for mathematical operations.
   * Returns +1 for a lens, -1 for a mirror.
   * @returns {number}
   */
  public getSign() {
    return this.isLens() ? 1 : -1;
  }

  /**
   * Returns a shape translated by the model position of the optic
   * @param {Shape} shape
   * @returns {Shape}
   */
  public translatedShape( shape: Shape ) {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }

  /**
   * Gets the bounds of the optically "active" component, in model coordinates.
   * In practice, it means that we exclude the backing (fill) of the mirror
   * @returns {Bounds2}
   */
  public getOpticBounds() {
    const outlineShape = this.shapesProperty.value.outlineShape;
    const translatedShape = this.translatedShape( outlineShape );
    return translatedShape.getBounds();
  }

  /**
   * Returns the Shape of the vertical axis, in model coordinates.
   * @returns {Shape}
   */
  public getVerticalAxis() {

    const yMax = 800; // long enough for all zoom levels, in cm

    // a straight vertical line going through the middle of the optic
    const verticalLine = Shape.lineSegment( 0, yMax, 0, -yMax );

    return this.translatedShape( verticalLine );
  }

  /**
   * Returns the top position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @returns {Vector2}
   */
  public getTopPoint( sourcePoint: Vector2, targetPoint: Vector2 ) {
    return this.getExtremumPoint( sourcePoint, targetPoint, true /* isTop */ );
  }

  /**
   * Returns the bottom position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @returns {Vector2}
   */
  public getBottomPoint( sourcePoint: Vector2, targetPoint: Vector2 ) {
    return this.getExtremumPoint( sourcePoint, targetPoint, false /* isTop */ );
  }

  /**
   * Returns the most extreme position within the optic that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @param {boolean} isTop
   * @returns {Vector2}
   */
  private getExtremumPoint( sourcePoint: Vector2, targetPoint: Vector2, isTop: boolean ) {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const isConcave = this.isConcave( this.opticShapeProperty.value );
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

geometricOptics.register( 'Optic', Optic );

export default Optic;
export { OpticConfig };