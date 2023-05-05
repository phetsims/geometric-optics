// Copyright 2021-2023, University of Colorado Boulder

/**
 * GOScreenView is the common ScreenView for this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import { HBox, Node, Rectangle } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import GOQueryParameters from '../GOQueryParameters.js';
import GOModel from '../model/GOModel.js';
import GOControlPanel from './GOControlPanel.js';
import OpticSurfaceTypeRadioButtonGroup from './OpticSurfaceTypeRadioButtonGroup.js';
import OpticalObjectChoiceComboBox from './OpticalObjectChoiceComboBox.js';
import LightPropagationToggleButton from './LightPropagationToggleButton.js';
import VisibleProperties from './VisibleProperties.js';
import FramedSceneNode from './FramedSceneNode.js';
import GORulerNode from './tools/GORulerNode.js';
import GOToolboxNode from './tools/GOToolboxNode.js';
import FramedLabelsNode from './labels/FramedLabelsNode.js';
import ArrowSceneNode from './ArrowSceneNode.js';
import ArrowLabelsNode from './labels/ArrowLabelsNode.js';
import LightSceneNode from './LightSceneNode.js';
import LightLabelsNode from './labels/LightLabelsNode.js';
import GOSceneNode, { GOSceneNodeOptions } from './GOSceneNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ObjectDragModeToggleButton from './ObjectDragModeToggleButton.js';
import TProperty from '../../../../axon/js/TProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PositionMarkerNode from './tools/PositionMarkerNode.js';
import { ObjectDragMode, ObjectDragModeValues } from './ObjectDragMode.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { GOSimOptions } from '../../GOSim.js';
import GOToolNode from './tools/GOToolNode.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// Zoom scale factors, in ascending order.
// Careful! If you add values here, you may get undesirable tick intervals on rulers.
const ZOOM_SCALES = [ 0.25, 0.5, 1 ];

// view coordinates per cm when zoom scale is 1
const NOMINAL_MODEL_TO_VIEW_SCALE = 2;

type SelfOptions = {

  // Initial value for objectDragModeProperty
  objectDragMode?: ObjectDragMode;

  // Gets the position of the model origin in view coordinates
  getViewOrigin: ( layoutBounds: Bounds2 ) => Vector2;

} & PickRequired<GOSimOptions, 'isBasicsVersion'> & PickRequired<GOSceneNodeOptions, 'createOpticNode'>;

export type GOScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class GOScreenView extends ScreenView {

  // See phetioDocumentation at instantiation
  protected readonly objectDragModeProperty: TProperty<ObjectDragMode>;

  // Button for toggling between 'freeDragging' and 'horizontalDragging'
  protected readonly objectDragModeToggleButton: Node;

  // Resets things that are specific to this class.
  private readonly resetGOScreenView: () => void;

  public constructor( model: GOModel, providedOptions: GOScreenViewOptions ) {

    const options = optionize<GOScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // GOScreenViewOptions
      objectDragMode: 'freeDragging',

      // ScreenViewOptions
      // Workaround for things shifting around while dragging
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/geometric-optics/issues/213
      preventFit: true
    }, providedOptions );

    super( options );

    const viewOrigin = options.getViewOrigin( this.layoutBounds );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY(
      GOConstants.SCREEN_VIEW_X_MARGIN, GOConstants.SCREEN_VIEW_Y_MARGIN );

    // Create a y-inverted modelViewTransform with isometric scaling along x and y axes.
    // In the model coordinate frame, +x is right, +y is up.
    // This transform is applied to things in the scenesLayer, and does NOT include zoom scaling.
    const modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( Vector2.ZERO,
      NOMINAL_MODEL_TO_VIEW_SCALE, -NOMINAL_MODEL_TO_VIEW_SCALE );

    // Properties  =====================================================================================================

    // Create visibleProperty instances for Nodes in the view.
    const visibleProperties = new VisibleProperties( model.optic, {
      tandem: options.tandem.createTandem( 'visibleProperties' )
    } );

    // Zoom level for scenes
    const zoomLevelProperty = new NumberProperty( ZOOM_SCALES.indexOf( 1 ), {
      numberType: 'Integer',
      range: new Range( 0, ZOOM_SCALES.length - 1 ),
      tandem: options.tandem.createTandem( 'zoomLevelProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This Property is controlled by the zoom buttons. ' +
                           'It is integer index that tells the sim how to scale the view. ' +
                           'Smaller values are more zoomed out. ' +
                           'See zoomScaleProperty for the actual scale value.'
    } );

    // Scale factor for the current zoom level
    const zoomScaleProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      zoomLevel => ZOOM_SCALES[ zoomLevel ], {
        validValues: ZOOM_SCALES,
        tandem: options.tandem.createTandem( 'zoomScaleProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Scale that is applied to the view. This Property is derived from zoomLevelProperty, ' +
                             ' which is controlled by the zoom buttons.'
      } );

    // Transform applied to tools and labels
    const zoomTransformProperty = new DerivedProperty(
      [ zoomScaleProperty ],
      zoomScale => {
        const scale = NOMINAL_MODEL_TO_VIEW_SCALE * zoomScale;
        return ModelViewTransform2.createOffsetXYScaleMapping( viewOrigin, scale, -scale );
      } );

    // ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied.
    const modelVisibleBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds, zoomTransform ) => zoomTransform.viewToModelBounds( visibleBounds )
    );

    // Portion of the ScreenView's visibleBounds that is dedicated to scenes, in the model coordinate frame,
    // with zoom transform applied. Run with ?debugModelBounds to see this rendered as a red rectangle.
    const sceneBoundsProperty = new DerivedProperty(
      [ modelVisibleBoundsProperty ],
      modelVisibleBounds => {
        const y = GOConstants.MAX_DISTANCE_FROM_OBJECT_TO_OPTICAL_AXIS;
        return new Bounds2( modelVisibleBounds.minX, -y, modelVisibleBounds.maxX, y );
      } );

    const objectDragModeProperty = new StringUnionProperty( options.objectDragMode, {
      validValues: ObjectDragModeValues,
      tandem: providedOptions.tandem.createTandem( 'objectDragModeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'Controls dragging of the optical objects. ' +
                           'This Property is read-only because the sim controls it, based on the type of optical object that is selected.' +
                           'Values are:' +
                           '<ul>' +
                           '<li>freeDragging: objects can be dragged freely</li>' +
                           '<li>horizontalDragging: dragging is constrained to horizontal, parallel to the optical axis</li>' +
                           '</ul>'
    } );

    // Tools (Rulers & Position Markers) ===============================================================================

    const toolsTandem = options.tandem.createTandem( 'tools' );

    const horizontalRulerNode = new GORulerNode( model.horizontalRuler, model.optic.positionProperty,
      zoomTransformProperty, zoomScaleProperty, this.visibleBoundsProperty, {
        tandem: toolsTandem.createTandem( 'horizontalRulerNode' ),
        iconTandemName: 'horizontalRulerIcon'
      } );

    const verticalRulerNode = new GORulerNode( model.verticalRuler, model.optic.positionProperty,
      zoomTransformProperty, zoomScaleProperty, this.visibleBoundsProperty, {
        tandem: toolsTandem.createTandem( 'verticalRulerNode' ),
        iconTandemName: 'verticalRulerIcon'
      } );

    const positionMarker1Node = new PositionMarkerNode( model.positionMarker1, zoomTransformProperty,
      this.visibleBoundsProperty, {
        tandem: toolsTandem.createTandem( 'positionMarker1Node' ),
        iconTandemName: 'positionMarker1Icon'
      } );

    const positionMarker2Node = new PositionMarkerNode( model.positionMarker2, zoomTransformProperty,
      this.visibleBoundsProperty, {
        tandem: toolsTandem.createTandem( 'positionMarker2Node' ),
        iconTandemName: 'positionMarker2Icon'
      } );

    // Toolbox in the top-right corner of the screen
    const toolboxNode = new GOToolboxNode( [ horizontalRulerNode, verticalRulerNode, positionMarker1Node, positionMarker2Node ], {
      tandem: toolsTandem.createTandem( 'toolboxNode' )
    } );

    // Icons in the toolbox can be hidden via iO. So keep the toolbox positioned in the rightTop corner.
    toolboxNode.boundsProperty.link( bounds => {
      toolboxNode.rightTop = erodedLayoutBounds.rightTop;
    } );

    const toolNodes: GOToolNode[] = [ horizontalRulerNode, verticalRulerNode, positionMarker2Node, positionMarker1Node ];

    const toolsLayer = new Node( {
      children: toolNodes
    } );

    // Controls  =======================================================================================================

    const controlsTandem = options.tandem.createTandem( 'controls' );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing the optical object
    const opticalObjectChoiceComboBox = new OpticalObjectChoiceComboBox( model.opticalObjectChoiceProperty, popupsParent, {
      tandem: controlsTandem.createTandem( 'opticalObjectChoiceComboBox' )
    } );

    // Toggle button to switch between 'freeDragging' and 'horizontalDragging' of the optical object
    const objectDragModeToggleButton = new ObjectDragModeToggleButton( objectDragModeProperty, {
      tandem: controlsTandem.createTandem( 'objectDragModeToggleButton' )
    } );

    const objectHBox = new HBox( {
      children: [ opticalObjectChoiceComboBox, objectDragModeToggleButton ],
      spacing: 25,
      align: 'center',
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top
    } );

    // Radio buttons for the surface type of the optic
    const opticSurfaceTypeRadioButtonGroup = new OpticSurfaceTypeRadioButtonGroup( model.optic, {
      isBasicsVersion: options.isBasicsVersion,
      centerX: erodedLayoutBounds.centerX,
      top: erodedLayoutBounds.top,

      // Do not instrument for the Mirror screen in Geometric Optics: Basics, where we have only a flat mirror.
      // See https://github.com/phetsims/geometric-optics/issues/463
      tandem: model.optic.isExclusivelyFlatMirror() ?
              Tandem.OPT_OUT :
              controlsTandem.createTandem( 'opticSurfaceTypeRadioButtonGroup' )
    } );

    // Disable the 'Virtual Image' checkbox for lights, see https://github.com/phetsims/geometric-optics/issues/216
    const virtualImageCheckboxEnabledProperty = new DerivedProperty(
      [ model.opticalObjectChoiceProperty ],
      opticalObjectChoice => ( opticalObjectChoice.type !== 'light' ) );

    // Control panel at the bottom-center of the screen
    const controlPanel = new GOControlPanel( model.optic, model.raysTypeProperty, visibleProperties,
      virtualImageCheckboxEnabledProperty, {
        bottom: erodedLayoutBounds.bottom,
        isBasicsVersion: options.isBasicsVersion,
        tandem: controlsTandem.createTandem( 'controlPanel' )
      } );

    // Zoom buttons
    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: 8,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      mouseAreaXDilation: 2,
      mouseAreaYDilation: 2,
      magnifyingGlassNodeOptions: {
        scale: 0.5
      },
      buttonOptions: {
        xMargin: 5,
        yMargin: 4
      },
      left: erodedLayoutBounds.left,
      top: controlPanel.top,
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      tandem: controlsTandem.createTandem( 'zoomButtonGroup' )
    } );

    // Toggle button
    const lightPropagationToggleButton = new LightPropagationToggleButton( model.lightPropagationEnabledProperty, {
      tandem: controlsTandem.createTandem( 'lightPropagationToggleButton' )
    } );
    lightPropagationToggleButton.centerX = zoomButtonGroup.centerX;
    lightPropagationToggleButton.bottom = erodedLayoutBounds.bottom;

    // Reset All button at right-bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: controlsTandem.createTandem( 'resetAllButton' )
    } );

    // Center the control panel at the bottom of the screen, in the space between the controls that are to the left
    // and right of the control panel. The size of the control panel changes dynamically, based on whether the
    // 'direct' or 'indirect' focal-length model is selected.
    controlPanel.boundsProperty.link( () => {
      controlPanel.centerX = zoomButtonGroup.right + ( resetAllButton.left - zoomButtonGroup.right ) / 2;
      controlPanel.bottom = erodedLayoutBounds.bottom;
    } );

    const controlsLayer = new Node( {
      children: [
        objectHBox,
        opticSurfaceTypeRadioButtonGroup,
        toolboxNode,
        zoomButtonGroup,
        lightPropagationToggleButton,
        controlPanel,
        resetAllButton
      ]
    } );

    // Scenes ==========================================================================================================

    const scenesTandem = options.tandem.createTandem( 'scenes' );

    const sceneNodes: GOSceneNode[] = [];

    const arrowSceneNodeTandem = scenesTandem.createTandem( 'arrowSceneNode' );
    const arrowSceneNode = new ArrowSceneNode( model.arrowScene, visibleProperties, modelViewTransform,
      modelVisibleBoundsProperty, sceneBoundsProperty, model.raysTypeProperty, model.lightPropagationEnabledProperty, {
        createOpticNode: options.createOpticNode,
        objectDragModeProperty: objectDragModeProperty,
        visibleProperty: new DerivedProperty( [ model.opticalObjectChoiceProperty ],
          opticalObjectChoice => ( opticalObjectChoice.type === 'arrow' ), {
            tandem: arrowSceneNodeTandem.createTandem( 'visibleProperty' ),
            phetioValueType: BooleanIO
          } ),
        tandem: arrowSceneNodeTandem
      } );
    sceneNodes.push( arrowSceneNode );

    const frameSceneNodeTandem = scenesTandem.createTandem( 'framedSceneNode' );
    const framedSceneNode = new FramedSceneNode( model.framedScene, visibleProperties, modelViewTransform,
      modelVisibleBoundsProperty, sceneBoundsProperty, model.raysTypeProperty, model.lightPropagationEnabledProperty, {
        createOpticNode: options.createOpticNode,
        objectDragModeProperty: objectDragModeProperty,
        visibleProperty: new DerivedProperty( [ model.opticalObjectChoiceProperty ],
          opticalObjectChoice => ( opticalObjectChoice.type === 'framed' ), {
            tandem: frameSceneNodeTandem.createTandem( 'visibleProperty' ),
            phetioValueType: BooleanIO
          } ),
        tandem: frameSceneNodeTandem
      } );
    sceneNodes.push( framedSceneNode );

    // Note that while the Light scene is specific to the Mirror screen, it was more straightforward to handle it
    // as an optional part of this base class.
    let lightSceneNode: LightSceneNode | null = null;
    if ( model.lightScene ) {

      const lightSceneNodeTandem = scenesTandem.createTandem( 'lightSceneNode' );
      lightSceneNode = new LightSceneNode( model.lightScene, visibleProperties,
        modelViewTransform, modelVisibleBoundsProperty, sceneBoundsProperty, model.raysTypeProperty,
        model.lightPropagationEnabledProperty, {
          createOpticNode: options.createOpticNode,
          objectDragModeProperty: objectDragModeProperty,
          visibleProperty: new DerivedProperty( [ model.opticalObjectChoiceProperty ],
            opticalObjectChoice => ( opticalObjectChoice.type === 'light' ), {
              tandem: lightSceneNodeTandem.createTandem( 'visibleProperty' ),
              phetioValueType: BooleanIO
            } ),
          tandem: lightSceneNodeTandem
        } );
      sceneNodes.push( lightSceneNode );
    }

    // When a sceneNode becomes visible, use the scene's jump points for tools.
    sceneNodes.forEach( sceneNode => {
      sceneNode.visibleProperty.link( visible => {
        if ( visible ) {
          toolNodes.forEach( toolNode => toolNode.setJumpPoints( sceneNode.toolJumpPoints ) );
        }
      } );
    } );

    const scenesLayer = new Node( {
      children: sceneNodes
    } );

    // Show sceneBounds as a red rectangle.
    if ( GOQueryParameters.debugSceneBounds ) {
      const dragBoundsNode = new Rectangle( modelViewTransform.modelToViewBounds( sceneBoundsProperty.value ), {
        stroke: 'red'
      } );
      scenesLayer.addChild( dragBoundsNode );
      sceneBoundsProperty.link( sceneBounds => {
        const viewBounds = modelViewTransform.modelToViewBounds( sceneBounds );
        dragBoundsNode.setRect( viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height );
      } );
    }

    // Scale the scene
    zoomScaleProperty.link( zoomScale => {
      scenesLayer.setScaleMagnitude( zoomScale );
      scenesLayer.translation = viewOrigin;
    } );

    // Labels ==========================================================================================================

    const labelsLayer = new Node( {
      visibleProperty: visibleProperties.labelsVisibleProperty
    } );

    // Labels for things in the 'Arrow' scene
    const arrowLabelsNode = new ArrowLabelsNode( arrowSceneNode,
      zoomTransformProperty, modelVisibleBoundsProperty, {
        isBasicsVersion: options.isBasicsVersion,
        visibleProperty: arrowSceneNode.visibleProperty,
        tandem: arrowSceneNode.tandem.createTandem( 'labels' ), // child of scene
        phetioDocumentation: `Labels for things in ${arrowSceneNode.tandem.name}`
      } );
    labelsLayer.addChild( arrowLabelsNode );

    // Labels for things in the 'Framed Object' scene
    const framedLabelsNode = new FramedLabelsNode( framedSceneNode,
      zoomTransformProperty, modelVisibleBoundsProperty, {
        visibleProperty: framedSceneNode.visibleProperty,
        tandem: framedSceneNode.tandem.createTandem( 'labels' ), // child of scene
        phetioDocumentation: `Labels for things in ${framedSceneNode.tandem.name}`
      } );
    labelsLayer.addChild( framedLabelsNode );

    // Labels for things in the 'Light' scene. Note that while the Light scene is specific to the Mirror screen,
    // it was more straightforward to handle it as an optional part of this base class.
    let lightLabelsNode: Node | null = null;
    if ( model.lightScene && lightSceneNode ) {
      lightLabelsNode = new LightLabelsNode( lightSceneNode,
        zoomTransformProperty, modelVisibleBoundsProperty, {
          isBasicsVersion: options.isBasicsVersion,
          visibleProperty: lightSceneNode.visibleProperty,
          tandem: lightSceneNode.tandem.createTandem( 'labels' ), // child of scene
          phetioDocumentation: `Labels for things in ${lightSceneNode.tandem.name}`
        } );
      labelsLayer.addChild( lightLabelsNode );
    }

    // Layout ==========================================================================================================

    const screenViewRootNode = new Node( {
      children: [
        scenesLayer,
        labelsLayer,
        controlsLayer,
        toolsLayer,
        popupsParent
      ]
    } );
    this.addChild( screenViewRootNode );

    // Listeners =======================================================================================================

    // If light propagation is enabled, changing these Properties causes the light rays to animate.
    Multilink.multilink( [ model.lightPropagationEnabledProperty, model.raysTypeProperty ],
      ( lightPropagationEnabled, raysType ) => {
        if ( lightPropagationEnabled ) {
          model.beginLightRaysAnimation();
        }
      } );

    // Changing these things interrupts interactions
    const interrupt = () => this.interruptSubtreeInput();
    zoomLevelProperty.lazyLink( interrupt );
    model.opticalObjectChoiceProperty.lazyLink( interrupt );

    //==================================================================================================================

    this.resetGOScreenView = (): void => {
      visibleProperties.reset();
      zoomLevelProperty.reset();
      objectDragModeProperty.reset();
      arrowSceneNode.reset();
      framedSceneNode.reset();
      lightSceneNode && lightSceneNode.reset();
    };

    // pdom - traversal order
    screenViewRootNode.pdomOrder = [
      scenesLayer,
      horizontalRulerNode,
      verticalRulerNode,
      positionMarker1Node,
      positionMarker2Node,
      opticalObjectChoiceComboBox,
      objectDragModeToggleButton,
      opticSurfaceTypeRadioButtonGroup,
      toolboxNode,
      zoomButtonGroup,
      lightPropagationToggleButton,
      controlPanel,
      resetAllButton
    ];

    this.objectDragModeProperty = objectDragModeProperty;
    this.objectDragModeToggleButton = objectDragModeToggleButton;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGOScreenView();
  }
}

geometricOptics.register( 'GOScreenView', GOScreenView );