// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import CommonScreenView from '../../common/view/CommonScreenView.js';
import ControlPanel from '../../common/view/ControlPanel.js';
import LensNode from './LensNode.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';


class LensScreenView extends CommonScreenView {

  /**
   * @param {LensModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof LensModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, tandem );

    const controlPanel = new ControlPanel( model.optic, model.lightRays, this.visibleProperties, this.modelViewTransform, tandem );
    this.addChild( controlPanel );
    controlPanel.centerBottom = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).centerBottom;

    const lensNode = new LensNode( model.optic, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 0, lensNode );

  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    super.reset();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;
