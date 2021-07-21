// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
    const lensNode = new LensNode( model.optic, model.lightRayModeProperty, this.playAreaModelBoundsProperty, this.modelViewTransform, tandem );
    this.playAreaNode.insertChild( 3, lensNode );

    // {Property.<boolean>} create visible property for the first guides (associated with the object)
    const visibleFirstGuidesProperty = new DerivedProperty( [ this.visibleProperties.visibleGuidesProperty,
      this.visibleProperties.visibleSecondSourceProperty ], ( visibleGuides, visibleSecondSource ) => visibleGuides && !visibleSecondSource );

    // {Property.<boolean>} create visible property for the second guides (associated with the second source)
    const visibleSecondGuidesProperty = DerivedProperty.and( [
      this.visibleProperties.visibleGuidesProperty,
      this.visibleProperties.visibleSecondSourceProperty ] );

    // create and add top and bottom guides associated with the object
    const firstTopGuideNode = new GuideNode( model.firstTopGuide, visibleFirstGuidesProperty, this.modelViewTransform );
    const firstBottomGuideNode = new GuideNode( model.firstBottomGuide, visibleFirstGuidesProperty, this.modelViewTransform );
    this.playAreaNode.insertChild( 7, firstBottomGuideNode );
    this.playAreaNode.insertChild( 8, firstTopGuideNode );

    // create and add top and bottom guides associated with the second source
    const secondTopGuideNode = new GuideNode( model.secondTopGuide, visibleSecondGuidesProperty, this.modelViewTransform );
    const secondBottomGuideNode = new GuideNode( model.secondBottomGuide, visibleSecondGuidesProperty, this.modelViewTransform );
    this.playAreaNode.insertChild( 9, secondBottomGuideNode );
    this.playAreaNode.insertChild( 10, secondTopGuideNode );

    // create projector screen associated with light source
    // @private {ProjectorScreenNode}
    this.projectorScreenNode = new ProjectorScreenNode( model.projectorScreen,
      model.representationProperty,
      model.enableImageProperty,
      model.enableMovableImageProperty,
      this.visibleProperties.visibleSecondSourceProperty,
      this.playAreaModelBoundsProperty,
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
