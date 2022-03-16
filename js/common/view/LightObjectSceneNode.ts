// Copyright 2022, University of Colorado Boulder

/**
 * LightObjectSceneNode is the view of LightObjectScene, the scene that has light objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from './VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { RaysType } from '../model/RaysType.js';
import GOColors from '../../common/GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LightObjectScene from '../model/LightObjectScene.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import LightSpotNode from './LightSpotNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LightObjectNode from './LightObjectNode.js';
import OpticalAxisInFrontOfProjectionScreenNode from './OpticalAxisInFrontOfProjectionScreenNode.js';
import GOSceneNode, { GOSceneNodeOptions } from './GOSceneNode.js';
import IProperty from '../../../../axon/js/IProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import ToolJumpPoint from './tools/ToolJumpPoint.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  objectDragModeProperty: IReadOnlyProperty<ObjectDragMode>,
};

type LightObjectSceneNodeOptions = SelfOptions & GOSceneNodeOptions;

class LightObjectSceneNode extends GOSceneNode {

  // See GOSceneNode
  public readonly toolJumpPoints: ToolJumpPoint[];

  // Visibility of things that have labels, intended to be used to control the visibility of associated labels.
  // Do not set these Properties. They should be IReadOnlyProperty<boolean>, but Node currently requires IProperty<boolean>.
  public readonly lightObject1NodeVisibleProperty: IProperty<boolean>;
  public readonly lightObject2NodeVisibleProperty: IProperty<boolean>;
  public readonly projectionScreenNodeVisibleProperty: IProperty<boolean>;

  // Resets things that are specific to this class.
  private readonly resetLightObjectSceneNode: () => void;

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
  constructor( scene: LightObjectScene,
               visibleProperties: VisibleProperties,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: LightObjectSceneNodeOptions ) {

    super( scene, visibleProperties, modelViewTransform, modelVisibleBoundsProperty, sceneBoundsProperty, raysTypeProperty, providedOptions );

    const lightWasDraggedProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'lightWasDraggedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Was either light dragged? Dragging either light hides the cueing arrows for both lights.'
    } );

    // First light
    const lightObject1Node = new LightObjectNode( scene.lightObject1, sceneBoundsProperty, scene.optic.positionProperty,
      modelViewTransform, providedOptions.objectDragModeProperty, lightWasDraggedProperty, {
        tandem: providedOptions.tandem.createTandem( 'lightObject1Node' )
      } );
    this.opticalObjectsLayer.addChild( lightObject1Node );

    // Second light
    const lightObject2Node = new LightObjectNode( scene.lightObject2, sceneBoundsProperty, scene.optic.positionProperty,
      modelViewTransform, providedOptions.objectDragModeProperty, lightWasDraggedProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'lightObject2Node' )
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
      visibleProperty: lightPropagationEnabledProperty
    } );
    this.raysForegroundLayer.addChild( realLightRays1Node );

    // Real light rays associated with the second light.
    // Note that virtual rays are not shown in this scene, because no optical image is being formed.
    const realLightRays2Node = new RealLightRaysNode( scene.lightRays2, modelViewTransform, {
      stroke: GOColors.rays2StrokeProperty,
      visibleProperty: DerivedProperty.and( [ visibleProperties.secondPointVisibleProperty, lightPropagationEnabledProperty ] )
    } );
    this.raysForegroundLayer.addChild( realLightRays2Node );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      scene.projectionScreen,
      scene.optic.positionProperty,
      sceneBoundsProperty,
      modelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'projectionScreenNode' )
      }
    );
    this.opticalImagesLayer.addChild( projectionScreenNode );

    // LightSpot associated with the first light
    const lightSpot1Node = new LightSpotNode( scene.lightSpot1, modelViewTransform, {
      visibleProperty: scene.opticalImage1.visibleProperty,
      tandem: providedOptions.tandem.createTandem( 'lightSpot1Node' )
    } );
    this.opticalImagesLayer.addChild( lightSpot1Node );

    // LightSpot associated with the second light
    const lightSpot2NodeTandem = providedOptions.tandem.createTandem( 'lightSpot2Node' );
    const lightSpot2Node = new LightSpotNode( scene.lightSpot2, modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ scene.opticalImage2.visibleProperty, visibleProperties.secondPointVisibleProperty ], {
          tandem: lightSpot2NodeTandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } ),
      tandem: lightSpot2NodeTandem
    } );
    this.opticalImagesLayer.addChild( lightSpot2Node );

    // Add things that are interactive in this scene to the focus traversal order.
    this.pdomOrder = [
      lightObject1Node,
      lightObject2Node,
      projectionScreenNode
    ];

    // Ruler J+P hotkey will cycle through these positions, dynamically looking at left-to-right x coordinate.
    this.toolJumpPoints = [
      ...this.opticJumpPoints,

      // objects
      {
        positionProperty: scene.lightObject1.positionProperty,
        visibleProperty: lightObject1Node.visibleProperty
      },
      {
        positionProperty: scene.lightObject2.positionProperty,
        visibleProperty: lightObject2Node.visibleProperty
      },

      // positions where rays converge and an image would form
      {
        positionProperty: scene.opticalImage1.positionProperty,
        visibleProperty: new DerivedProperty( [ scene.opticalImage1.positionProperty, scene.projectionScreen.positionProperty ],
          ( opticalImagePosition: Vector2, screenPosition: Vector2 ) => opticalImagePosition.x <= screenPosition.x
        )
      },
      {
        positionProperty: scene.opticalImage2.positionProperty,
        visibleProperty: new DerivedProperty( [ scene.opticalImage2.positionProperty, scene.projectionScreen.positionProperty ],
          ( opticalImagePosition: Vector2, screenPosition: Vector2 ) => opticalImagePosition.x <= screenPosition.x
        )
      },

      // light spots on the projection screen
      {
        positionProperty: scene.lightSpot1.positionProperty,
        visibleProperty: lightSpot1Node.visibleProperty
      },
      {
        positionProperty: scene.lightSpot2.positionProperty,
        visibleProperty: lightSpot2Node.visibleProperty
      }
    ];

    // Visibility for associates labels
    this.lightObject1NodeVisibleProperty = lightObject1Node.visibleProperty;
    this.lightObject2NodeVisibleProperty = lightObject2Node.visibleProperty;
    this.projectionScreenNodeVisibleProperty = projectionScreenNode.visibleProperty;

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