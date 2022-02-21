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

// Although a mirror does not have an index of refraction, its focal length is equivalent to a lens
// with an index of refraction of 2.
const INDEX_OF_REFRACTION = 2;

type MirrorOptions = {
  tandem: Tandem
};

class Mirror extends Optic {

  // See Optic
  readonly shapesProperty: IReadOnlyProperty<MirrorShapes>;

  constructor( providedOptions: MirrorOptions ) {

    const options = merge( {
      opticShape: 'concave',
      opticShapes: [ 'concave', 'convex' ], //TODO https://github.com/phetsims/geometric-optics/issues/227 add 'flat'
      diameterRange: GOConstants.DIAMETER_RANGE, // in cm
      sign: -1,
      directFocalLengthModelOptions: {
        focalLengthRange: new RangeWithValue( 75, 125, 100 ), // in cm
        indexOfRefraction: INDEX_OF_REFRACTION, // fixed and unitless
        tandem: providedOptions.tandem.createTandem( 'directFocalLengthModel' )
      },
      indirectFocalLengthModelOptions: {
        radiusOfCurvatureRange: new RangeWithValue( 150, 300, 200 ), // in cm
        indexOfRefractionRange: new RangeWithValue( INDEX_OF_REFRACTION, INDEX_OF_REFRACTION, INDEX_OF_REFRACTION ), // unitless
        tandem: providedOptions.tandem.createTandem( 'indirectFocalLengthModel' )
      }
    }, providedOptions ) as OpticOptions; //TODO don't use 'as'

    super( options );

    this.shapesProperty = new DerivedProperty(
      [ this.opticShapeProperty, this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( opticShape: OpticShape, radiusOfCurvature: number, diameter: number ) =>
        new MirrorShapes( opticShape, radiusOfCurvature, diameter )
    );
  }

  /**
   * A mirror is converging if it is concave.
   * @param opticShape
   */
  protected isConverging( opticShape: OpticShape ): boolean {
    return ( opticShape === 'concave' );
  }

  //TODO a few lines here are copied from Lens getExtremumPoint
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