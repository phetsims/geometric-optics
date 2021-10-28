// Copyright 2021, University of Colorado Boulder

/**
 * LensScreenView is the view for the 'Lens' screen.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import GuideNode from './GuideNode.js';
import LightSpotNode from './LightSpotNode.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  /**
   * @param {LensModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof LensModel );

    options = merge( {

      // View origin is slightly above center of the layoutBounds.
      getViewOrigin: layoutBounds => new Vector2( layoutBounds.centerX, layoutBounds.centerY - 0.08 * layoutBounds.height ),

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
    this.experimentAreaNode.addChild( firstGuidesNode );

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
    this.experimentAreaNode.addChild( secondGuidesNode );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      model.projectionScreen,
      model.optic.positionProperty,
      this.modelBoundsProperty,
      this.modelViewTransform, {
        tandem: options.tandem.createTandem( 'projectionScreenNode' )
      }
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
    this.experimentAreaNode.insertChild( 0, lightSourceNodes );

    // pdom -traversal order
    //TODO https://github.com/phetsims/scenery/issues/1308 an obfuscated way of inserting 1 Node into pdomOrder
    // pdomOrder is an ES5 setter, and its values must be a new array, or it will be ignored.
    const pdomOrder = this.screenViewRootNode.getPDOMOrder();
    pdomOrder.splice( pdomOrder.indexOf( this.zoomButtonGroup ), 0, projectionScreenNode );
    this.screenViewRootNode.pdomOrder = [ ...pdomOrder ];
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;