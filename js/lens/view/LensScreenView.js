// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import LensNode from './LensNode.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import ScreenNode from './ScreenNode.js';
import GuideNode from './GuideNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  /**
   * @param {LensModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof LensModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, tandem );

    const lensNode = new LensNode( model.optic, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 0, lensNode );
    const topGuideNode = new GuideNode( model.topGuide, this.modelViewTransform );
    this.playAreaNode.insertChild( 1, topGuideNode );

    // create screen associated with light source
    // @private {ScreenNode}
    this.screenNode = new ScreenNode( model.screen,
      model.representationProperty,
      this.visibleProperties.visibleMovablePointProperty,
      this.modelViewTransform, tandem );

    //  add the screen at the bottom of the z-layer
    this.insertChild( 0, this.screenNode );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    super.reset();
    this.screenNode.reset();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;
