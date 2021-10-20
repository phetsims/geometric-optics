// Copyright 2021, University of Colorado Boulder

/**
 * MirrorScreenView is the view for the 'Mirror' screen.
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';

class MirrorScreenView extends GeometricOpticsScreenView {

  /**
   * @param {MirrorModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof MirrorModel );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( model, options );
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;