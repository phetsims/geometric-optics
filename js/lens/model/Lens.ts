// Copyright 2021-2022, University of Colorado Boulder

/**
 * Lens is the model of a lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Optic, { OpticOptions } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import { OpticShape } from '../../common/model/OpticShape.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LensShapes from './LensShapes.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';

// IOR is a fixed value for the 'direct' focal-length model.
const DIRECT_INDEX_OF_REFRACTION = 1.5;

type SelfOptions = {};

type LensOptions = SelfOptions & PickRequired<OpticOptions, 'tandem'>;

export default class Lens extends Optic {

  // See Optic
  public readonly shapesProperty: IReadOnlyProperty<LensShapes>;

  // opacity of the lens
  public readonly opacityProperty: IReadOnlyProperty<number>;

  constructor( providedOptions: LensOptions ) {

    const focalLengthModelsTandem = providedOptions.tandem.createTandem( 'focalLengthModels' );

    const options = optionize<LensOptions, SelfOptions, OpticOptions>()( {

      // OpticOptions
      opticShapes: [ 'convex', 'concave' ],
      diameterRange: GOQueryParameters.dRangeLens, // in cm
      sign: 1, // a positive distance indicates that the image is to the right of the lens
      directFocalLengthModelOptions: {
        focalLengthMagnitudeRange: GOQueryParameters.fRangeLens, // in cm
        indexOfRefractionRange: new RangeWithValue( DIRECT_INDEX_OF_REFRACTION, DIRECT_INDEX_OF_REFRACTION, DIRECT_INDEX_OF_REFRACTION ), // fixed and unitless
        tandem: focalLengthModelsTandem.createTandem( 'directFocalLengthModel' )
      },
      indirectFocalLengthModelOptions: {
        radiusOfCurvatureMagnitudeRange: GOQueryParameters.rocRangeLens, // in cm
        indexOfRefractionRange: GOQueryParameters.iorRangeLens, // unitless
        tandem: focalLengthModelsTandem.createTandem( 'indirectFocalLengthModel' )
      }
    }, providedOptions );

    assert && assert( !options.opticShapes.includes( 'flat' ), 'flat lens is not supported' );
    assert && assert( options.directFocalLengthModelOptions.focalLengthMagnitudeRange.defaultValue ===
                      options.indirectFocalLengthModelOptions.radiusOfCurvatureMagnitudeRange.defaultValue );
    assert && assert( options.indirectFocalLengthModelOptions.indexOfRefractionRange.contains( DIRECT_INDEX_OF_REFRACTION ) );

    super( options );

    this.shapesProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( radiusOfCurvature: number, diameter: number ) => new LensShapes( radiusOfCurvature, diameter )
    );

    // Index of refraction determines the lens opacity.
    // The lens is never fully transparent, because its IOR is not equivalent to air.
    // See https://github.com/phetsims/geometric-optics/issues/242
    this.opacityProperty = new DerivedProperty( [ this.indexOfRefractionProperty ],
      ( indexOfRefraction: number ) => {

        // Use the indirect model's IOR range in all cases, because the direct model's IOR is fixed.
        assert && assert( this.indirectFocalLengthModel.indexOfRefractionProperty.range ); // {Range|null}
        const range = this.indirectFocalLengthModel.indexOfRefractionProperty.range!;
        return Utils.linear( range.min, range.max, 0.2, 1, indexOfRefraction );
      } );
  }

  /**
   * Returns the most extreme position within the lens that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   * @param opticalObjectPosition
   * @param opticalImagePosition
   * @param isTop - true = top extreme, false = bottom extreme
   */
  protected getExtremumPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2, isTop: boolean ): Vector2 {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const activeBounds = this.getActiveBoundsTranslated().erodedY( 1e-6 );

    // convenience variables
    const leftPoint = isTop ? activeBounds.leftTop : activeBounds.leftBottom;
    const rightPoint = isTop ? activeBounds.rightTop : activeBounds.rightBottom;
    const opticShape = this.opticShapeProperty.value;

    // extremum point along the direction of the ray, may not be on the optic itself
    let extremumPoint;
    if ( opticShape === 'concave' ) {

      const opticPosition = this.positionProperty.value;

      // displacement vector from opticalImagePosition to the right corner of the lens
      const rightTarget = rightPoint.minus( opticalImagePosition );

      // displacement vector from opticalObjectPosition to the left corner of the lens
      const leftSource = leftPoint.minus( opticalObjectPosition );

      // yOffset (from center of lens) of a ray directed from opticalImagePosition to the right corner of lens
      const yOffset1 = ( rightPoint.y - opticPosition.y ) + ( opticPosition.x - rightPoint.x ) *
                       rightTarget.y / rightTarget.x;

      // yOffset (from center of lens) of a ray directed from opticalImagePosition to the right corner of lens
      const yOffset2 = ( leftPoint.y - opticPosition.y ) + ( opticPosition.x - leftPoint.x ) * leftSource.y / leftSource.x;

      // find the smallest offset to ensure that a ray will always hit both front and back surfaces
      const offsetY = Math.abs( yOffset1 ) < Math.abs( yOffset2 ) ? yOffset1 : yOffset2;

      // get the direction of the ray as measured from the optical object
      extremumPoint = opticPosition.plusXY( 0, offsetY );
    }
    else if ( opticShape === 'convex' ) {

      // extremum point is based on the edge point (which is centered horizontally on the optic)
      extremumPoint = isTop ? activeBounds.centerTop : activeBounds.centerBottom;
    }
    else {
      throw new Error( `unsupported lens shape: ${opticShape}` );
    }

    return extremumPoint;
  }

  /**
   * Gets the shape of the back (right) surface of the lens.
   */
  getBackShapeTranslated(): Shape {
    const backShape = this.shapesProperty.value.backShape;
    assert && assert( backShape ); // {Shape|null}
    return this.translatedShape( backShape! );
  }

  /**
   * A lens is converging if it is convex.
   */
  protected isConverging( opticShape: OpticShape ): boolean {
    return ( opticShape === 'convex' );
  }
}

geometricOptics.register( 'Lens', Lens );