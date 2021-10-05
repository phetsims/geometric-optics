// Copyright 2021, University of Colorado Boulder

/**
 * MirrorScreenView is the view for the 'Mirror' screen.
 *
 * @author Martin Veillette
 */

import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';

class MirrorScreenView extends GeometricOpticsScreenView {

  /**
   * @param {MirrorModel} model
   */
  constructor( model ) {
    assert && assert( model instanceof MirrorModel );
    super( model );
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;