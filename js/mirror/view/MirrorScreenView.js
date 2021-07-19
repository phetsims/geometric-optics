// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';
import MirrorNode from './MirrorNode.js';

class MirrorScreenView extends GeometricOpticsScreenView {

  /**
   * @param {MirrorModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof MirrorModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, tandem );

    const mirrorNode = new MirrorNode( model.optic, model.lightRayModeProperty, this.visibleModelBoundsProperty, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 3, mirrorNode );

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
