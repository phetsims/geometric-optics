// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import ControlPanel from '../../common/view/ControlPanel.js';
import MirrorNode from './MirrorNode.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';
import CommonScreenView from '../../common/view/CommonScreenView.js';

class MirrorScreenView extends CommonScreenView {

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

    const controlPanel = new ControlPanel( model.optic, model.lightRays, this.visibleProperties, this.modelViewTransform, tandem );
    controlPanel.centerBottom = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).centerBottom;
    this.addChild( controlPanel );

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
