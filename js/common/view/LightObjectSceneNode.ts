// Copyright 2022, University of Colorado Boulder

/**
 * LightObjectSceneNode is the view of LightObjectScene, the scene that has light objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from './VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { RaysType } from '../model/RaysType.js';
import GOColors from '../../common/GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../../common/model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LightObjectScene from '../model/LightObjectScene.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import LightSpotNode from './LightSpotNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LightObjectNode from './LightObjectNode.js';
import OpticalAxisInFrontOfProjectionScreenNode from './OpticalAxisInFrontOfProjectionScreenNode.js';
import { RulerHotkeysData } from './GORulerNode.js';
import GOSceneNode from './GOSceneNode.js';

type LightObjectSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty,

  tandem: Tandem
};

class LightObjectSceneNode extends GOSceneNode {

  public readonly rulerHotkeysData: RulerHotkeysData;
  private readonly resetLightObjectSceneNode: () => void;

  /**
   * @param scene
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty
   * @param modelBoundsProperty
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( scene: LightObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: LightObjectSceneNodeOptions ) {

    const options = merge( {
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    super( scene, visibleProperties, modelViewTransform, modelVisibleBoundsProperty, modelBoundsProperty, raysTypeProperty, options );

    const lightWasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'lightWasDraggedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Was either light dragged? Dragging either light hides the cueing arrows for both lights.'
    } );

    // First light
    const lightObject1Node = new LightObjectNode( scene.lightObject1, modelBoundsProperty, scene.optic.positionProperty,
      modelViewTransform, options.dragLockedProperty, lightWasDraggedProperty, {
        tandem: options.tandem.createTandem( 'lightObject1Node' )
      } );
    this.opticalObjectsLayer.addChild( lightObject1Node );

    // Second light
    const lightObject2Node = new LightObjectNode( scene.lightObject2, modelBoundsProperty, scene.optic.positionProperty,
      modelViewTransform, options.dragLockedProperty, lightWasDraggedProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: options.tandem.createTandem( 'lightObject2Node' )
      } );
    this.opticalObjectsLayer.addChild( lightObject2Node );

    // The part of the optical axis that appears to be in front of the projection screen
    const opticalAxisForegroundNode = new OpticalAxisInFrontOfProjectionScreenNode(
      scene.optic.positionProperty,
      scene.projectionScreen.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty
      } );
    this.opticalAxisForegroundLayer.addChild( opticalAxisForegroundNode );

    // Real light rays associated with the first light.
    // Note that virtual rays are not shown in this scene, because no optical image is being formed.
    const realLightRays1Node = new RealLightRaysNode( scene.lightRays1, modelViewTransform, {
      stroke: GOColors.rays1StrokeProperty,
      visibleProperty: visibleProperties.raysAndImagesVisibleProperty
    } );
    this.raysForegroundLayer.addChild( realLightRays1Node );

    // Real light rays associated with the second light.
    // Note that virtual rays are not shown in this scene, because no optical image is being formed.
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and(
        [ visibleProperties.secondPointVisibleProperty, visibleProperties.raysAndImagesVisibleProperty ] )
    } );
    this.raysForegroundLayer.addChild( realLightRays2Node );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      scene.projectionScreen,
      scene.optic.positionProperty,
      modelBoundsProperty,
      modelViewTransform, {
        tandem: options.tandem.createTandem( 'projectionScreenNode' )
      }
    );
    this.opticalImagesLayer.addChild( projectionScreenNode );

    // LightSpot associated with the first light
    const lightSpot1Node = new LightSpotNode( scene.lightSpot1, modelViewTransform, {
      visibleProperty: scene.opticalImage1.visibleProperty
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );
    this.opticalImagesLayer.addChild( lightSpot1Node );

    // LightSpot associated with the second light
    const lightSpot2Node = new LightSpotNode( scene.lightSpot2, modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ scene.opticalImage2.visibleProperty, visibleProperties.secondPointVisibleProperty ] )
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );
    this.opticalImagesLayer.addChild( lightSpot2Node );

    // Add things that are interactive in this scene to the focus traversal order.
    this.pdomOrder = [
      lightObject1Node,
      lightObject2Node,
      projectionScreenNode
    ];

    this.rulerHotkeysData = {
      opticPositionProperty: scene.optic.positionProperty,
      opticalObject1PositionProperty: scene.lightObject1.positionProperty,
      opticalObject2PositionProperty: scene.lightObject2.positionProperty,
      opticalObject2VisibleProperty: lightObject2Node.visibleProperty,
      opticalImage1PositionProperty: null,
      opticalImage1VisibleProperty: null
    };

    //TODO is this complete?
    this.resetLightObjectSceneNode = () => {
      lightWasDraggedProperty.reset();
      projectionScreenNode.reset();
    };
  }

  public reset(): void {
    this.resetLightObjectSceneNode();
  }
}

geometricOptics.register( 'LightObjectSceneNode', LightObjectSceneNode );
export default LightObjectSceneNode;