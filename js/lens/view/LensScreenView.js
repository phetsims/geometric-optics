// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import GuideNode from './GuideNode.js';
import ProjectorScreenNode from './ProjectorScreenNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  /**
   * @param {LensModel} model
   */
  constructor( model ) {
    assert && assert( model instanceof LensModel );

    super( model );

    // {DerivedProperty.<boolean>} visibility of the first guides (associated with the object)
    const visibleFirstGuidesProperty = new DerivedProperty(
      [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondSourceVisibleProperty ],
      ( visibleGuides, visibleSecondSource ) => ( visibleGuides && !visibleSecondSource )
    );

    // {DerivedProperty.<boolean>} visiblity of the second guides (associated with the second source)
    const visibleSecondGuidesProperty = DerivedProperty.and(
      [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondSourceVisibleProperty ]
    );

    // create and add top and bottom guides associated with the object
    const firstTopGuideNode = new GuideNode( model.firstTopGuide, visibleFirstGuidesProperty, this.modelViewTransform );
    const firstBottomGuideNode = new GuideNode( model.firstBottomGuide, visibleFirstGuidesProperty, this.modelViewTransform );

    this.playAreaNode.addChild( firstBottomGuideNode );
    this.playAreaNode.addChild( firstTopGuideNode );

    // create and add top and bottom guides associated with the second source
    const secondTopGuideNode = new GuideNode( model.secondTopGuide, visibleSecondGuidesProperty, this.modelViewTransform );
    const secondBottomGuideNode = new GuideNode( model.secondBottomGuide, visibleSecondGuidesProperty, this.modelViewTransform );
    this.playAreaNode.addChild( secondBottomGuideNode );
    this.playAreaNode.addChild( secondTopGuideNode );

    // create projector screen associated with light source
    // @private {ProjectorScreenNode}
    this.projectorScreenNode = new ProjectorScreenNode(
      model.projectorScreen,
      model.representationProperty,
      model.firstTarget.enabledProperty,
      model.secondTarget.enabledProperty,
      this.visibleProperties.secondSourceVisibleProperty,
      this.playAreaModelBoundsProperty,
      this.modelViewTransform
    );

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