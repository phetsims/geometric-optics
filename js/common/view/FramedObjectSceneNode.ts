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
import FramedImageNode from './FramedImageNode.js';
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
import RealLightRaysNode from './RealLightRaysNode.js';
import RealLightRaysForegroundNode from './RealLightRaysForegroundNode.js';
import OpticalAxisForegroundNode from './OpticalAxisForegroundNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VirtualLightRaysNode from './VirtualLightRaysNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GuidesNode from '../../lens/view/GuidesNode.js';
import { RulerHotkeysData } from './GORulerNode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type FramedObjectSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class FramedObjectSceneNode extends Node {

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
  constructor( scene: FramedObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: FramedObjectSceneNodeOptions ) {

    const options = merge( {
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    super( options );

    const opticNode = options.createOpticNode( scene.optic, modelBoundsProperty, modelViewTransform, options.tandem );

    const opticalAxisNode = new OpticalAxisNode(
      scene.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty,
        tandem: options.tandem.createTandem( 'opticalAxisNode' )
      } );

    const opticVerticalAxisNode = new OpticVerticalAxisNode( scene.optic, raysTypeProperty, modelViewTransform );

    // focal points (F)
    const focalPointsNodeTandem = options.tandem.createTandem( 'focalPointsNode' );
    const focalPointsNode = new Node( {
      children: [
        new FocalPointNode( scene.optic.leftFocalPointProperty, modelViewTransform, {
          tandem: focalPointsNodeTandem.createTandem( 'leftFocalPointNode' )
        } ),
        new FocalPointNode( scene.optic.rightFocalPointProperty, modelViewTransform, {
          tandem: focalPointsNodeTandem.createTandem( 'rightFocalPointNode' )
        } )
      ],
      visibleProperty: visibleProperties.focalPointsVisibleProperty,
      tandem: focalPointsNodeTandem
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

    const framedObjectNode = new FramedObjectNode( scene.framedObject,
      modelBoundsProperty, scene.optic.positionProperty, modelViewTransform, options.dragLockedProperty, {
        tandem: options.tandem.createTandem( 'framedObjectNode' )
      } );

    const secondPointNode = new SecondPointNode( scene.secondPoint, modelViewTransform, {
      visibleProperty: visibleProperties.secondPointVisibleProperty,
      tandem: options.tandem.createTandem( 'secondPointNode' ),
      phetioDocumentation: 'second point-of-interest on the framed object'
    } );

    // Both points of interest are on the same Object, so we only render one Image. If we rendered 2 Images,
    // their opacities would combine.
    const framedImageNode = new FramedImageNode( scene.framedImage1, scene.optic,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.raysAndImagesVisibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'framedImageNode' )
      } );

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

    // Light rays (real & virtual) associated with the first point-of-interest (the framed object's position).
    const realLightRays1Options = {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: visibleProperties.raysAndImagesVisibleProperty
    };
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, realLightRays1Options );
    const realLightRays1ForegroundNode = new RealLightRaysForegroundNode( scene.lightRays1, modelViewTransform,
      modelVisibleBoundsProperty, scene.optic.positionProperty, scene.framedImage1.positionProperty,
      scene.framedImage1.opticalImageTypeProperty, realLightRays1Options );
    const virtualLightRays1Node = new VirtualLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: realLightRays1Options.stroke,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );

    // Light rays (real & virtual) associated with the second point-of-interest (also on the framed object).
    const realLightRays2Options = {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.secondPointVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    };
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, realLightRays2Options );
    const realLightRays2ForegroundNode = new RealLightRaysForegroundNode( scene.lightRays2, modelViewTransform,
      modelVisibleBoundsProperty, scene.optic.positionProperty, scene.framedImage2.positionProperty,
      scene.framedImage2.opticalImageTypeProperty, realLightRays2Options );
    const virtualLightRays2Node = new VirtualLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: realLightRays2Options.stroke,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.secondPointVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );

    this.children = [
      opticalAxisNode,
      framedObjectNode,
      realLightRays1Node,
      realLightRays2Node,
      framedImageNode,
      opticalAxisForegroundNode,
      opticNode,
      opticVerticalAxisNode,
      focalPointsNode,
      twoFPointsNode,
      realLightRays1ForegroundNode,
      realLightRays2ForegroundNode,
      virtualLightRays1Node,
      virtualLightRays2Node,
      secondPointNode
    ];

    if ( scene.guides1 ) {
      const guides1Node = new GuidesNode( scene.guides1, GOColors.guideArm1FillProperty, modelViewTransform, {
        visibleProperty: visibleProperties.guidesVisibleProperty,
        tandem: options.tandem.createTandem( 'guides1Node' ),
        phetioDocumentation: 'guides associated with the first point-of-interest on the framed object'
      } );
      this.addChild( guides1Node );
    }

    if ( scene.guides2 ) {
      const guides2Tandem = options.tandem.createTandem( 'guides2Node' );
      const guides2Node = new GuidesNode( scene.guides2, GOColors.guideArm2FillProperty, modelViewTransform, {
          visibleProperty: DerivedProperty.and(
            [ visibleProperties.guidesVisibleProperty, visibleProperties.secondPointVisibleProperty ], {
              tandem: guides2Tandem.createTandem( 'visibleProperty' ),
              phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
            } ),
          tandem: guides2Tandem,
          phetioDocumentation: 'guides associated with the second point-of-interest on the framed object'
        } );
      this.addChild( guides2Node );
    }

    this.rulerHotkeysData = {
      opticPositionProperty: scene.optic.positionProperty,
      framedObjectPositionProperty: scene.framedObject.positionProperty,
      framedImagePositionProperty: scene.framedImage1.positionProperty,
      framedImageNodeVisibleProperty: framedImageNode.visibleProperty,
      secondPointPositionProperty: scene.secondPoint.positionProperty,
      secondPointVisibleProperty: visibleProperties.secondPointVisibleProperty,
      lightSource1PositionProperty: null,
      lightSource2PositionProperty: null
    };

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