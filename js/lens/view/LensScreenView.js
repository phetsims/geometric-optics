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

    // TODO: find a more robust way to insert nodes in relation to other nodes in the play area
    const lensNode = new LensNode( model.optic, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 3, lensNode );
    const topGuideNode = new GuideNode( model.topGuide, this.visibleProperties.visibleGuidesProperty, this.modelViewTransform );
    this.playAreaNode.insertChild( 7, topGuideNode );
    const bottomGuideNode = new GuideNode( model.bottomGuide, this.visibleProperties.visibleGuidesProperty, this.modelViewTransform );
    this.playAreaNode.insertChild( 8, bottomGuideNode );

    // create projector screen associated with light source
    // @private {ProjectorScreenNode}
    this.projectorScreenNode = new ProjectorScreenNode( model.projectorScreen,
      model.representationProperty,
      model.enableImageProperty,
      model.enableMovableImageProperty,
      this.visibleProperties.visibleMovablePointProperty,
      this.visibleModelBoundsProperty,
      this.modelViewTransform, tandem );

    //  add the screen at the bottom of the z-layer
    this.playAreaNode.insertChild( 0, this.projectorScreenNode );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    super.reset();
    this.projectorScreenNode.reset();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;
