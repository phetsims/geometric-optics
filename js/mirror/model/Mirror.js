// Copyright 2021, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

class Mirror extends Optic {
  constructor() {
    super( {
      opticType: Optic.Type.MIRROR,
      curve: GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE,
      initialPosition: GeometricOpticsConstants.MIRROR_INITIAL_POSITION,
      radiusOfCurvatureRange: GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE,

      // Index of refraction of mirror. Although a mirror does not have an index of refraction, its focal length is
      // equivalent to a lens with an index of refraction of 2.
      indexOfRefractionRange: new RangeWithValue( 2, 2, 2 ),
      diameterRange: GeometricOpticsConstants.MIRROR_DIAMETER_RANGE
    } );
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;