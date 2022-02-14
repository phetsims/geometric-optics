// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectSceneNode is the view of ArrowObjectScene, the scene that has arrow objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from './VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { RaysType } from '../model/RaysType.js';
import GOColors from '../GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VirtualLightRaysNode from './VirtualLightRaysNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { RulerHotkeysData } from './GORulerNode.js';
import ArrowObjectScene from '../model/ArrowObjectScene.js';
import ArrowObjectNode from './ArrowObjectNode.js';
import ArrowImageNode from './ArrowImageNode.js';
import GOSceneNode from './GOSceneNode.js';

type ArrowObjectSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class ArrowObjectSceneNode extends GOSceneNode {

  public readonly rulerHotkeysData: RulerHotkeysData;
  private readonly resetFrameObjectSceneNode: () => void;

  /**
   * @param scene
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty
   * @param modelBoundsProperty
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( scene: ArrowObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: ArrowObjectSceneNodeOptions ) {

    const options = merge( {
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    super( scene, visibleProperties, modelViewTransform, modelVisibleBoundsProperty, modelBoundsProperty, raysTypeProperty, options );

    const arrowWasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'arrowWasDraggedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Was either arrow dragged? Dragging either arrow hides the cueing arrows for both arrows.'
    } );

    // First arrow object
    const arrowObject1Node = new ArrowObjectNode( scene.arrowObject1, scene.optic, modelBoundsProperty,
      modelViewTransform, options.dragLockedProperty, arrowWasDraggedProperty, {
        tandem: options.tandem.createTandem( 'arrowObject1Node' )
      } );
    this.opticalObjectsLayer.addChild( arrowObject1Node );

    // Second arrow object
    const arrowObject2Node = new ArrowObjectNode( scene.arrowObject2, scene.optic, modelBoundsProperty,
      modelViewTransform, options.dragLockedProperty, arrowWasDraggedProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: options.tandem.createTandem( 'arrowObject2Node' )
      } );
    this.opticalObjectsLayer.addChild( arrowObject2Node );

    // Image associated with the first arrow
    const arrowImage1Node = new ArrowImageNode( scene.arrowImage1,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.raysAndImagesVisibleProperty,
      arrowObject1Node.visibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'arrowImage1Node' )
      } );
    this.opticalImagesLayer.addChild( arrowImage1Node );

    // Image associated with the second arrow
    const arrowImage2Node = new ArrowImageNode( scene.arrowImage2,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.raysAndImagesVisibleProperty,
      arrowObject2Node.visibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'arrowImage2Node' )
      } );
    this.opticalImagesLayer.addChild( arrowImage2Node );

    // Light rays (real & virtual) associated with the first point-of-interest (the framed object's position).
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: visibleProperties.raysAndImagesVisibleProperty
    } );
    this.raysForegroundLayer.addChild( realLightRays1Node );
    const virtualLightRays1Node = new VirtualLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( virtualLightRays1Node );

    // Light rays (real & virtual) associated with the second point-of-interest (also on the framed object).
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.secondPointVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( realLightRays2Node );
    const virtualLightRays2Node = new VirtualLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.secondPointVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( virtualLightRays2Node );

    // Add things that are interactive in this scene to the focus traversal order.
    this.pdomOrder = [
      arrowObject1Node,
      arrowObject2Node
    ];

    this.rulerHotkeysData = {
      opticPositionProperty: scene.optic.positionProperty,
      opticalObject1PositionProperty: scene.arrowObject1.positionProperty,
      opticalObject2PositionProperty: scene.arrowObject2.positionProperty,
      opticalObject2VisibleProperty: arrowObject2Node.visibleProperty,
      opticalImage1PositionProperty: scene.arrowImage1.positionProperty,
      opticalImage1VisibleProperty: arrowImage1Node.visibleProperty
    };

    //TODO is this complete?
    this.resetFrameObjectSceneNode = () => {
      arrowWasDraggedProperty.reset();
    };
  }

  public reset(): void {
    this.resetFrameObjectSceneNode();
  }
}

geometricOptics.register( 'ArrowObjectSceneNode', ArrowObjectSceneNode );
export default ArrowObjectSceneNode;