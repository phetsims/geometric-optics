// Copyright 2021, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Representation from '../../common/model/Representation.js';
import geometricOptics from '../../geometricOptics.js';
import Mirror from './Mirror.js';
import { OpticConfig } from '../../common/model/Optic.js';

class MirrorModel extends GeometricOpticsModel {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TODO-TS any

    options = merge( {

      // Mirror does not support a light source
      // @ts-ignore TODO-TS property 'LIGHT' does not exist on type 'Enumeration'
      representations: Representation.VALUES.filter( value => ( value !== Representation.LIGHT ) ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const mirror = new Mirror( {
      tandem: options.tandem.createTandem( 'mirror' )
    } as OpticConfig );

    super( mirror, options );
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;