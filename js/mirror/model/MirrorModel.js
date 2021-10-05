// Copyright 2021, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
 * @author Martin Veillette
 */

import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Representation from '../../common/model/Representation.js';
import geometricOptics from '../../geometricOptics.js';
import Mirror from './Mirror.js';

class MirrorModel extends GeometricOpticsModel {
  constructor() {

    // Mirror does not support a light source
    super( new Mirror(), Representation.VALUES.filter( value => ( value !== Representation.LIGHT ) )
    );
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;