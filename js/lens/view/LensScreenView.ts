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
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import GuideNode from './GuideNode.js';
import LightSpotNode from './LightSpotNode.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import Representation from '../../common/model/Representation.js';
import DebugPointNode from '../../common/view/DebugPointNode.js';
import GeometricOpticsQueryParameters from '../../common/GeometricOpticsQueryParameters.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Lens from '../model/Lens.js';
import LensNode from './LensNode.js';

class LensScreenView extends GeometricOpticsScreenView {

  private readonly projectionScreenNode: ProjectionScreenNode;

  /**
   * @param model
   * @param options
   */
  constructor( model: LensModel, options?: any ) {

    options = merge( {

      // View origin is slightly above center of the layoutBounds.
      getViewOrigin: ( layoutBounds: Bounds2 ) =>
        new Vector2( layoutBounds.centerX, layoutBounds.centerY - 0.08 * layoutBounds.height ),

      // Creates the Node for the lens
      createOpticNode: ( optic: Lens, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) =>
        new LensNode( optic, modelBoundsProperty, modelViewTransform, {
          tandem: parentTandem.createTandem( 'lensNode' )
        } ),

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
    const lightSpot1Node = new LightSpotNode( model.lightSpot1, this.modelViewTransform, {
      visibleProperty: model.firstTarget.visibleProperty
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    // LightSpot associated with the second source
    const lightSpot2Node = new LightSpotNode( model.lightSpot2, this.modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ model.secondTarget.visibleProperty, this.visibleProperties.secondPointVisibleProperty ] )
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    // Add projection screen and light spots at the bottom of the z-layer.
    const lightSourceNodes = new Node( {
      children: [ this.projectionScreenNode, lightSpot1Node, lightSpot2Node ],
      visibleProperty: new DerivedProperty<boolean>( [ model.representationProperty ],
        ( representation: Representation ) => !representation.isObject )
    } );
    this.experimentAreaNode.insertChild( 0, lightSourceNodes );

    if ( GeometricOpticsQueryParameters.showPositions ) {
      this.experimentAreaNode.addChild( new DebugPointNode( model.projectionScreen.positionProperty, this.modelViewTransform, options ) );
    }

    // pdom -traversal order
    //TODO https://github.com/phetsims/scenery/issues/1308 an obfuscated way of inserting 1 Node into pdomOrder
    // pdomOrder is an ES5 setter, and its values must be a new array, or it will be ignored.
    // @ts-ignore TYPESCRIPT 'getPDOMOrder' does not exist on type 'Node'
    const pdomOrder = this.screenViewRootNode.getPDOMOrder();
    if ( pdomOrder ) {
      pdomOrder.splice( pdomOrder.indexOf( this.zoomButtonGroup ), 0, this.projectionScreenNode );
    }
    // @ts-ignore TYPESCRIPT 'pdomOrder' does not exist on type 'Node'
    this.screenViewRootNode.pdomOrder = [ ...pdomOrder ];
  }

  public reset(): void {
    super.reset();
    this.projectionScreenNode.reset();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;