// Copyright 2022-2023, University of Colorado Boulder

/**
 * GOSceneNode is the abstract base class for all scenes.  It handles things related to the optic and guides,
 * and creates "layers" for things that may be added by subclasses.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import VisibleProperties from './VisibleProperties.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import OpticalAxisNode from './OpticalAxisNode.js';
import OpticVerticalAxisNode from './OpticVerticalAxisNode.js';
import { RaysType } from '../model/RaysType.js';
import FocalPointNode from './FocalPointNode.js';
import TwoFPointNode from './TwoFPointNode.js';
import GOColors from '../GOColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GuidesNode from './GuidesNode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import GOScene from '../model/GOScene.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ToolJumpPoint from '../model/tools/ToolJumpPoint.js';
import Lens from '../../lens/model/Lens.js';

type SelfOptions = {

  // Creates the Node for the optic
  createOpticNode: ( modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node;
};

export type GOSceneNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default abstract class GOSceneNode extends Node {

  // 'Jump points' for the tools. These are interesting points, where you might want to place a tool.
  // When a tool has focus, 'J' hotkey will cycle through these points, in order of ascending x coordinate.
  public abstract readonly toolJumpPoints: ToolJumpPoint[];

  public abstract readonly scene: GOScene;

  // Jump points related to the optic, common to all scenes
  protected readonly opticJumpPoints: ToolJumpPoint[];

  // Various rendering layers where subclasses are expected to add Nodes.
  protected readonly opticalAxisForegroundLayer: Node;
  protected readonly opticalObjectsLayer: Node;
  protected readonly opticalImagesLayer: Node;
  protected readonly raysForegroundLayer: Node;
  protected readonly raysBackgroundLayer: Node;

  // Visibility of things that have labels, intended to be used to control the visibility of associated labels.
  public readonly opticNodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly opticalAxisNodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly leftFocalPointNodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly rightFocalPointNodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly left2FPointNodeVisibleProperty: TReadOnlyProperty<boolean>;
  public readonly right2FPointNodeVisibleProperty: TReadOnlyProperty<boolean>;

  /**
   * @param scene - model element
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param raysTypeProperty - representation used for rays
   * @param providedOptions
   */
  protected constructor( scene: GOScene,
                         visibleProperties: VisibleProperties,
                         modelViewTransform: ModelViewTransform2,
                         modelVisibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                         sceneBoundsProperty: TReadOnlyProperty<Bounds2>,
                         raysTypeProperty: TReadOnlyProperty<RaysType>,
                         providedOptions: GOSceneNodeOptions ) {

    const options = optionize<GOSceneNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    super( options );

    const opticNode = options.createOpticNode( modelViewTransform, options.tandem );

    const opticalAxisNode = new OpticalAxisNode(
      scene.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform, {
        visibleProperty: visibleProperties.opticalAxisVisibleProperty,
        tandem: options.tandem.createTandem( 'opticalAxisNode' )
      } );

    const opticVerticalAxisNode = new OpticVerticalAxisNode( scene.optic, raysTypeProperty, modelViewTransform );

    /**
     * A note about visibility of focal points (F and 2F), see https://github.com/phetsims/geometric-optics/issues/457.
     * A lens has 2 focal points. But since a mirror only has one surface, it only has one focal point. Unfortunately,
     * our Optic base class is very dependent on having two F and 2F points. So rather than modify the model, we decided
     * to control the visibility of F and 2F in the view - see 'visibleProperty: new DerivedProperty(...)' below.
     * For a lens, all F and 2F points are made visible.
     * For a concave mirror, F and 2F are on the left, so only leftFocalPointNode and left2FPointNode are made visible.
     * For a convex mirror, F and 2F are on the right, so only rightFocalPointNode and right2FPointNode are visible.
     * For a flat mirror, F and 2F are at infinity, so all F and 2F points are made invisible.
     */

      // Focal Points (F)
    const focalPointsTandem = options.tandem.createTandem( 'focalPoints' );
    const leftFocalPointNodeTandem = focalPointsTandem.createTandem( 'leftFocalPointNode' );
    const leftFocalPointNode = new FocalPointNode( scene.optic.leftFocalPointProperty, modelViewTransform, {
      visibleProperty: ( scene.optic instanceof Lens ) ?
                       visibleProperties.focalPointsVisibleProperty :
                       new DerivedProperty(
                         [ visibleProperties.focalPointsVisibleProperty, scene.optic.opticSurfaceTypeProperty ],
                         ( focalPointsVisible, surfaceType ) => focalPointsVisible && surfaceType === 'concave', {
                           tandem: leftFocalPointNodeTandem.createTandem( 'visibleProperty' ),
                           phetioValueType: BooleanIO
                         } ),
      tandem: leftFocalPointNodeTandem
    } );

    const rightFocalPointNodeTandem = focalPointsTandem.createTandem( 'rightFocalPointNode' );
    const rightFocalPointNode = new FocalPointNode( scene.optic.rightFocalPointProperty, modelViewTransform, {
      visibleProperty: ( scene.optic instanceof Lens ) ?
                       visibleProperties.focalPointsVisibleProperty :
                       new DerivedProperty(
                         [ visibleProperties.focalPointsVisibleProperty, scene.optic.opticSurfaceTypeProperty ],
                         ( focalPointsVisible, surfaceType ) => focalPointsVisible && surfaceType === 'convex', {
                           tandem: rightFocalPointNodeTandem.createTandem( 'visibleProperty' ),
                           phetioValueType: BooleanIO
                         } ),
      tandem: rightFocalPointNodeTandem
    } );

    // 2F Points
    const twoFPointTandem = options.tandem.createTandem( 'twoFPoints' );
    const left2FPointNodeTandem = twoFPointTandem.createTandem( 'left2FPointNode' );
    const left2FPointNode = new TwoFPointNode( scene.optic.left2FProperty, modelViewTransform, {
      visibleProperty: ( scene.optic instanceof Lens ) ?
                       visibleProperties.twoFPointsVisibleProperty :
                       new DerivedProperty(
                         [ visibleProperties.twoFPointsVisibleProperty, scene.optic.opticSurfaceTypeProperty ],
                         ( twoFPointsVisible, surfaceType ) => twoFPointsVisible && surfaceType === 'concave', {
                           tandem: left2FPointNodeTandem.createTandem( 'visibleProperty' ),
                           phetioValueType: BooleanIO
                         } ),
      tandem: left2FPointNodeTandem
    } );

    const right2FPointNodeTandem = twoFPointTandem.createTandem( 'right2FPointNode' );
    const right2FPointNode = new TwoFPointNode( scene.optic.right2FProperty, modelViewTransform, {
      visibleProperty: ( scene.optic instanceof Lens ) ?
                       visibleProperties.twoFPointsVisibleProperty :
                       new DerivedProperty(
                         [ visibleProperties.twoFPointsVisibleProperty, scene.optic.opticSurfaceTypeProperty ],
                         ( twoFPointsVisible, surfaceType ) => twoFPointsVisible && surfaceType === 'convex', {
                           tandem: right2FPointNodeTandem.createTandem( 'visibleProperty' ),
                           phetioValueType: BooleanIO
                         } ),
      tandem: right2FPointNodeTandem
    } );

    // Layers for things that may be added by subclasses
    this.opticalAxisForegroundLayer = new Node();
    this.opticalObjectsLayer = new Node();
    this.opticalImagesLayer = new Node();
    this.raysForegroundLayer = new Node();
    this.raysBackgroundLayer = new Node();

    const guidesLayer = new Node();

    if ( scene.guides1 ) {
      const guides1Tandem = options.tandem.createTandem( 'guides1Node' );
      const guides1Node = new GuidesNode( scene.guides1, GOColors.guideArm1FillProperty, modelViewTransform, {
        visibleProperty: visibleProperties.guidesVisibleProperty,
        tandem: guides1Tandem,
        phetioDocumentation: 'guides associated with the first object'
      } );
      guidesLayer.addChild( guides1Node );
    }

    if ( scene.guides2 ) {
      const guides2Tandem = options.tandem.createTandem( 'guides2Node' );
      const guides2Node = new GuidesNode( scene.guides2, GOColors.guideArm2FillProperty, modelViewTransform, {
        visibleProperty: DerivedProperty.and( [
          visibleProperties.guidesVisibleProperty,
          visibleProperties.secondPointVisibleProperty
        ], {
          tandem: guides2Tandem.createTandem( 'visibleProperty' ),
          phetioValueType: BooleanIO
        } ),
        tandem: guides2Tandem,
        phetioDocumentation: 'guides associated with the second object'
      } );
      guidesLayer.addChild( guides2Node );
    }

    // Rendering order is VERY important here.
    this.children = [
      opticalAxisNode,
      this.opticalObjectsLayer,
      this.raysBackgroundLayer,
      this.opticalImagesLayer,
      this.opticalAxisForegroundLayer,
      opticNode,
      opticVerticalAxisNode,
      leftFocalPointNode,
      rightFocalPointNode,
      left2FPointNode,
      right2FPointNode,
      this.raysForegroundLayer,
      guidesLayer
    ];

    this.addLinkedElement( scene, {
      tandem: options.tandem.createTandem( scene.tandem.name )
    } );

    this.opticJumpPoints = [
      new ToolJumpPoint( scene.optic.positionProperty, opticNode.visibleProperty ),
      new ToolJumpPoint( scene.optic.leftFocalPointProperty, leftFocalPointNode.visibleProperty ),
      new ToolJumpPoint( scene.optic.rightFocalPointProperty, rightFocalPointNode.visibleProperty ),
      new ToolJumpPoint( scene.optic.left2FProperty, left2FPointNode.visibleProperty ),
      new ToolJumpPoint( scene.optic.right2FProperty, right2FPointNode.visibleProperty )
    ];

    // Visibility for associates labels
    this.opticNodeVisibleProperty = opticNode.visibleProperty;
    this.opticalAxisNodeVisibleProperty = opticalAxisNode.visibleProperty;
    this.leftFocalPointNodeVisibleProperty = leftFocalPointNode.visibleProperty;
    this.rightFocalPointNodeVisibleProperty = rightFocalPointNode.visibleProperty;
    this.left2FPointNodeVisibleProperty = left2FPointNode.visibleProperty;
    this.right2FPointNodeVisibleProperty = right2FPointNode.visibleProperty;
  }
}

geometricOptics.register( 'GOSceneNode', GOSceneNode );