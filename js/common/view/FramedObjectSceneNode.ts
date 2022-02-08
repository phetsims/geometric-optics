// Copyright 2022, University of Colorado Boulder

/**
 * FramedObjectSceneNode is the view of FramedObjectScene, the scene that uses a framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import FramedObjectScene from '../model/FramedObjectScene.js';
import TargetNode from './TargetNode.js';
import VisibleProperties from './VisibleProperties.js';
import FramedObjectNode from './FramedObjectNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import SecondPointNode from './SecondPointNode.js';
import OpticalAxisNode from './OpticalAxisNode.js';
import OpticVerticalAxisNode from './OpticVerticalAxisNode.js';
import { RaysType } from '../model/RaysType.js';
import FocalPointNode from './FocalPointNode.js';
import TwoFPointNode from './TwoFPointNode.js';
import GOColors from '../GOColors.js';
import LightRaysNode from './LightRaysNode.js';
import LightRaysForegroundNode from './LightRaysForegroundNode.js';
import OpticalAxisForegroundNode from './OpticalAxisForegroundNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type FramedObjectSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class FramedObjectSceneNode extends Node {

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
  constructor( scene: FramedObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: FramedObjectSceneNodeOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    super( options );

    const opticNode = options.createOpticNode( scene.optic, modelBoundsProperty, modelViewTransform, options.tandem );

    const opticalAxisNode = new OpticalAxisNode(
      scene.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty
      } );

    const opticVerticalAxisNode = new OpticVerticalAxisNode( scene.optic, raysTypeProperty, modelViewTransform, {
      tandem: options.tandem.createTandem( 'opticVerticalAxisNode' )
    } );

    // focal points (F)
    const focalPointsNode = new Node( {
      children: [
        new FocalPointNode( scene.optic.leftFocalPointProperty, modelViewTransform ),
        new FocalPointNode( scene.optic.rightFocalPointProperty, modelViewTransform )
      ],
      visibleProperty: visibleProperties.focalPointsVisibleProperty,
      tandem: options.tandem.createTandem( 'focalPointsNode' )
    } );

    // 2F points
    const twoFPointsNode = new Node( {
      children: [
        new TwoFPointNode( scene.optic.left2FProperty, modelViewTransform ),
        new TwoFPointNode( scene.optic.right2FProperty, modelViewTransform )
      ],
      visibleProperty: visibleProperties.twoFPointsVisibleProperty,
      tandem: options.tandem.createTandem( 'twoFPointsNode' )
    } );

    const framedObjectNode = new FramedObjectNode( scene.representationProperty, scene.framedObject,
      modelBoundsProperty, scene.optic.positionProperty, modelViewTransform, options.dragLockedProperty, {
        tandem: options.tandem.createTandem( 'framedObjectNode' )
      } );

    const secondPointNode = new SecondPointNode( scene.framedObject.secondPoint, modelViewTransform, {
      visibleProperty: visibleProperties.secondPointVisibleProperty,
      tandem: options.tandem.createTandem( 'secondPointNode' )
    } );

    // Both points of interest are on the same Object, so we only render one Image. If we rendered 2 Images,
    // their opacities would combine.
    const targetNode = new TargetNode( scene.representationProperty, scene.target1, scene.optic,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.raysAndImagesVisibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'targetNode' )
      } );

    // The parts of the optical axis that appear to be in front of framed objects and images.
    const opticalAxisForegroundNode = new OpticalAxisForegroundNode(
      scene.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform,
      scene.framedObject.positionProperty,
      framedObjectNode,
      scene.target1.positionProperty,
      targetNode,
      scene.lightRays1.raysProcessedEmitter, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty
      } );

    // Light rays associated with the first point of interest (the Object's position).
    const lightRays1Options = {
      realRaysStroke: GOColors.rays1StrokeProperty,
      virtualRaysStroke: GOColors.rays1StrokeProperty
    };
    const lightRays1Node = new LightRaysNode( scene.lightRays1, scene.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, lightRays1Options );
    const lightRays1ForegroundNode = new LightRaysForegroundNode( scene.lightRays1, scene.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, modelVisibleBoundsProperty,
      scene.optic.positionProperty, scene.target1.positionProperty, scene.target1.isVirtualProperty, lightRays1Options );

    // Light rays associated with the second point of interest.
    const lightRays2Options = {
      realRaysStroke: GOColors.rays2StrokeProperty,
      virtualRaysStroke: GOColors.rays2StrokeProperty,
      visibleProperty: visibleProperties.secondPointVisibleProperty
    };
    const lightRays2Node = new LightRaysNode( scene.lightRays2, scene.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, lightRays2Options );
    const lightRays2ForegroundNode = new LightRaysForegroundNode( scene.lightRays2, scene.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, modelVisibleBoundsProperty,
      scene.optic.positionProperty, scene.target2.positionProperty, scene.target2.isVirtualProperty, lightRays2Options );

    this.children = [
      opticalAxisNode,
      framedObjectNode,
      lightRays1Node,
      lightRays2Node,
      targetNode,
      opticalAxisForegroundNode,
      opticNode,
      opticVerticalAxisNode,
      focalPointsNode,
      twoFPointsNode,
      lightRays1ForegroundNode,
      lightRays2ForegroundNode,
      secondPointNode
    ];

    this.pdomOrder = [
      framedObjectNode,
      secondPointNode
    ];

    //TODO is this complete?
    this.resetFrameObjectSceneNode = () => {
      framedObjectNode.reset();
      secondPointNode.reset();
    };
  }

  reset() {
    this.resetFrameObjectSceneNode();
  }
}

geometricOptics.register( 'FramedObjectSceneNode', FramedObjectSceneNode );
export default FramedObjectSceneNode;