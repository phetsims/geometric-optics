// Copyright 2021, University of Colorado Boulder

/**
 * Optic is the abstract base class for an optic in this simulation, and supports lens and mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
import Property from '../../../../axon/js/Property.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import required from '../../../../phet-core/js/required.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

abstract class Optic {

  // type of the optic
  //TODO replace with subclassing
  readonly opticType: OpticTypeEnum;

  // shape of the optic
  readonly opticShapeProperty: Property<OpticShapeEnum>;

  // position of the optic
  readonly positionProperty: Vector2Property;

  // radius of curvature (ROC) of the optic, positive is converging
  readonly radiusOfCurvatureProperty: NumberProperty;

  // index of refraction (IRC)
  readonly indexOfRefractionProperty: NumberProperty;

  // diameter of the optic, controls the optic's aperture
  readonly diameterProperty: NumberProperty;

  // sign used for math operations
  readonly sign: 1 | -1;

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

  // Returns the most extreme position within the optic that would ensure that a ray would be transmitted (or reflected).

  /**
   * @param {Object} config
   */
  protected constructor( config: any ) { //TYPESCRIPT any

    config = merge( {

      // type of optic, 'mirror' or 'lens'
      opticType: required( config.opticType ),

      // initial shape of the optic, 'convex' or 'concave'
      opticShape: required( config.opticShape ),

      // range of index of refraction, a unitless ratio
      radiusOfCurvatureRange: required( config.radiusOfCurvatureRange ),

      // range of radius of curvature, in cm
      indexOfRefractionRange: required( config.indexOfRefractionRange ),

      // range of diameter, in cm
      diameterRange: required( config.diameterRange ),

      // sign used for math operations
      sign: required( config.sign ),

      // ( opticShape: OpticShapeEnum ) => boolean, determines whether the optic is converging for the specified shape
      isConverging: required( config.isConverging ),

      // position of the optic, in cm
      position: Vector2.ZERO,

      // supported values of OpticShapeEnum, in the left-to-right order that they appear as radio buttons
      opticShapes: OpticShapeValues,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, config );

    this.opticType = config.opticType;
    this.sign = config.sign;

    this.opticShapeProperty = new Property<OpticShapeEnum>( config.opticShape, {
      validValues: config.opticShapes,
      tandem: config.tandem.createTandem( 'opticShapeProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
      phetioDocumentation: 'describes the shape of the optic'
    } );

    // In https://github.com/phetsims/geometric-optics/issues/262, it was decided that the optic should have a fixed
    // position, at the origin of the model coordinate frame.  This differs from the Flash version, where the optic
    // was draggable in x and y dimensions. It also differs from early versions of the HTML sim (including the 1.0
    // prototype) where the optic was draggable in the y dimension. I decided to continue implementing position as
    // a Property because (1) the implementation supports a movable optic, and I don't see value in ripping that out,
    // (2) my intuition tells me that a movable optic may be desired in the future, (3) implementing it as a Property
    // encourages other parts of the sim implementation to treat it as mutable, instead of making bad assumptions
    // about it being at (0,0), and (4) it is useful for PhET-iO, as a means of documenting where the optic is located.
    // If there is a future need to make position mutable, then it may be useful to consult this sha to see
    // what was changed: https://github.com/phetsims/geometric-optics/commit/c021a961816fb1911a73cdd2551c45a405816097
    this.positionProperty = new Vector2Property( config.position, {
      isValidValue: ( value: Vector2 ) => value.equals( config.position ),
      units: 'cm',
      tandem: config.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'The position of the geometric center of the optic, ' +
                           'fixed at the origin of the coordinate system.'
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
        const sign = config.isConverging( opticShape ) ? 1 : -1;

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

  // See https://github.com/phetsims/geometric-optics/issues/111
  protected abstract getExtremumPoint( sourcePoint: Vector2, targetPoint: Vector2, isTop: boolean ): Vector2;

  /**
   * Convenience method for getting the maximum diameter, in cm.
   * @returns {number}
   */
  public get maxDiameter(): number {
    return this.diameterProperty.rangeProperty.value.max;
  }

  public reset(): void {
    this.opticShapeProperty.reset();
    this.positionProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.indexOfRefractionProperty.reset();
    this.diameterProperty.reset();
  }

  /**
   * Returns a shape translated by the model position of the optic
   * @param {Shape} shape
   * @returns {Shape}
   */
  public translatedShape( shape: Shape ): Shape {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }

  /**
   * Gets the bounds of the optically "active" component, in model coordinates.
   * In practice, it means that we exclude the backing (fill) of the mirror
   * @returns {Bounds2}
   */
  public getOpticBounds(): Bounds2 {
    const outlineShape = this.shapesProperty.value.outlineShape;
    const translatedShape = this.translatedShape( outlineShape );
    return translatedShape.getBounds();
  }

  /**
   * Returns the Shape of the vertical axis, in model coordinates.
   * @returns {Shape}
   */
  public getVerticalAxis(): Shape {

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
  public getTopPoint( sourcePoint: Vector2, targetPoint: Vector2 ): Vector2 {
    return this.getExtremumPoint( sourcePoint, targetPoint, true /* isTop */ );
  }

  /**
   * Returns the bottom position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @returns {Vector2}
   */
  public getBottomPoint( sourcePoint: Vector2, targetPoint: Vector2 ): Vector2 {
    return this.getExtremumPoint( sourcePoint, targetPoint, false /* isTop */ );
  }
}

geometricOptics.register( 'Optic', Optic );

export default Optic;