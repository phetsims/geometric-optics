// Copyright 2022, University of Colorado Boulder

//TODO factor out GOSceneNode that creates common things
/**
 * LightSourcesSceneNode is the view of FramedObjectScene, the scene that uses a framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from '../../common/view/VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalAxisNode from '../../common/view/OpticalAxisNode.js';
import OpticVerticalAxisNode from '../../common/view/OpticVerticalAxisNode.js';
import { RaysType } from '../../common/model/RaysType.js';
import FocalPointNode from '../../common/view/FocalPointNode.js';
import TwoFPointNode from '../../common/view/TwoFPointNode.js';
import GOColors from '../../common/GOColors.js';
import RealLightRaysNode from '../../common/view/RealLightRaysNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../../common/model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LightSourcesScene from '../model/LightSourcesScene.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import LightSpotNode from './LightSpotNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GuidesNode from './GuidesNode.js';
import LightSourceNode from './LightSourceNode.js';
import OpticalAxisInFrontOfProjectionScreenNode from './OpticalAxisInFrontOfProjectionScreenNode.js';
import { RulerHotkeysData } from '../../common/view/GORulerNode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type LightSourcesSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class LightSourcesSceneNode extends Node {

  public readonly rulerHotkeysData: RulerHotkeysData;
  private readonly resetLightSourcesSceneNode: () => void;

  /**
   * @param scene
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty
   * @param modelBoundsProperty
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( scene: LightSourcesScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: LightSourcesSceneNodeOptions ) {

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

    const lightWasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'lightWasDraggedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Was either light dragged? Dragging either light hides the cueing arrows for both lights.'
    } );

    const lightSource1Node = new LightSourceNode( scene.lightSource1, modelBoundsProperty, scene.optic.positionProperty,
      modelViewTransform, options.dragLockedProperty, lightWasDraggedProperty, {
        tandem: options.tandem.createTandem( 'lightSource1Node' )
      } );

    const lightSource2Node = new LightSourceNode( scene.lightSource2, modelBoundsProperty, scene.optic.positionProperty,
      modelViewTransform, options.dragLockedProperty, lightWasDraggedProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: options.tandem.createTandem( 'lightSource2Node' )
      } );

    // The part of the optical axis that appears to be in front of the projection screen
    const opticalAxisForegroundNode = new OpticalAxisInFrontOfProjectionScreenNode(
      scene.optic.positionProperty,
      scene.projectionScreen.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty
      } );

    // Real light rays associated with the first light source.
    // Note that virtual rays are not shown in this scene, because no optical image is being formed.
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: visibleProperties.raysAndImagesVisibleProperty
    } );

    // Real light rays associated with the second light source.
    // Note that virtual rays are not shown in this scene, because no optical image is being formed.
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and(
        [ visibleProperties.secondPointVisibleProperty, visibleProperties.raysAndImagesVisibleProperty ] )
    } );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      scene.projectionScreen,
      scene.optic.positionProperty,
      modelBoundsProperty,
      modelViewTransform, {
        tandem: options.tandem.createTandem( 'projectionScreenNode' )
      }
    );

    // LightSpot associated with the first light source
    const lightSpot1Node = new LightSpotNode( scene.lightSpot1, modelViewTransform, {
      visibleProperty: scene.opticalImage1.visibleProperty
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    // LightSpot associated with the second light source
    const lightSpot2Node = new LightSpotNode( scene.lightSpot2, modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ scene.opticalImage2.visibleProperty, visibleProperties.secondPointVisibleProperty ] )
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    const guides1Node = new GuidesNode( scene.guides1, GOColors.guideArm1FillProperty, modelViewTransform, {
      visibleProperty: visibleProperties.guidesVisibleProperty,
      tandem: options.tandem.createTandem( 'guides1Node' ),
      phetioDocumentation: 'guides associated with the first light source'
    } );

    const guides2Tandem = options.tandem.createTandem( 'guides2Node' );
    const guides2Node = new GuidesNode( scene.guides2, GOColors.guideArm2FillProperty, modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ visibleProperties.guidesVisibleProperty, visibleProperties.secondPointVisibleProperty ], {
          tandem: guides2Tandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } ),
      tandem: guides2Tandem,
      phetioDocumentation: 'guides associated with the second list source'
    } );

    this.children = [
      opticalAxisNode,
      lightSource1Node,
      lightSource2Node,
      projectionScreenNode,
      lightSpot1Node,
      lightSpot2Node,
      opticalAxisForegroundNode,
      opticNode,
      opticVerticalAxisNode,
      focalPointsNode,
      twoFPointsNode,
      realLightRays1Node,
      realLightRays2Node,
      guides1Node,
      guides2Node
    ];

    this.rulerHotkeysData = {
      opticPositionProperty: scene.optic.positionProperty,
      opticalObject1PositionProperty: scene.lightSource1.positionProperty,
      opticalObject2PositionProperty: scene.lightSource2.positionProperty,
      opticalObject2VisibleProperty: lightSource2Node.visibleProperty,
      opticalImage1PositionProperty: null,
      opticalImage1VisibleProperty: null
    };

    this.pdomOrder = [
      lightSource1Node,
      lightSource2Node,
      projectionScreenNode
    ];

    //TODO is this complete?
    this.resetLightSourcesSceneNode = () => {
      lightWasDraggedProperty.reset();
      projectionScreenNode.reset();
    };
  }

  public reset(): void {
    this.resetLightSourcesSceneNode();
  }
}

geometricOptics.register( 'LightSourcesSceneNode', LightSourcesSceneNode );
export default LightSourcesSceneNode;