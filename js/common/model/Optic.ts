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
import GOGlobalOptions from '../GOGlobalOptions.js';
import { FocalLengthControlType } from './FocalLengthControlType.js';
import DirectFocalLengthModel, { DirectFocalLengthModelOptions } from './DirectFocalLengthModel.js';
import IndirectFocalLengthModel, { IndirectFocalLengthModelOptions } from './IndirectFocalLengthModel.js';

type OpticOptions = {

  // initial shape of the optic, 'convex' or 'concave'
  opticShape: OpticShape,

  // supported values of OpticShape, in the left-to-right order that they appear as radio buttons
  opticShapes: OpticShape[]

  // range of diameter, in cm
  diameterRange: Range,

  // sign used for math operations
  sign: 1 | -1,

  // models of focal length
  directFocalLengthModelOptions: DirectFocalLengthModelOptions,
  indirectFocalLengthModelOptions: IndirectFocalLengthModelOptions,

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

  // diameter of the optic, controls the optic's aperture
  readonly diameterProperty: NumberProperty;

  // maximum diameter of the optic
  readonly maxDiameter: number;

  // sign used for math operations
  readonly sign: 1 | -1;

  // focal-length models
  readonly directFocalLengthModel: DirectFocalLengthModel;
  readonly indirectFocalLengthModel: IndirectFocalLengthModel;

  // radius of curvature (ROC) of the optic, positive is converging
  readonly radiusOfCurvatureProperty: IReadOnlyProperty<number>;

  // index of refraction (IRC)
  readonly indexOfRefractionProperty: IReadOnlyProperty<number>;

  // focal length (f) of the optic, positive=converging, negative=diverging
  readonly focalLengthProperty: IReadOnlyProperty<number>;

  // While working on https://github.com/phetsims/geometric-optics/issues/255 (adding direct control of Focal Length)
  // it was discovered that focalLengthProperty was not always a positive value. A sign was baked into the value,
  // indicating where the optical image was to be formed. This made it problematic to set Focal Length directly.
  // So the sign was removed from focalLengthProperty, and was added to this derived Property. So...
  // This is the focal length, with a sign added that indicates where the optical image is formed.
  // For a lens, a positive value indicates that the image is to the right of the lens.
  // For a mirror, a positive value indicates that the image is to the left of the mirror.
  readonly signedFocalLengthProperty: IReadOnlyProperty<number>;

  // focal points (F) to the left and right of the optic
  readonly leftFocalPointProperty: Property<Vector2>;
  readonly rightFocalPointProperty: Property<Vector2>;

  // twice the focal length (2f) of the optic
  readonly twiceFocalLengthProperty: IReadOnlyProperty<number>;

  // 2F points to the left and right of the optic
  readonly left2FProperty: Property<Vector2>;
  readonly right2FProperty: Property<Vector2>;

  // Resets things that are specific to this class.
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

    // Models of focal length
    this.directFocalLengthModel = new DirectFocalLengthModel( this.opticShapeProperty, options.directFocalLengthModelOptions );
    this.indirectFocalLengthModel = new IndirectFocalLengthModel( this.opticShapeProperty, options.indirectFocalLengthModelOptions );

    // When switching between focal-length models, transfer value(s) from the previous model to the current model.
    // Constrain values so that floating-point error doesn't cause range exceptions.
    GOGlobalOptions.focalLengthControlTypeProperty.link( ( focalLengthControlType: FocalLengthControlType ) => {
      if ( focalLengthControlType === 'direct' ) {

        // Copy focalLength from indirect to direct
        assert && assert( this.directFocalLengthModel.focalLengthProperty.range ); // {Range|null}
        this.directFocalLengthModel.focalLengthProperty.value =
          this.directFocalLengthModel.focalLengthProperty.range!.constrainValue( this.indirectFocalLengthModel.focalLengthProperty.value );
      }
      else {

        // Copy radiusOfCurvature from direct to indirect
        assert && assert( this.indirectFocalLengthModel.radiusOfCurvatureProperty.range ); // {Range|null}
        this.indirectFocalLengthModel.radiusOfCurvatureProperty.value =
          this.indirectFocalLengthModel.radiusOfCurvatureProperty.range!.constrainValue( this.directFocalLengthModel.radiusOfCurvatureProperty.value );

        // Copy indexOfRefraction from direct to indirect
        assert && assert( this.indirectFocalLengthModel.indexOfRefractionProperty.range ); // {Range|null}
        this.indirectFocalLengthModel.indexOfRefractionProperty.value =
          this.indirectFocalLengthModel.indexOfRefractionProperty.range!.constrainValue( this.directFocalLengthModel.indexOfRefractionProperty.value );
      }
    } );

    this.diameterProperty = new NumberProperty( options.diameterRange.defaultValue, {
      units: 'cm',
      range: options.diameterRange,
      tandem: options.tandem.createTandem( 'diameterProperty' )
    } );

    this.maxDiameter = options.diameterRange.max;

    // Get the radius of curvature value from the current focal-length model.
    this.radiusOfCurvatureProperty = new DerivedProperty(
      [ GOGlobalOptions.focalLengthControlTypeProperty, this.directFocalLengthModel.radiusOfCurvatureProperty, this.indirectFocalLengthModel.radiusOfCurvatureProperty ],
      ( focalLengthControlType: string, radiusOfCurvatureDirect: number, radiusOfCurvatureIndirect: number ) =>
        ( focalLengthControlType === 'direct' ) ? radiusOfCurvatureDirect : radiusOfCurvatureIndirect, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'radiusOfCurvatureProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
    phet.log && this.radiusOfCurvatureProperty.link( ( radiusOfCurvature: number ) => {
      phet.log && phet.log( `radiusOfCurvature=${radiusOfCurvature}` );
    } );

    // Get the index of refraction value from the current focal-length model.
    this.indexOfRefractionProperty = new DerivedProperty(
      [ GOGlobalOptions.focalLengthControlTypeProperty, this.directFocalLengthModel.indexOfRefractionProperty, this.indirectFocalLengthModel.indexOfRefractionProperty ],
      ( focalLengthControlType: string, indexOfRefractionDirect: number, indexOfRefractionIndirect: number ) =>
        ( focalLengthControlType === 'direct' ) ? indexOfRefractionDirect : indexOfRefractionIndirect, {
        // units: unitless
        tandem: options.tandem.createTandem( 'indexOfRefractionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
    phet.log && this.indexOfRefractionProperty.link( ( indexOfRefraction: number ) => {
      phet.log && phet.log( `indexOfRefraction=${indexOfRefraction}` );
    } );

    // Use the focal length (f) value from the current focal-length model.
    this.focalLengthProperty = new DerivedProperty(
      [ GOGlobalOptions.focalLengthControlTypeProperty, this.directFocalLengthModel.focalLengthProperty, this.indirectFocalLengthModel.focalLengthProperty ],
      ( focalLengthControlType: string, focalLengthDirect: number, focalLengthIndirect: number ) =>
        ( focalLengthControlType === 'direct' ) ? focalLengthDirect : focalLengthIndirect, {
        units: 'cm',
        isValidValue: ( value: number ) => ( value > 0 ),
        tandem: options.tandem.createTandem( 'focalLengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
    phet.log && this.focalLengthProperty.link( ( focalLength: number ) => {
      phet.log && phet.log( `focalLength=${focalLength}` );
    } );

    this.signedFocalLengthProperty = new DerivedProperty(
      [ this.focalLengthProperty, this.opticShapeProperty ],
      ( focalLength: number, opticShape: OpticShape ) => focalLength * ( this.isConverging( opticShape ) ? 1 : -1 )
    );

    // left focal point (F)
    this.leftFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position: Vector2, focalLength: number ) => position.plusXY( -focalLength, 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'leftFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'focal point F, at a distance f to the left of the optic'
      } );

    // right focal point (F)
    this.rightFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position: Vector2, focalLength: number ) => position.plusXY( focalLength, 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'rightFocalPointProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'focal point F, at a distance f to the right of the optic'
      } );

    // 2f
    this.twiceFocalLengthProperty = new DerivedProperty( [ this.focalLengthProperty ], focalLength => 2 * focalLength, {
      units: 'cm',
      isValidValue: ( value: number ) => ( value > 0 ),
      tandem: options.tandem.createTandem( 'twiceFocalLengthProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
      phetioDocumentation: '2f, twice the focal length'
    } );

    // left 2F point
    this.left2FProperty = new DerivedProperty(
      [ this.positionProperty, this.twiceFocalLengthProperty ],
      ( position: Vector2, twiceFocalLength: number ) => position.plusXY( -twiceFocalLength, 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'left2FProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'point 2F, at a distance 2f to the left of the optic'
      } );

    // right 2F point
    this.right2FProperty = new DerivedProperty(
      [ this.positionProperty, this.twiceFocalLengthProperty ],
      ( position: Vector2, twiceFocalLength: number ) => position.plusXY( twiceFocalLength, 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'right2FProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO ),
        phetioDocumentation: 'point 2F, at a distance 2f to the right of the optic'
      } );

    this.resetOptic = () => {
      this.opticShapeProperty.reset();
      this.positionProperty.reset();
      this.directFocalLengthModel.reset();
      this.indirectFocalLengthModel.reset();
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
   * Determines whether the optic is converging for the specified optical shape.
   * @param opticShape
   */
  protected abstract isConverging( opticShape: OpticShape ): boolean;

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