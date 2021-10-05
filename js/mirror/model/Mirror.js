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

    // Index of refraction of mirror. Although a mirror does not have an index of refraction, its focal length is
    // equivalent to a lens with an index of refraction of 2.
    const indexOfRefractionRange = new RangeWithValue( 2, 2, 2 );

    super(
      Optic.Type.MIRROR,
      GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE,
      GeometricOpticsConstants.MIRROR_INITIAL_POSITION,
      GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE,
      GeometricOpticsConstants.MIRROR_DIAMETER_RANGE,
      indexOfRefractionRange
    );
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;