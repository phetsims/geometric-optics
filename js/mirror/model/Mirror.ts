// Copyright 2021-2022, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic, { OpticOptions } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import { OpticShape } from '../../common/model/OpticShape.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MirrorShapes from './MirrorShapes.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GOConstants from '../../common/GOConstants.js';

// Index of refraction is a fixed value for both the 'direct' and 'indirect' focal-length models.
// Although a mirror does not have an index of refraction, its focal length is equivalent to a lens
// with an index of refraction of 2.
const INDEX_OF_REFRACTION = 2;

type MirrorOptions = {
  isBasicsVersion: boolean,
  tandem: Tandem
};

class Mirror extends Optic {

  // See Optic
  readonly shapesProperty: IReadOnlyProperty<MirrorShapes>;

  constructor( providedOptions: MirrorOptions ) {

    const focalLengthModelsTandem = providedOptions.tandem.createTandem( 'focalLengthModels' );

    const options = merge( {
      opticShapes: providedOptions.isBasicsVersion ? [ 'flat' ] : [ 'concave', 'convex', 'flat' ],
      diameterRange: GOConstants.DIAMETER_RANGE, // in cm
      sign: -1,
      directFocalLengthModelOptions: {
        focalLengthMagnitudeRange: new RangeWithValue( 75, 125, 90 ), // in cm
        indexOfRefractionRange: new RangeWithValue( INDEX_OF_REFRACTION, INDEX_OF_REFRACTION, INDEX_OF_REFRACTION ), // fixed and unitless
        tandem: focalLengthModelsTandem.createTandem( 'directFocalLengthModel' )
      },
      indirectFocalLengthModelOptions: {
        radiusOfCurvatureMagnitudeRange: new RangeWithValue( 150, 300, 180 ), // in cm
        indexOfRefractionRange: new RangeWithValue( INDEX_OF_REFRACTION, INDEX_OF_REFRACTION, INDEX_OF_REFRACTION ), // fixed and unitless
        tandem: focalLengthModelsTandem.createTandem( 'indirectFocalLengthModel' )
      }
    }, providedOptions ) as OpticOptions; //TODO don't use 'as'

    assert && assert( 2 * options.directFocalLengthModelOptions.focalLengthMagnitudeRange.defaultValue ===
                      options.indirectFocalLengthModelOptions.radiusOfCurvatureMagnitudeRange.defaultValue );

    super( options );

    this.shapesProperty = new DerivedProperty(
      [ this.finiteRadiusOfCurvatureProperty, this.diameterProperty ],
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