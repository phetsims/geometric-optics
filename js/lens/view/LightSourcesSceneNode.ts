// Copyright 2022, University of Colorado Boulder

//TODO factor out GOSceneNode that creates common things
/**
 * LightSourcesSceneNode is the view of FramedObjectScene, the scene that uses a framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
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
import LightRaysNode from '../../common/view/LightRaysNode.js';
import OpticalAxisForegroundNode from '../../common/view/OpticalAxisForegroundNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../../common/model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LightSourcesScene from '../model/LightSourcesScene.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import LightSpotNode from './LightSpotNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GuidesNode from './GuidesNode.js';
import LightSourceNode from './LightSourceNode.js';

type LightSourcesSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class LightSourcesSceneNode extends Node {

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

    // The parts of the optical axis that appear to be in front of Nodes that have 3D perspective.
    const opticalAxisForegroundNode = new OpticalAxisForegroundNode(
      scene.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform,
      scene.lightRays1.raysProcessedEmitter,
      scene.representationProperty,
      new Property( Vector2.ZERO ), // TODO irrelevant for this scene
      new Node(), // TODO irrelevant for this scene,
      new Property( Vector2.ZERO ), // TODO irrelevant for this scene
      new Node(), // TODO irrelevant for this scene
      scene.projectionScreen, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty
      } );

    // Light rays associated with the first point of interest (the Object's position).
    const lightRays1Node = new LightRaysNode( scene.lightRays1, scene.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, {
        realRaysStroke: GOColors.rays1StrokeProperty,
        virtualRaysStroke: GOColors.rays1StrokeProperty
      } );

    // Light rays associated with the second point of interest.
    const lightRays2Node = new LightRaysNode( scene.lightRays2, scene.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, {
        realRaysStroke: GOColors.rays2StrokeProperty,
        virtualRaysStroke: GOColors.rays2StrokeProperty,
        visibleProperty: visibleProperties.secondPointVisibleProperty
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
      visibleProperty: scene.target1.visibleProperty
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    // LightSpot associated with the second light source
    const lightSpot2Node = new LightSpotNode( scene.lightSpot2, modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ scene.target2.visibleProperty, visibleProperties.secondPointVisibleProperty ] )
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    const guides1Node = new GuidesNode( scene.topGuide1, scene.bottomGuide1,
      GOColors.guideArm1FillProperty, modelViewTransform, {
        visibleProperty: visibleProperties.guidesVisibleProperty,
        tandem: options.tandem.createTandem( 'guides1Node' ),
        phetioDocumentation: 'TODO'
      } );

    const guides2Node = new GuidesNode( scene.topGuide2, scene.bottomGuide2,
      GOColors.guideArm2FillProperty, modelViewTransform, {
        visibleProperty: DerivedProperty.and(
          [ visibleProperties.guidesVisibleProperty, visibleProperties.secondPointVisibleProperty ]
        ),
        tandem: options.tandem.createTandem( 'guides2Node' ),
        phetioDocumentation: 'TODO'
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
      lightRays1Node,
      lightRays2Node,
      guides1Node,
      guides2Node
    ];

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

  reset() {
    this.resetLightSourcesSceneNode();
  }
}

geometricOptics.register( 'LightSourcesSceneNode', LightSourcesSceneNode );
export default LightSourcesSceneNode;