// Copyright 2021-2023, University of Colorado Boulder

/**
 * Optic is the abstract base class for an optical element in this simulation, and supports lens and mirror.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapes from './OpticShapes.js';
import { OpticSurfaceType } from './OpticSurfaceType.js';
import Property from '../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { RaysType } from './RaysType.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import GOPreferences from './GOPreferences.js';
import { FocalLengthModelType } from './FocalLengthModelType.js';
import DirectFocalLengthModel, { DirectFocalLengthModelOptions } from './DirectFocalLengthModel.js';
import IndirectFocalLengthModel, { IndirectFocalLengthModelOptions } from './IndirectFocalLengthModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

// A flat mirror has infinite focal length and ROC. We approximate a flat mirror as a convex mirror with very-large
// focal length and ROC. Note that these very-large values will be visible in PhET-iO, and it was decided that is OK.
// See https://github.com/phetsims/geometric-optics/issues/227
const FLAT_MIRROR_FINITE_FOCAL_LENGTH = 100000; // positive, to make it convex
const FLAT_MIRROR_FINITE_RADIUS_OF_CURVATURE = 2 * FLAT_MIRROR_FINITE_FOCAL_LENGTH; // ROC = 2 * f

type SelfOptions = {

  // supported values of OpticSurfaceType, radio buttons will be created left-to-right in this order, default is [0]
  opticSurfaceTypes: OpticSurfaceType[];

  // range of diameter, in cm
  diameterRange: Range;

  // sign for computing distance between the optical image and the optic.
  // For a lens, use +1, because a positive distance indicates that the image is to the RIGHT of the lens.
  // For a mirror, use -1, because a positive distance indicates that the image is to the LEFT of the mirror.
  sign: 1 | -1;

  // models of focal length
  directFocalLengthModelOptions: DirectFocalLengthModelOptions;
  indirectFocalLengthModelOptions: IndirectFocalLengthModelOptions;

  // Whether indexOfRefractionProperty is phetioFeatured
  indexOfRefractionPropertyFeatured?: boolean;

  // Whether radiusOfCurvatureProperty is phetioFeatured
  radiusOfCurvaturePropertyFeatured?: boolean;
};

export type OpticOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

export default abstract class Optic extends PhetioObject {

  // Shapes that describe the optic
  public readonly abstract shapesProperty: TReadOnlyProperty<OpticShapes>;

  // surface type of the optic (concave, convex, flat)
  public readonly opticSurfaceTypeProperty: Property<OpticSurfaceType>;

  // position of the optic
  public readonly positionProperty: Property<Vector2>;

  // diameter of the optic, controls the optic's aperture
  public readonly diameterProperty: NumberProperty;

  // maximum diameter of the optic
  public readonly maxDiameter: number;

  // sign for computing distance between the optical image and the optic
  public readonly sign: 1 | -1;

  // focal-length models
  public readonly directFocalLengthModel: DirectFocalLengthModel;
  public readonly indirectFocalLengthModel: IndirectFocalLengthModel;

  // radius of curvature (ROC) of the optic, convex is positive, concave is negative.
  // For a flat mirror with infinite ROC, we approximate using a very large ROC.
  public readonly radiusOfCurvatureProperty: TReadOnlyProperty<number>;

  // index of refraction (IOR)
  public readonly indexOfRefractionProperty: TReadOnlyProperty<number>;

  // focal length (f) of the optic, converging is positive, diverging is negative focal length.
  public readonly focalLengthProperty: TReadOnlyProperty<number>;

  // focal points (F) to the left and right of the optic
  public readonly leftFocalPointProperty: ReadOnlyProperty<Vector2>;
  public readonly rightFocalPointProperty: ReadOnlyProperty<Vector2>;

  // twice the focal length (2f) of the optic
  public readonly twiceFocalLengthProperty: TReadOnlyProperty<number>;

  // 2F points to the left and right of the optic
  public readonly left2FProperty: ReadOnlyProperty<Vector2>;
  public readonly right2FProperty: ReadOnlyProperty<Vector2>;

  // Resets things that are specific to this class.
  private readonly resetOptic: () => void;

  protected constructor( providedOptions: OpticOptions ) {

    const options = optionize<OpticOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      indexOfRefractionPropertyFeatured: true,
      radiusOfCurvaturePropertyFeatured: true,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.sign = options.sign;

    this.opticSurfaceTypeProperty = new StringUnionProperty( options.opticSurfaceTypes[ 0 ], {
      validValues: options.opticSurfaceTypes,
      tandem: options.tandem.createTandem( 'opticSurfaceTypeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'surface type of the optic'
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
    const position = Vector2.ZERO;
    this.positionProperty = new Vector2Property( position, {
      isValidValue: ( value: Vector2 ) => value.equals( position ),
      units: 'cm',
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'The position of the geometric center of the optic, ' +
                           'fixed at the origin of the coordinate system.'
    } );

    // Models of focal length
    this.directFocalLengthModel = new DirectFocalLengthModel( this.opticSurfaceTypeProperty, options.directFocalLengthModelOptions );
    this.indirectFocalLengthModel = new IndirectFocalLengthModel( this.opticSurfaceTypeProperty, options.indirectFocalLengthModelOptions );

    // When switching between focal-length models, synchronize the new model with the old model.
    GOPreferences.focalLengthModelTypeProperty.lazyLink( ( input: string ) => {
      const focalLengthModelType = input as FocalLengthModelType;

      if ( focalLengthModelType === 'direct' ) {
        this.directFocalLengthModel.syncToModel( this.indirectFocalLengthModel );
      }
      else {
        this.indirectFocalLengthModel.syncToModel( this.directFocalLengthModel );
      }
    } );

    this.diameterProperty = new NumberProperty( options.diameterRange.defaultValue, {
      units: 'cm',
      range: options.diameterRange,
      tandem: options.tandem.createTandem( 'diameterProperty' ),
      phetioFeatured: true
    } );

    this.maxDiameter = options.diameterRange.max;

    // Get the radius-of-curvature magnitude from the current focal-length model, add the appropriate sign.
    // Convex is positive, concave is negative.
    this.radiusOfCurvatureProperty = new DerivedProperty(
      [ this.opticSurfaceTypeProperty,
        GOPreferences.focalLengthModelTypeProperty,
        this.directFocalLengthModel.radiusOfCurvatureMagnitudeProperty,
        this.indirectFocalLengthModel.radiusOfCurvatureMagnitudeProperty ],
      ( opticSurfaceType,
        focalLengthModelType,
        directRadiusOfCurvatureMagnitude,
        indirectRadiusOfCurvatureMagnitude ) => {
        if ( opticSurfaceType === 'flat' ) {
          return FLAT_MIRROR_FINITE_RADIUS_OF_CURVATURE;
        }
        else {
          const sign = ( opticSurfaceType === 'convex' ) ? 1 : -1;
          const magnitude = ( focalLengthModelType === 'direct' ) ? directRadiusOfCurvatureMagnitude : indirectRadiusOfCurvatureMagnitude;
          return sign * magnitude;
        }
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'radiusOfCurvatureProperty' ),
        phetioFeatured: options.radiusOfCurvaturePropertyFeatured,
        phetioValueType: NumberIO,
        phetioDocumentation: 'The radius of curvature (ROC) of the optic. ' +
                             'A convex optic has a positive ROC, while a concave optic has a negative ROC.'
      } );

    // Get the IOR value from the current focal-length model.
    this.indexOfRefractionProperty = new DerivedProperty(
      [ GOPreferences.focalLengthModelTypeProperty, this.directFocalLengthModel.indexOfRefractionProperty,
        this.indirectFocalLengthModel.indexOfRefractionProperty ],
      ( focalLengthModelType, directIndexOfRefraction, indirectIndexOfRefraction ) =>
        ( focalLengthModelType === 'direct' ) ? directIndexOfRefraction : indirectIndexOfRefraction, {
        // units: unitless
        tandem: options.tandem.createTandem( 'indexOfRefractionProperty' ),
        phetioFeatured: options.indexOfRefractionPropertyFeatured,
        phetioDocumentation: 'The index of refraction (IOR) of the optic',
        phetioValueType: NumberIO
      } );

    // Get the focal-length magnitude from the current focal-length model, add the appropriate sign.
    // Converging is positive, diverging is negative.
    this.focalLengthProperty = new DerivedProperty(
      [ this.opticSurfaceTypeProperty,
        GOPreferences.focalLengthModelTypeProperty,
        this.directFocalLengthModel.focalLengthMagnitudeProperty,
        this.indirectFocalLengthModel.focalLengthMagnitudeProperty ],
      ( opticSurfaceType,
        focalLengthModelType,
        directFocalLengthMagnitude,
        indirectFocalLengthMagnitude ) => {
        if ( opticSurfaceType === 'flat' ) {
          return FLAT_MIRROR_FINITE_FOCAL_LENGTH;
        }
        else {
          const sign = this.isConverging( opticSurfaceType ) ? 1 : -1;
          const magnitude = ( focalLengthModelType === 'direct' ) ? directFocalLengthMagnitude : indirectFocalLengthMagnitude;
          return sign * magnitude;
        }
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'focalLengthProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'The signed focal length of the optic. A converging optic has a positive focal length, ' +
                             'while a diverging optic has a negative focal length.'
      } );

    // left focal point (F)
    this.leftFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position, focalLength ) => position.plusXY( -Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'leftFocalPointProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioDocumentation: 'focal point F, at a distance f to the left of the optic'
      } );

    // right focal point (F)
    this.rightFocalPointProperty = new DerivedProperty(
      [ this.positionProperty, this.focalLengthProperty ],
      ( position, focalLength ) => position.plusXY( Math.abs( focalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'rightFocalPointProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioDocumentation: 'focal point F, at a distance f to the right of the optic'
      } );

    // 2f
    this.twiceFocalLengthProperty = new DerivedProperty( [ this.focalLengthProperty ], focalLength => 2 * focalLength, {
      units: 'cm',
      tandem: options.tandem.createTandem( 'twiceFocalLengthProperty' ),
      phetioValueType: NumberIO,
      phetioDocumentation: '2f, twice the focal length'
    } );

    // left 2F point
    this.left2FProperty = new DerivedProperty(
      [ this.positionProperty, this.twiceFocalLengthProperty ],
      ( position, twiceFocalLength ) => position.plusXY( -Math.abs( twiceFocalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'left2FProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioDocumentation: 'point 2F, at a distance 2f to the left of the optic'
      } );

    // right 2F point
    this.right2FProperty = new DerivedProperty(
      [ this.positionProperty, this.twiceFocalLengthProperty ],
      ( position, twiceFocalLength ) => position.plusXY( Math.abs( twiceFocalLength ), 0 ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'right2FProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioDocumentation: 'point 2F, at a distance 2f to the right of the optic'
      } );

    this.resetOptic = () => {
      this.opticSurfaceTypeProperty.reset();
      this.positionProperty.reset();
      this.directFocalLengthModel.reset();
      this.indirectFocalLengthModel.reset();
      this.diameterProperty.reset();
    };
  }

  /**
   * Returns the top position within the optic that would ensure that a ray would be transmitted (or reflected).
   */
  public getTopPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2 ): Vector2 {
    return this.getExtremumPoint( opticalObjectPosition, opticalImagePosition, true /* isTop */ );
  }

  public reset(): void {
    this.resetOptic();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Determines whether the optic is converging for the specified optical surface type.
   */
  protected abstract isConverging( opticSurfaceType: OpticSurfaceType ): boolean;

  /**
   * Returns a shape translated by the model position of the optic
   */
  protected translatedShape( shape: Shape ): Shape {
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
   */
  public getFrontShapeTranslated( raysType: RaysType ): Shape {
    if ( raysType === 'principal' ) {

      // Principal rays are refracted at the optic's vertical axis.
      // See https://github.com/phetsims/geometric-optics/issues/140
      return this.getVerticalAxis();
    }
    else {
      return this.translatedShape( this.shapesProperty.value.frontShape );
    }
  }

  /**
   * Is the optic a mirror whose shape is exclusively flat?  This is (regrettably) needed to conditionally
   * instrument/omit PhET-iO elements for the Basics version of the sim, which has only a flat mirror.
   */
  public isExclusivelyFlatMirror(): boolean {
    return false;
  }
}

geometricOptics.register( 'Optic', Optic );