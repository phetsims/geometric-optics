// Copyright 2022, University of Colorado Boulder

/**
 * FramedObjectSceneNode is the view of FramedObjectScene, the scene that has a framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import FramedObjectScene from '../model/FramedObjectScene.js';
import FramedImageNode from './FramedImageNode.js';
import VisibleProperties from './VisibleProperties.js';
import FramedObjectNode from './FramedObjectNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import SecondPointNode from './SecondPointNode.js';
import { RaysType } from '../model/RaysType.js';
import GOColors from '../GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import RealLightRaysForegroundNode from './RealLightRaysForegroundNode.js';
import OpticalAxisForegroundNode from './OpticalAxisForegroundNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VirtualLightRaysNode from './VirtualLightRaysNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { RulerHotkeyTarget } from './GORulerNode.js';
import GOSceneNode from './GOSceneNode.js';
import IProperty from '../../../../axon/js/IProperty.js';

type FramedObjectSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class FramedObjectSceneNode extends GOSceneNode {

  // See GOSceneNode
  public readonly horizontalRulerHotkeyTargets: RulerHotkeyTarget[];
  public readonly verticalRulerHotkeyTargets: RulerHotkeyTarget[];

  // Resets things that are specific to this class.
  private readonly resetFrameObjectSceneNode: () => void;

  /**
   * @param scene
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty
   * @param modelBoundsProperty
   * @param raysTypeProperty
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: FramedObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: FramedObjectSceneNodeOptions ) {

    const options = merge( {
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    super( scene, visibleProperties, modelViewTransform, modelVisibleBoundsProperty, modelBoundsProperty, raysTypeProperty, options );

    // Framed object
    const framedObjectNode = new FramedObjectNode( scene.framedObject,
      modelBoundsProperty, scene.optic.positionProperty, modelViewTransform, options.dragLockedProperty, {
        tandem: options.tandem.createTandem( 'framedObjectNode' )
      } );
    this.opticalObjectsLayer.addChild( framedObjectNode );

    // Second point-of-interest on the framed object
    const secondPointNode = new SecondPointNode( scene.secondPoint, modelViewTransform, {
      visibleProperty: visibleProperties.secondPointVisibleProperty,
      tandem: options.tandem.createTandem( 'secondPointNode' ),
      phetioDocumentation: 'second point-of-interest on the framed object'
    } );
    this.opticalObjectsLayer.addChild( secondPointNode );

    // Both points of interest are on the same Object, so we only render one Image. If we rendered 2 Images,
    // their opacities would combine.
    const framedImageNode = new FramedImageNode( scene.framedImage1, scene.optic,
      visibleProperties.virtualImageVisibleProperty, lightPropagationEnabledProperty,
      framedObjectNode.visibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'framedImageNode' )
      } );
    this.opticalImagesLayer.addChild( framedImageNode );

    // The parts of the optical axis that appear to be in front of framed objects and images.
    const opticalAxisForegroundNode = new OpticalAxisForegroundNode(
      scene.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform,
      scene.framedObject.positionProperty,
      framedObjectNode,
      scene.framedImage1.positionProperty,
      framedImageNode,
      scene.lightRays1.raysProcessedEmitter, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty
      } );
    this.opticalAxisForegroundLayer.addChild( opticalAxisForegroundNode );

    // Light rays (real & virtual) associated with the first point-of-interest (the framed object's position).
    const realLightRays1Options = {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: lightPropagationEnabledProperty
    };
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, realLightRays1Options );
    this.raysBackgroundLayer.addChild( realLightRays1Node );
    const realLightRays1ForegroundNode = new RealLightRaysForegroundNode( scene.lightRays1, modelViewTransform,
      modelVisibleBoundsProperty, scene.optic.positionProperty, scene.framedImage1.positionProperty,
      scene.framedImage1.opticalImageTypeProperty, realLightRays1Options );
    this.raysForegroundLayer.addChild( realLightRays1ForegroundNode );
    const virtualLightRays1Node = new VirtualLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: realLightRays1Options.stroke,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        lightPropagationEnabledProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( virtualLightRays1Node );

    // Light rays (real & virtual) associated with the second point-of-interest (also on the framed object).
    const realLightRays2Options = {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.secondPointVisibleProperty,
        lightPropagationEnabledProperty
      ] )
    };
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, realLightRays2Options );
    this.raysBackgroundLayer.addChild( realLightRays2Node );
    const realLightRays2ForegroundNode = new RealLightRaysForegroundNode( scene.lightRays2, modelViewTransform,
      modelVisibleBoundsProperty, scene.optic.positionProperty, scene.framedImage2.positionProperty,
      scene.framedImage2.opticalImageTypeProperty, realLightRays2Options );
    this.raysForegroundLayer.addChild( realLightRays2ForegroundNode );
    const virtualLightRays2Node = new VirtualLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: realLightRays2Options.stroke,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.secondPointVisibleProperty,
        lightPropagationEnabledProperty
      ] )
    } );
    this.raysForegroundLayer.addChild( virtualLightRays2Node );

    // Add things that are interactive in this scene to the focus traversal order.
    this.pdomOrder = [
      framedObjectNode,
      secondPointNode
    ];

    // Ruler J+R hotkey will cycle through these positions, from left-to-right x coordinate.
    this.verticalRulerHotkeyTargets = [
      { positionProperty: scene.optic.positionProperty, visibleProperty: this.opticNode.visibleProperty },
      { positionProperty: scene.framedObject.positionProperty, visibleProperty: framedObjectNode.visibleProperty },
      { positionProperty: scene.framedImage1.positionProperty, visibleProperty: framedImageNode.visibleProperty }
    ];
    this.horizontalRulerHotkeyTargets = [
      ...this.verticalRulerHotkeyTargets,
      { positionProperty: scene.optic.leftFocalPointProperty, visibleProperty: visibleProperties.focalPointsVisibleProperty },
      { positionProperty: scene.optic.left2FProperty, visibleProperty: visibleProperties.twoFPointsVisibleProperty }
    ];

    this.resetFrameObjectSceneNode = () => {
      framedObjectNode.reset();
      secondPointNode.reset();
    };
  }

  public reset(): void {
    this.resetFrameObjectSceneNode();
  }
}

geometricOptics.register( 'FramedObjectSceneNode', FramedObjectSceneNode );
export default FramedObjectSceneNode;