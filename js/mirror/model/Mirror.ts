// Copyright 2021-2023, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Optic, { OpticOptions } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import { OpticSurfaceType } from '../../common/model/OpticSurfaceType.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MirrorShapes from './MirrorShapes.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';
import { GOSimOptions } from '../../GOSim.js';

// IOR is a fixed value for both the 'direct' and 'indirect' focal-length models.
// Although a mirror does not have an IOR, its focal length is equivalent to a lens with an IOR of 2.
const INDEX_OF_REFRACTION_RANGE = new RangeWithValue( 2, 2, 2 ); // fixed

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type MirrorOptions = SelfOptions & PickRequired<OpticOptions, 'tandem'>;

export default class Mirror extends Optic {

  // See Optic
  public readonly shapesProperty: TReadOnlyProperty<MirrorShapes>;

  public constructor( providedOptions: MirrorOptions ) {

    const focalLengthModelsTandem = providedOptions.tandem.createTandem( 'focalLengthModels' );

    const radiusOfCurvatureMagnitudePropertyFeatured = !providedOptions.isBasicsVersion; // because Basics version only has a flat mirror
    const indexOfRefractionPropertyFeatured = false; // because index of refraction is 'Hollywooded' for Mirror

    const options = optionize<MirrorOptions, SelfOptions, OpticOptions>()( {

      // OpticOptions
      opticSurfaceTypes: providedOptions.isBasicsVersion ? [ 'flat' ] : [ 'concave', 'convex', 'flat' ],
      diameterRange: GOQueryParameters.dRangeMirror, // in cm
      sign: -1, // a positive distance indicates that the image is to the left of the mirror, so invert the sign
      indexOfRefractionPropertyFeatured: indexOfRefractionPropertyFeatured,
      radiusOfCurvaturePropertyFeatured: radiusOfCurvatureMagnitudePropertyFeatured,
      directFocalLengthModelOptions: {
        focalLengthMagnitudeRange: GOQueryParameters.fRangeMirror, // in cm
        indexOfRefractionRange: INDEX_OF_REFRACTION_RANGE,
        tandem: focalLengthModelsTandem.createTandem( 'directFocalLengthModel' )
      },
      indirectFocalLengthModelOptions: {
        radiusOfCurvatureMagnitudeRange: GOQueryParameters.rocRangeMirror, // in cm
        radiusOfCurvatureMagnitudePropertyFeatured: radiusOfCurvatureMagnitudePropertyFeatured,
        indexOfRefractionRange: INDEX_OF_REFRACTION_RANGE,
        indexOfRefractionPropertyFeatured: indexOfRefractionPropertyFeatured,
        tandem: focalLengthModelsTandem.createTandem( 'indirectFocalLengthModel' )
      }
    }, providedOptions );

    assert && assert( 2 * options.directFocalLengthModelOptions.focalLengthMagnitudeRange.defaultValue ===
                      options.indirectFocalLengthModelOptions.radiusOfCurvatureMagnitudeRange.defaultValue );

    super( options );

    this.shapesProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( radiusOfCurvature, diameter ) => new MirrorShapes( radiusOfCurvature, diameter )
    );
  }

  /**
   * A mirror is converging if it is concave.
   */
  protected isConverging( opticSurfaceType: OpticSurfaceType ): boolean {
    return ( opticSurfaceType === 'concave' );
  }

  /**
   * Returns the most extreme position within the mirror that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   * @param opticalObjectPosition
   * @param opticalImagePosition
   * @param isTop - true = top extreme, false = bottom extreme
   */
  protected getExtremumPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2, isTop: boolean ): Vector2 {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const activeBounds = this.getActiveBoundsTranslated().erodedY( 1e-6 );

    // convenience variables
    const isConcave = ( this.opticSurfaceTypeProperty.value === 'concave' );
    const leftPoint = isTop ? activeBounds.leftTop : activeBounds.leftBottom;
    const rightPoint = isTop ? activeBounds.rightTop : activeBounds.rightBottom;

    // since mirror reflects light, the extremum point is on the mirror itself
    return isConcave ? leftPoint : rightPoint;
  }

  /**
   * Is the optic a mirror whose shape is exclusively flat?  This is (regrettably) needed to conditionally
   * instrument/omit PhET-iO elements for the Basics version of the sim, which has only a flat mirror.
   */
  public override isExclusivelyFlatMirror(): boolean {
    return ( this.opticSurfaceTypeProperty.validValues!.length === 1 ) &&
           ( this.opticSurfaceTypeProperty.value === 'flat' );
  }
}

geometricOptics.register( 'Mirror', Mirror );