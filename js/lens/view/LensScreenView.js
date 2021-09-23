// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import GuideNode from './GuideNode.js';
import ProjectorScreenNode from './ProjectorScreenNode.js';
import SpotlightNode from './SpotlightNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  /**
   * @param {LensModel} model
   */
  constructor( model ) {
    assert && assert( model instanceof LensModel );

    super( model );

    // Guides associated with the object
    const firstGuidesNode = new Node( {
      children: [
        new GuideNode( model.firstTopGuide, this.modelViewTransform ),
        new GuideNode( model.firstBottomGuide, this.modelViewTransform )
      ],
      visibleProperty: new DerivedProperty(
        [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondSourceVisibleProperty ],
        ( visibleGuides, secondSourceVisible ) => ( visibleGuides && !secondSourceVisible )
      )
    } );
    this.playAreaNode.addChild( firstGuidesNode );

    // Guides associated with the second source
    const secondGuidesNode = new Node( {
      children: [
        new GuideNode( model.secondTopGuide, this.modelViewTransform ),
        new GuideNode( model.secondBottomGuide, this.modelViewTransform )
      ],
      visibleProperty: DerivedProperty.and(
        [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondSourceVisibleProperty ]
      )
    } );
    this.playAreaNode.addChild( secondGuidesNode );

    // Projector
    const projectorScreenNode = new ProjectorScreenNode(
      model.projectorScreen,
      model.optic.positionProperty,
      this.modelBoundsProperty,
      this.modelViewTransform
    );

    // Spotlight associated with the first source
    const firstSpotlightNode = new SpotlightNode(
      model.firstSpotlight.intensityProperty,
      model.firstSpotlight.screenIntersectionProperty,
      this.modelViewTransform, {
        visibleProperty: model.firstTarget.visibleProperty
      } );

    // Spotlight associated with the second source
    const secondSpotlightNode = new SpotlightNode(
      model.secondSpotlight.intensityProperty,
      model.secondSpotlight.screenIntersectionProperty,
      this.modelViewTransform, {
        visibleProperty: DerivedProperty.and(
          [ model.secondTarget.visibleProperty, this.visibleProperties.secondSourceVisibleProperty ] )
      } );

    // Add projector screen and spotlights at the bottom of the z-layer.
    const lightSourceNodes = new Node( {
      children: [ projectorScreenNode, firstSpotlightNode, secondSpotlightNode ],
      visibleProperty: new DerivedProperty( [ model.representationProperty ], representation => !representation.isObject )
    } );
    this.playAreaNode.insertChild( 0, lightSourceNodes );

    // @private
    this.resetLensScreenView = () => {
      projectorScreenNode.reset();
    };
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    super.reset();
    this.resetLensScreenView();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;