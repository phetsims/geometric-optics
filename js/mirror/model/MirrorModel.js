// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

const INITIAL_POSITION = GeometricOpticsConstants.MIRROR_INITIAL_POSITION;
const RADIUS_OF_CURVATURE_RANGE = GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE;
const DIAMETER_RANGE = GeometricOpticsConstants.MIRROR_DIAMETER_RANGE;
const INITIAL_CURVATURE_TYPE = GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE;

class MirrorModel extends GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( INITIAL_POSITION, RADIUS_OF_CURVATURE_RANGE, DIAMETER_RANGE,
      new RangeWithValue( 2, 2, 2 ), INITIAL_CURVATURE_TYPE, Optic.Type.MIRROR, tandem );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;
