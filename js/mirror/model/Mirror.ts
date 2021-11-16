// Copyright 2021, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapeEnum from '../../common/model/OpticShapeEnum.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MirrorShapes from './MirrorShapes.js';

class Mirror extends Optic {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TYPESCRIPT any
    super( merge( {
      opticType: 'mirror',
      opticShape: 'concave',
      opticShapes: [ 'concave', 'convex' ], //TODO https://github.com/phetsims/geometric-optics/issues/227 add 'flat'
      radiusOfCurvatureRange: new RangeWithValue( 150, 300, 200 ), // in cm

      // Although a mirror does not have an index of refraction, its focal length is equivalent to a lens
      // with an index of refraction of 2.
      indexOfRefractionRange: new RangeWithValue( 2, 2, 2 ), // unitless
      diameterRange: new RangeWithValue( 30, 130, 80 ), // in cm
      sign: -1,
      isConverging: ( opticShape: OpticShapeEnum ) => ( opticShape === 'concave' ),
      createOpticShapes: ( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number ) =>
        new MirrorShapes( opticShape, radiusOfCurvature, diameter ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options ) );
  }

  //TODO a few lines here are copied from Lens getExtremumPoint
  /**
   * Returns the most extreme position within the mirror that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   */
  protected getExtremumPoint( sourcePoint: Vector2, targetPoint: Vector2, isTop: boolean ): Vector2 {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const isConcave = ( this.opticShapeProperty.value === 'concave' );
    const leftPoint = isTop ? opticBounds.leftTop : opticBounds.leftBottom;
    const rightPoint = isTop ? opticBounds.rightTop : opticBounds.rightBottom;

    // since mirror reflects light, the extremum point is on the mirror itself
    return isConcave ? leftPoint : rightPoint;
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;