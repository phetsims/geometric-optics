// Copyright 2021-2022, University of Colorado Boulder

/**
 * Optic is the abstract base class for an optic in this simulation, and supports lens and mirror.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

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
import { OpticShape, OpticShapeValues } from './OpticShape.js';
import Property from '../../../../axon/js/Property.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { RaysType } from './RaysType.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';

type OpticOptions = {

  // initial shape of the optic, 'convex' or 'concave'
  opticShape: OpticShape,

  // supported values of OpticShape, in the left-to-right order that they appear as radio buttons
  opticShapes: OpticShape[]

  // range of index of refraction, a unitless ratio
  radiusOfCurvatureRange: Range,

  // range of radius of curvature, in cm
  indexOfRefractionRange: Range,

  // range of diameter, in cm
  diameterRange: Range,

  // sign used for math operations
  sign: 1 | -1,

  // determines whether the optic is converging for the specified shape
  isConverging: ( opticShape: OpticShape ) => boolean,

  // position of the optic, in cm
  position?: Vector2

  // phet-io options
  tandem: Tandem,
  phetioDocumentation?: string
};

abstract class Optic extends PhetioObject {

  // Shapes that describe the optic
  readonly abstract shapesProperty: IReadOnlyProperty<OpticShapes>;

  // shape of the optic (concave, convex, flat)
  readonly opticShapeProperty: Property<OpticShape>;

  // position of the optic
  readonly positionProperty: Property<Vector2>;

  // radius of curvature (ROC) of the optic, positive is converging
  readonly radiusOfCurvatureProperty: NumberProperty;

  // index of refraction (IRC)
  readonly indexOfRefractionProperty: NumberProperty;

  // diameter of the optic, controls the optic's aperture
  readonly diameterProperty: NumberProperty;

  // maximum diameter of the optic
  readonly maxDiameter: number;

  // sign used for math operations
  readonly sign: 1 | -1;

  // focal length (f) of the optic, positive=converging, negative=diverging
  readonly focalLengthProperty: IReadOnlyProperty<number>;

  // focal points (F) to the left and right of the optic
  readonly leftFocalPointProperty: Property<Vector2>;
  readonly rightFocalPointProperty: Property<Vector2>;

  // twice the focal length (2f) of the optic
  readonly twiceFocalLengthProperty: IReadOnlyProperty<number>;

  // 2F points to the left and right of the optic
  readonly left2FProperty: Property<Vector2>;
  readonly right2FProperty: Property<Vector2>;

  private readonly resetOptic: () => void;

  /**
   * @param providedOptions
   */
  protected constructor( providedOptions: OpticOptions ) {

    const options = merge( {
      position: Vector2.ZERO,
      opticShapes: OpticShapeValues,
      phetioState: false
    }, providedOptions );

    super( options );

    this.sign = options.sign;

    this.opticShapeProperty = new Property( options.opticShape, {
      validValues: options.opticShapes,
      tandem: options.tandem.createTandem( 'opticShapeProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
      phetioDocumentation: 'describes the surface shape of the optic'
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
    this.positionProperty = new Vector2Property( options.position, {
      isValidValue: ( value: Vector2 ) => value.equals( options.position ),
      units: 'cm',
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'The position of the geometric center of the optic, ' +
                           'fixed at the origin of the coordinate system.'
    } );

    this.radiusOfCurvatureProperty = new NumberProperty( options.radiusOfCurvatureRange.defaultValue, {
      units: 'cm',
      range: options.radiusOfCurvatureRange,
      tandem: options.tandem.createTandem( 'radiusOfCurvatureProperty' )
    } );

    this.indexOfRefractionProperty = new NumberProperty( options.indexOfRefractionRange.defaultValue, {
      range: options.indexOfRefractionRange,
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' )
    } );

    this.diameterProperty = new NumberProperty( options.diameterRange.defaultValue, {
      units: 'cm',
      range: options.diameterRange,
      tandem: options.tandem.createTandem( 'diameterProperty' )
    } );

    this.maxDiameter = options.diameterRange.max;

    this.focalLengthProperty = new DerivedProperty(
      [ this.opticShapeProperty, this.radiusOfCurvatureProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShape, radiusOfCurvature: number, indexOfRefraction: number ) => {

        // A positive sign indicates the optic is converging.
        // Sign is determined based on the shape and the type of optic.
        const sign = options.isConverging( opticShape ) ? 1 : -1;

        return sign * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'focalLengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'the focal length, f'
      } );

    this.leftFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position: Vector2, focalLength: number ) => position.plusXY( -Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'leftFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'focal point F, at a distance f to the left of the optic'
      } );

    this.rightFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position: Vector2, focalLength: number ) => position.plusXY( Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'rightFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'focal point F, at a distance f to the right of the optic'
      } );

    this.twiceFocalLengthProperty = new DerivedProperty( [ this.focalLengthProperty ], focalLength => 2 * focalLength, {
      units: 'cm',
      tandem: options.tandem.createTandem( 'twiceFocalLengthProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
      phetioDocumentation: '2f, twice the focal length'
    } );

    this.left2FProperty = new DerivedProperty(
      [ this.positionProperty, this.twiceFocalLengthProperty ],
      ( position: Vector2, twiceFocalLength: number ) => position.plusXY( -Math.abs( twiceFocalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'left2FProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'point 2F, at a distance 2f to the left of the optic'
      } );

    this.right2FProperty = new DerivedProperty(
      [ this.positionProperty, this.twiceFocalLengthProperty ],
      ( position: Vector2, twiceFocalLength: number ) => position.plusXY( Math.abs( twiceFocalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'right2FProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'point 2F, at a distance 2f to the right of the optic'
      } );

    this.resetOptic = () => {
      this.opticShapeProperty.reset();
      this.positionProperty.reset();
      this.radiusOfCurvatureProperty.reset();
      this.indexOfRefractionProperty.reset();
      this.diameterProperty.reset();
    };
  }

  /**
   * Returns the top position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @param opticalObjectPosition
   * @param opticalImagePosition
   */
  public getTopPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2 ): Vector2 {
    return this.getExtremumPoint( opticalObjectPosition, opticalImagePosition, true /* isTop */ );
  }

  public reset(): void {
    this.resetOptic();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Returns a shape translated by the model position of the optic
   */
  private translatedShape( shape: Shape ): Shape {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }

  /**
   * Gets the bounds of the "active" part of the optic, in model coordinates.
   * For a lens, this is the complete lens. For a mirror, it's the reflective coating.
   */
  protected getActiveBoundsTranslated(): Bounds2 {
    return this.translatedShape( this.shapesProperty.value.activeBoundsShape ).getBounds();
  }

  /**
   * Returns the Shape of the vertical axis, in model coordinates.
   */
  public getVerticalAxis(): Shape {

    // Long enough for all zoom levels, in cm. If for some reason this is not long enough, this method is used to
    // render the axis in the view, so it will be obvious.
    const yMax = 2000;

    // a straight vertical line going through the middle of the optic
    const verticalLine = Shape.lineSegment( 0, yMax, 0, -yMax );

    return this.translatedShape( verticalLine );
  }

  /**
   * Returns the bottom position within the optic that would ensure that a ray would be transmitted (or reflected).
   * @param opticalObjectPosition
   * @param opticalImagePosition
   */
  public getBottomPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2 ): Vector2 {
    return this.getExtremumPoint( opticalObjectPosition, opticalImagePosition, false /* isTop */ );
  }

  /**
   * Returns the most extreme position within the optic that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   */
  protected abstract getExtremumPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2, isTop: boolean ): Vector2;

  /**
   * Gets the shape of the front (left) surface of the optic. This is the surface that a ray will initially hit.
   * @param raysType
   */
  getFrontShapeTranslated( raysType: RaysType ): Shape {
    if ( raysType === 'principal' ) {

      // Principal rays are refracted at the optic's vertical axis.
      // See https://github.com/phetsims/geometric-optics/issues/140
      return this.getVerticalAxis();
    }
    else {
      return this.translatedShape( this.shapesProperty.value.frontShape );
    }
  }

  //TODO this fails for a mirror, because backShape is null, so doesn't belong in Optic
  /**
   * Gets the shape of the back (right) surface of the optic.
   */
  getBackShapeTranslated(): Shape {
    const backShape = this.shapesProperty.value.backShape;
    assert && assert( backShape ); // {Shape|null}
    return this.translatedShape( backShape! );
  }
}

geometricOptics.register( 'Optic', Optic );

export default Optic;
export type { OpticOptions };