// Copyright 2021, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import { RepresentationStaticInstances } from '../../common/model/Representation.js';
import geometricOptics from '../../geometricOptics.js';
import Mirror from './Mirror.js';
import { OpticConfig } from '../../common/model/Optic.js';

class MirrorModel extends GeometricOpticsModel {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TS any

    options = merge( {

      // Mirror only supports objects, no light source
      representations: RepresentationStaticInstances.filter( value => value.isObject ),

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