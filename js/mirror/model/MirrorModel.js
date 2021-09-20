// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Optic from '../../common/model/Optic.js';
import Representation from '../../common/model/Representation.js';
import geometricOptics from '../../geometricOptics.js';

class MirrorModel extends GeometricOpticsModel {

  constructor() {

    // index of refraction of mirror
    // P.S. although a mirror does not have an index of refraction
    // its focal length is equivalent to a lens with an index of refraction of 2
    const indexOfRefractionRange = new RangeWithValue( 2, 2, 2 );

    super(
      Optic.Type.MIRROR,
      GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE,
      GeometricOpticsConstants.MIRROR_INITIAL_POSITION,
      GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE,
      GeometricOpticsConstants.MIRROR_DIAMETER_RANGE,
      indexOfRefractionRange,

      // Mirror screen does not support a light source
      _.filter( Representation.VALUES, value => ( value !== Representation.LIGHT ) )
    );
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;