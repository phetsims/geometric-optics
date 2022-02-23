// Copyright 2022, University of Colorado Boulder

/**
 * GOSceneNode is the abstract base class for all scenes.  It handles things related to the optic and guides,
 * and creates "layers" for things that may be added by subclasses.
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
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GuidesNode from './GuidesNode.js';
import { RulerHotkeyTarget } from './GORulerNode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import GOScene from '../model/GOScene.js';
import IProperty from '../../../../axon/js/IProperty.js';

type GOSceneNodeOptions = {

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty, //TODO not used in this class, move to subclasses

  visibleProperty: IProperty<boolean>,

  tandem: Tandem
};

abstract class GOSceneNode extends Node {

  // Measurement points for the horizontal ruler
  public abstract readonly horizontalRulerHotkeyTargets: RulerHotkeyTarget[];

  // Measurement points for the vertical ruler
  public abstract readonly verticalRulerHotkeyTargets: RulerHotkeyTarget[];

  protected readonly opticNode: Node;

  // Various rendering layers
  protected readonly opticalAxisForegroundLayer: Node;
  protected readonly opticalObjectsLayer: Node;
  protected readonly opticalImagesLayer: Node;
  protected readonly raysForegroundLayer: Node;
  protected readonly raysBackgroundLayer: Node;

  /**
   * @param scene
   * @param visibleProperties
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param raysTypeProperty
   * @param providedOptions
   */
  protected constructor( scene: GOScene,
                         visibleProperties: VisibleProperties,
                         modelViewTransform: ModelViewTransform2,
                         modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
                         sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
                         raysTypeProperty: IReadOnlyProperty<RaysType>,
                         providedOptions: GOSceneNodeOptions ) {

    const options = merge( {
      visiblePropertyOptions: { phetioReadOnly: true }
    }, providedOptions );

    super( options );

    this.opticNode = options.createOpticNode( scene.optic, modelViewTransform, options.tandem );

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

    // Layers for things that may be added by subclasses
    this.opticalAxisForegroundLayer = new Node();
    this.opticalObjectsLayer = new Node();
    this.opticalImagesLayer = new Node();
    this.raysForegroundLayer = new Node();
    this.raysBackgroundLayer = new Node();

    const guidesLayer = new Node();

    if ( scene.guides1 ) {
      const guides1Node = new GuidesNode( scene.guides1, GOColors.guideArm1FillProperty, modelViewTransform, {
        visibleProperty: visibleProperties.guidesVisibleProperty,
        tandem: options.tandem.createTandem( 'guides1Node' ),
        phetioDocumentation: 'guides associated with the first object'
      } );
      guidesLayer.addChild( guides1Node );
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
        phetioDocumentation: 'guides associated with the second object'
      } );
      guidesLayer.addChild( guides2Node );
    }

    // Rendering order is VERY important here.
    this.children = [
      opticalAxisNode,
      this.raysBackgroundLayer,
      this.opticalObjectsLayer,
      this.opticalImagesLayer,
      this.opticalAxisForegroundLayer,
      this.opticNode,
      opticVerticalAxisNode,
      focalPointsNode,
      twoFPointsNode,
      this.raysForegroundLayer,
      guidesLayer
    ];
  }
}

geometricOptics.register( 'GOSceneNode', GOSceneNode );
export default GOSceneNode;
export type { GOSceneNodeOptions };