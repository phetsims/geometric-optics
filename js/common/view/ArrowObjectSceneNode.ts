// Copyright 2022, University of Colorado Boulder

//TODO lots of duplication with FramedObjectScene
/**
 * ArrowObjectSceneNode is the view of ArrowObjectScene, the scene that uses a arrow objects.
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
import OpticalAxisNode from './OpticalAxisNode.js';
import OpticVerticalAxisNode from './OpticVerticalAxisNode.js';
import { RaysType } from '../model/RaysType.js';
import FocalPointNode from './FocalPointNode.js';
import TwoFPointNode from './TwoFPointNode.js';
import GOColors from '../GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VirtualLightRaysNode from './VirtualLightRaysNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GuidesNode from '../../lens/view/GuidesNode.js';
import { RulerHotkeysData } from './GORulerNode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import ArrowObjectScene from '../model/ArrowObjectScene.js';
import ArrowObjectNode from './ArrowObjectNode.js';
import ArrowImageNode from './ArrowImageNode.js';

type ArrowObjectSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class ArrowObjectSceneNode extends Node {

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
    const twoFPointsNodeTandem = options.tandem.createTandem( 'twoFPointsNode' );
    const twoFPointsNode = new Node( {
      children: [
        new TwoFPointNode( scene.optic.left2FProperty, modelViewTransform, {
          tandem: twoFPointsNodeTandem.createTandem( 'left2FPointNode' )
        } ),
        new TwoFPointNode( scene.optic.right2FProperty, modelViewTransform, {
          tandem: twoFPointsNodeTandem.createTandem( 'right2FPointNode' )
        } )
      ],
      visibleProperty: visibleProperties.twoFPointsVisibleProperty,
      tandem: twoFPointsNodeTandem
    } );

    const arrowObject1Node = new ArrowObjectNode( scene.arrowObject1, scene.optic, modelBoundsProperty, modelViewTransform, {
      tandem: options.tandem.createTandem( 'arrowObject1Node' )
    } );

    const arrowObject2Node = new ArrowObjectNode( scene.arrowObject2, scene.optic, modelBoundsProperty, modelViewTransform, {
      visibleProperty: visibleProperties.secondPointVisibleProperty,
      tandem: options.tandem.createTandem( 'arrowObject2Node' )
    } );

    const arrowImage1Node = new ArrowImageNode( scene.arrowImage1, visibleProperties.virtualImageVisibleProperty,
      visibleProperties.raysAndImagesVisibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'arrowImage1Node' )
      } );

    const arrowImage2Node = new ArrowImageNode( scene.arrowImage2, visibleProperties.virtualImageVisibleProperty,
      visibleProperties.raysAndImagesVisibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'arrowImage2Node' )
      } );

    // Light rays (real & virtual) associated with the first point-of-interest (the framed object's position).
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: visibleProperties.raysAndImagesVisibleProperty
    } );
    const virtualLightRays1Node = new VirtualLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );

    // Light rays (real & virtual) associated with the second point-of-interest (also on the framed object).
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.secondPointVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );
    const virtualLightRays2Node = new VirtualLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [
        visibleProperties.virtualImageVisibleProperty,
        visibleProperties.secondPointVisibleProperty,
        visibleProperties.raysAndImagesVisibleProperty
      ] )
    } );

    const children = [
      opticalAxisNode,
      arrowObject1Node,
      arrowObject2Node,
      arrowImage1Node,
      arrowImage2Node,
      opticNode,
      opticVerticalAxisNode,
      focalPointsNode,
      twoFPointsNode,
      realLightRays1Node,
      virtualLightRays1Node,
      realLightRays2Node,
      virtualLightRays2Node
    ];

    if ( scene.guides1 ) {
      const guides1Node = new GuidesNode( scene.guides1, GOColors.guideArm1FillProperty, modelViewTransform, {
        visibleProperty: visibleProperties.guidesVisibleProperty,
        tandem: options.tandem.createTandem( 'guides1Node' ),
        phetioDocumentation: 'guides associated with the first point-of-interest on the framed object'
      } );
      children.push( guides1Node );
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
      children.push( guides2Node );
    }

    this.children = children;

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
      arrowObject1Node.reset();
      arrowObject2Node.reset();
    };
  }

  public reset(): void {
    this.resetFrameObjectSceneNode();
  }
}

geometricOptics.register( 'ArrowObjectSceneNode', ArrowObjectSceneNode );
export default ArrowObjectSceneNode;