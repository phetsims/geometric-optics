// Copyright 2021, University of Colorado Boulder

/**
 * LensScreenView is the view for the 'Lens' screen.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import GuideNode from './GuideNode.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import LightSpotNode from './LightSpotNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  /**
   * @param {LensModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof LensModel );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( model, options );

    // Guides associated with the object
    const firstGuidesNode = new Node( {
      children: [
        new GuideNode( model.firstTopGuide, this.modelViewTransform ),
        new GuideNode( model.firstBottomGuide, this.modelViewTransform )
      ],
      visibleProperty: new DerivedProperty(
        [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondPointVisibleProperty ],
        ( visibleGuides, secondPointVisible ) => ( visibleGuides && !secondPointVisible )
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
        [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondPointVisibleProperty ]
      )
    } );
    this.playAreaNode.addChild( secondGuidesNode );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      model.projectionScreen,
      model.optic.positionProperty,
      this.modelBoundsProperty,
      this.modelViewTransform
    );

    // LightSpot associated with the first source
    const firstLightSpotNode = new LightSpotNode(
      model.firstLightSpot.intensityProperty,
      model.firstLightSpot.screenIntersectionProperty,
      this.modelViewTransform, {
        visibleProperty: model.firstTarget.visibleProperty
      } );

    // LightSpot associated with the second source
    const secondLightSpotNode = new LightSpotNode(
      model.secondLightSpot.intensityProperty,
      model.secondLightSpot.screenIntersectionProperty,
      this.modelViewTransform, {
        visibleProperty: DerivedProperty.and(
          [ model.secondTarget.visibleProperty, this.visibleProperties.secondPointVisibleProperty ] )
      } );

    // Add projection screen and light spots at the bottom of the z-layer.
    const lightSourceNodes = new Node( {
      children: [ projectionScreenNode, firstLightSpotNode, secondLightSpotNode ],
      visibleProperty: new DerivedProperty( [ model.representationProperty ], representation => !representation.isObject )
    } );
    this.playAreaNode.insertChild( 0, lightSourceNodes );

    // @private
    this.resetLensScreenView = () => {
      projectionScreenNode.reset();
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