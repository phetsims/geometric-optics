// Copyright 2021, University of Colorado Boulder

/**
 * LensScreenView is the view for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
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
import Representation from '../../common/model/Representation.js';

class LensScreenView extends GeometricOpticsScreenView {

  private readonly projectionScreenNode: ProjectionScreenNode;

  /**
   * @param {LensModel} model
   * @param {Object} [options]
   */
  constructor( model: LensModel, options?: any ) { //TYPESCRIPT any

    options = merge( {

      // View origin is slightly above center of the layoutBounds.
      getViewOrigin: ( layoutBounds: Bounds2 ) =>
        new Vector2( layoutBounds.centerX, layoutBounds.centerY - 0.08 * layoutBounds.height ),

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
      visibleProperty: new DerivedProperty<boolean>(
        [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondPointVisibleProperty ],
        ( guidesVisible: boolean, secondPointVisible: boolean ) => ( guidesVisible && !secondPointVisible )
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
    this.projectionScreenNode = new ProjectionScreenNode(
      model.projectionScreen,
      model.optic.positionProperty,
      this.modelBoundsProperty,
      this.modelViewTransform, {
        tandem: options.tandem.createTandem( 'projectionScreenNode' )
      }
    );

    // LightSpot associated with the first source
    const firstLightSpotNode = new LightSpotNode( model.firstLightSpot, this.modelViewTransform, {
      visibleProperty: model.firstTarget.visibleProperty,
      tandem: options.tandem.createTandem( 'firstLightSpotNode' ),
      phetioDocumentation: 'the light spot on the projection screen that is created by the first light source'
    } );

    // LightSpot associated with the second source
    const secondLightSpotNode = new LightSpotNode( model.secondLightSpot, this.modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ model.secondTarget.visibleProperty, this.visibleProperties.secondPointVisibleProperty ] ),
      tandem: options.tandem.createTandem( 'secondLightSpotNode' ),
      phetioDocumentation: 'the light spot on the projection screen that is created by the second light source'
    } );

    // Add projection screen and light spots at the bottom of the z-layer.
    const lightSourceNodes = new Node( {
      children: [ this.projectionScreenNode, firstLightSpotNode, secondLightSpotNode ],
      visibleProperty: new DerivedProperty<boolean>( [ model.representationProperty ],
        ( representation: Representation ) => !representation.isObject )
    } );
    this.experimentAreaNode.insertChild( 0, lightSourceNodes );

    // pdom -traversal order
    //TODO https://github.com/phetsims/scenery/issues/1308 an obfuscated way of inserting 1 Node into pdomOrder
    // pdomOrder is an ES5 setter, and its values must be a new array, or it will be ignored.
    // @ts-ignore TYPESCRIPT 'getPDOMOrder' does not exist on type 'Node'
    const pdomOrder = this.screenViewRootNode.getPDOMOrder();
    pdomOrder.splice( pdomOrder.indexOf( this.zoomButtonGroup ), 0, this.projectionScreenNode );
    // @ts-ignore TYPESCRIPT 'pdomOrder' does not exist on type 'Node'
    this.screenViewRootNode.pdomOrder = [ ...pdomOrder ];
  }

  /**
   * @override
   */
  public reset() {
    super.reset();
    this.projectionScreenNode.reset();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;