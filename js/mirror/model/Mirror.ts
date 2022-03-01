// Copyright 2021-2022, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Optic, { OpticOptions } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import { OpticShape } from '../../common/model/OpticShape.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MirrorShapes from './MirrorShapes.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';

// IOR is a fixed value for both the 'direct' and 'indirect' focal-length models.
// Although a mirror does not have an IOR, its focal length is equivalent to a lens with an IOR of 2.
const INDEX_OF_REFRACTION_RANGE = new RangeWithValue( 2, 2, 2 ); // fixed

type SelfOptions = {
  isBasicsVersion: boolean
};

type MirrorOptions = SelfOptions & PickRequired<OpticOptions, 'tandem'>;

class Mirror extends Optic {

  // See Optic
  public readonly shapesProperty: IReadOnlyProperty<MirrorShapes>;

  constructor( providedOptions: MirrorOptions ) {

    const focalLengthModelsTandem = providedOptions.tandem.createTandem( 'focalLengthModels' );

    const options = optionize<MirrorOptions, SelfOptions, OpticOptions,
      'opticShapes' | 'diameterRange' | 'sign' | 'directFocalLengthModelOptions' | 'indirectFocalLengthModelOptions'>( {

      // OpticOptions
      opticShapes: providedOptions.isBasicsVersion ? [ 'flat' ] : [ 'concave', 'convex', 'flat' ],
      diameterRange: GOQueryParameters.dRangeMirror, // in cm
      sign: -1,
      directFocalLengthModelOptions: {
        focalLengthMagnitudeRange: GOQueryParameters.fRangeMirror, // in cm
        indexOfRefractionRange: INDEX_OF_REFRACTION_RANGE,
        tandem: focalLengthModelsTandem.createTandem( 'directFocalLengthModel' )
      },
      indirectFocalLengthModelOptions: {
        radiusOfCurvatureMagnitudeRange: GOQueryParameters.rocRangeMirror, // in cm
        indexOfRefractionRange: INDEX_OF_REFRACTION_RANGE,
        tandem: focalLengthModelsTandem.createTandem( 'indirectFocalLengthModel' )
      }
    }, providedOptions );

    assert && assert( 2 * options.directFocalLengthModelOptions.focalLengthMagnitudeRange.defaultValue ===
                      options.indirectFocalLengthModelOptions.radiusOfCurvatureMagnitudeRange.defaultValue );

    super( options );

    this.shapesProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( radiusOfCurvature: number, diameter: number ) => new MirrorShapes( radiusOfCurvature, diameter )
    );
  }

  /**
   * A mirror is converging if it is concave.
   * @param opticShape
   */
  protected isConverging( opticShape: OpticShape ): boolean {
    return ( opticShape === 'concave' );
  }

  /**
   * Returns the most extreme position within the mirror that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   * @param opticalObjectPosition
   * @param opticalImagePosition
   * @param isTop
   */
  protected getExtremumPoint( opticalObjectPosition: Vector2, opticalImagePosition: Vector2, isTop: boolean ): Vector2 {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const activeBounds = this.getActiveBoundsTranslated().erodedY( 1e-6 );

    // convenience variables
    const isConcave = ( this.opticShapeProperty.value === 'concave' );
    const leftPoint = isTop ? activeBounds.leftTop : activeBounds.leftBottom;
    const rightPoint = isTop ? activeBounds.rightTop : activeBounds.rightBottom;

    // since mirror reflects light, the extremum point is on the mirror itself
    return isConcave ? leftPoint : rightPoint;
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;