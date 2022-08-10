// Copyright 2022, University of Colorado Boulder

/**
 * LightSceneNode is the view of the 'Light' scene, the scene that has light objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from './VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { RaysType } from '../model/RaysType.js';
import GOColors from '../../common/GOColors.js';
import RealLightRaysNode from './RealLightRaysNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LightScene from '../model/LightScene.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import LightSpotNode from './LightSpotNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LightObjectNode from './LightObjectNode.js';
import OpticalAxisInFrontOfProjectionScreenNode from './OpticalAxisInFrontOfProjectionScreenNode.js';
import GOSceneNode, { GOSceneNodeOptions } from './GOSceneNode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import ToolJumpPoint from '../model/tools/ToolJumpPoint.js';
import { ObjectDragMode } from './ObjectDragMode.js';

type SelfOptions = {
  objectDragModeProperty: TReadOnlyProperty<ObjectDragMode>;
};

type LightObjectSceneNodeOptions = SelfOptions & GOSceneNodeOptions;

export default class LightSceneNode extends GOSceneNode {

  // See GOSceneNode
  public readonly toolJumpPoints: ToolJumpPoint[];

  public readonly scene: LightScene;

  // Visibility of things that have labels, intended to be used to control the visibility of associated labels.
  public readonly lightObject1NodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly lightObject2NodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly projectionScreenNodeVisibleProperty: TReadOnlyProperty<boolean>;

  // Resets things that are specific to this class.
  private readonly resetLightObjectSceneNode: () => void;

  /**
   * @param scene - model element
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param raysTypeProperty - representation used for rays
   * @param lightPropagationEnabledProperty - is light propagation enabled?
   * @param providedOptions
   */
  public constructor( scene: LightScene,
                      visibleProperties: VisibleProperties,
                      modelViewTransform: ModelViewTransform2,
                      modelVisibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      sceneBoundsProperty: TReadOnlyProperty<Bounds2>,
                      raysTypeProperty: TReadOnlyProperty<RaysType>,
                      lightPropagationEnabledProperty: TReadOnlyProperty<boolean>,
                      providedOptions: LightObjectSceneNodeOptions ) {

    super( scene, visibleProperties, modelViewTransform, modelVisibleBoundsProperty, sceneBoundsProperty, raysTypeProperty, providedOptions );

    this.scene = scene;

    const lightWasDraggedProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'lightWasDraggedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Was either light dragged? Dragging either light hides the cueing arrows for both lights.'
    } );

    // First light
    const lightObject1Node = new LightObjectNode( scene.lightObject1, sceneBoundsProperty, scene.lens.positionProperty,
      modelViewTransform, providedOptions.objectDragModeProperty, lightWasDraggedProperty, {
        tandem: providedOptions.tandem.createTandem( 'lightObject1Node' )
      } );
    this.opticalObjectsLayer.addChild( lightObject1Node );

    // Second light
    const lightObject2Node = new LightObjectNode( scene.lightObject2, sceneBoundsProperty, scene.lens.positionProperty,
      modelViewTransform, providedOptions.objectDragModeProperty, lightWasDraggedProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'lightObject2Node' )
      } );
    this.opticalObjectsLayer.addChild( lightObject2Node );

    // The part of the optical axis that appears to be in front of the projection screen
    const opticalAxisForegroundNode = new OpticalAxisInFrontOfProjectionScreenNode(
      scene.lens.positionProperty,
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
      visibleProperty: DerivedProperty.and( [ lightPropagationEnabledProperty, visibleProperties.secondPointVisibleProperty ] )
    } );
    this.raysForegroundLayer.addChild( realLightRays2Node );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      scene.projectionScreen,
      scene.lens.positionProperty,
      sceneBoundsProperty,
      modelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'projectionScreenNode' )
      }
    );
    this.opticalImagesLayer.addChild( projectionScreenNode );

    // LightSpot associated with the first light
    const lightSpot1NodeTandem = providedOptions.tandem.createTandem( 'lightSpot1Node' );
    const lightSpot1Node = new LightSpotNode( scene.lightSpot1, scene.projectionScreen, modelViewTransform, {
      visibleProperty: DerivedProperty.and( [
        scene.lightSpot1.intersectsProjectionScreenProperty,
        lightPropagationEnabledProperty,
        scene.opticalImage1.visibleProperty
      ], {
        tandem: lightSpot1NodeTandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: providedOptions.tandem.createTandem( 'lightSpot1Node' )
    } );
    this.opticalImagesLayer.addChild( lightSpot1Node );

    // LightSpot associated with the second light
    const lightSpot2NodeTandem = providedOptions.tandem.createTandem( 'lightSpot2Node' );
    const lightSpot2Node = new LightSpotNode( scene.lightSpot2, scene.projectionScreen, modelViewTransform, {
      visibleProperty: DerivedProperty.and( [
        scene.lightSpot2.intersectsProjectionScreenProperty,
        lightPropagationEnabledProperty,
        scene.opticalImage2.visibleProperty,
        visibleProperties.secondPointVisibleProperty
      ], {
        tandem: lightSpot2NodeTandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
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

    // Tool jump points that are common to both lens shapes.
    const commonJumpPoints = [

      // from base class
      ...this.opticJumpPoints,

      // optical objects
      new ToolJumpPoint( scene.lightObject1.positionProperty, lightObject1Node.visibleProperty ),
      new ToolJumpPoint( scene.lightObject2.positionProperty, lightObject2Node.visibleProperty )
    ];

    // 'J' hotkey will cycle tools through these points, dynamically looking at left-to-right x coordinate.
    this.toolJumpPoints = [ ...commonJumpPoints ];

    // Jump points that are interesting only for convex lenses.
    // See https://github.com/phetsims/geometric-optics/issues/426
    const convexJumpPoints = [

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

    // Adjust the tool jump points based on the surface type of the lens.
    // The tools have a reference to this.toolJumpPoints, so it's important that this array is modified in place.
    scene.lens.opticSurfaceTypeProperty.link( opticSurfaceType => {
      if ( opticSurfaceType === 'convex' ) {

        // Add jump points that are interesting only for a convex lens. We're checking points before pushing
        // them in case there's any PhET-iO funny business, so we don't end up with duplicate points in the array.
        convexJumpPoints.forEach( jumpPoint => {
          if ( !this.toolJumpPoints.includes( jumpPoint ) ) {
            this.toolJumpPoints.push( jumpPoint );
          }
        } );
        assert && assert( this.toolJumpPoints.length === commonJumpPoints.length + convexJumpPoints.length );
      }
      else {

        // Remove jump points that are interesting only for a convex lens.
        // We're confirming that the points are in the array in case there's any PhET-iO funny business.
        convexJumpPoints.forEach( jumpPoint => {
          const index = this.toolJumpPoints.indexOf( jumpPoint );
          ( index !== -1 ) && this.toolJumpPoints.splice( index, 1 );
        } );
        assert && assert( this.toolJumpPoints.length === commonJumpPoints.length );
      }
    } );

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

geometricOptics.register( 'LightSceneNode', LightSceneNode );