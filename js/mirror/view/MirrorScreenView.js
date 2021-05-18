// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import MirrorNode from './MirrorNode.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';

class MirrorScreenView extends GeometricOpticsScreenView {

  /**
   * @param {MirrorModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof MirrorModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, tandem );

    const mirrorNode = new MirrorNode( model.optic, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 0, mirrorNode );

  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    super.reset();
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;
