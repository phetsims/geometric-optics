// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import GuideNode from './GuideNode.js';
import LensNode from './LensNode.js';
import ProjectorScreenNode from './ProjectorScreenNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  /**
   * @param {LensModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof LensModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, tandem );

    // TODO: find a more robust way to insert nodes after the light rays
    const lensNode = new LensNode( model.optic, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 6, lensNode );
    const topGuideNode = new GuideNode( model.topGuide, this.modelViewTransform );
    this.playAreaNode.insertChild( 7, topGuideNode );
    const bottomGuideNode = new GuideNode( model.bottomGuide, this.modelViewTransform );
    this.playAreaNode.insertChild( 8, bottomGuideNode );

    // create screen associated with light source
    // @private {ProjectorScreenNode}
    this.screenNode = new ProjectorScreenNode( model.screen,
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
