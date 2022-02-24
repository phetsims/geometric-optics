// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectSceneNode is the view of ArrowObjectScene, the scene that has arrow objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from './VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { RaysType } from '../model/RaysType.js';
import GOColors from '../GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VirtualLightRaysNode from './VirtualLightRaysNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { RulerHotkeyTarget } from './GORulerNode.js';
import ArrowObjectScene from '../model/ArrowObjectScene.js';
import ArrowObjectNode from './ArrowObjectNode.js';
import ArrowImageNode from './ArrowImageNode.js';
import GOSceneNode, { GOSceneNodeOptions } from './GOSceneNode.js';
import IProperty from '../../../../axon/js/IProperty.js';

class ArrowObjectSceneNode extends GOSceneNode {

  // See GOSceneNode
  public readonly horizontalRulerHotkeyTargets: RulerHotkeyTarget[];
  public readonly verticalRulerHotkeyTargets: RulerHotkeyTarget[];

  // Resets things that are specific to this class.
  private readonly resetFrameObjectSceneNode: () => void;

  /**
   * @param scene
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param raysTypeProperty
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: ArrowObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: GOSceneNodeOptions ) {

    super( scene, visibleProperties, modelViewTransform, modelVisibleBoundsProperty, sceneBoundsProperty, raysTypeProperty, providedOptions );

    const arrowWasDraggedProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'arrowWasDraggedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Was either arrow dragged? Dragging either arrow hides the cueing arrows for both arrows.'
    } );

    // First arrow object
    const arrowObject1Node = new ArrowObjectNode( scene.arrowObject1, scene.optic, sceneBoundsProperty,
      modelViewTransform, providedOptions.dragLockedProperty, arrowWasDraggedProperty, {
        tandem: providedOptions.tandem.createTandem( 'arrowObject1Node' )
      } );
    this.opticalObjectsLayer.addChild( arrowObject1Node );

    // Second arrow object
    const arrowObject2Node = new ArrowObjectNode( scene.arrowObject2, scene.optic, sceneBoundsProperty,
      modelViewTransform, providedOptions.dragLockedProperty, arrowWasDraggedProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'arrowObject2Node' )
      } );
    this.opticalObjectsLayer.addChild( arrowObject2Node );

    // Image associated with the first arrow
    const arrowImage1Node = new ArrowImageNode( scene.arrowImage1,
      visibleProperties.virtualImageVisibleProperty, lightPropagationEnabledProperty,
      arrowObject1Node.visibleProperty, modelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'arrowImage1Node' )
      } );
    this.opticalImagesLayer.addChild( arrowImage1Node );

    // Image associated with the second arrow
    const arrowImage2Node = new ArrowImageNode( scene.arrowImage2,
      visibleProperties.virtualImageVisibleProperty, lightPropagationEnabledProperty,
      arrowObject2Node.visibleProperty, modelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'arrowImage2Node' )
      } );
    this.opticalImagesLayer.addChild( arrowImage2Node );

    // Light rays (real & virtual) associated with the first point-of-interest (the framed object's position).
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: lightPropagationEnabledProperty
    } );
    this.raysForegroundLayer.addChild( realLightRays1Node );
    const virtualLightRays1Node = new VirtualLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        lightPropagationEnabledProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( virtualLightRays1Node );

    // Light rays (real & virtual) associated with the second point-of-interest (also on the framed object).
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.secondPointVisibleProperty,
        lightPropagationEnabledProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( realLightRays2Node );
    const virtualLightRays2Node = new VirtualLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.secondPointVisibleProperty,
        lightPropagationEnabledProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( virtualLightRays2Node );

    // Add things that are interactive in this scene to the focus traversal order.
    this.pdomOrder = [
      arrowObject1Node,
      arrowObject2Node
    ];

    // Ruler J+R hotkey will cycle through these positions, from left-to-right x coordinate.
    this.verticalRulerHotkeyTargets = [
      { positionProperty: scene.optic.positionProperty, visibleProperty: this.opticNode.visibleProperty },
      { positionProperty: scene.arrowObject1.positionProperty, visibleProperty: arrowObject1Node.visibleProperty },
      { positionProperty: scene.arrowObject2.positionProperty, visibleProperty: arrowObject2Node.visibleProperty },
      { positionProperty: scene.arrowImage1.positionProperty, visibleProperty: arrowImage1Node.visibleProperty },
      { positionProperty: scene.arrowImage2.positionProperty, visibleProperty: arrowImage2Node.visibleProperty }
    ];
    this.horizontalRulerHotkeyTargets = [
      ...this.verticalRulerHotkeyTargets,
      { positionProperty: scene.optic.leftFocalPointProperty, visibleProperty: visibleProperties.focalPointsVisibleProperty },
      { positionProperty: scene.optic.left2FProperty, visibleProperty: visibleProperties.twoFPointsVisibleProperty }
    ];

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