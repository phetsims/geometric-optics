// Copyright 2021-2022, University of Colorado Boulder

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
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import GOQueryParameters from '../GOQueryParameters.js';
import GOModel from '../model/GOModel.js';
import GOControlPanel from './GOControlPanel.js';
import OpticShapeRadioButtonGroup from './OpticShapeRadioButtonGroup.js';
import OpticalObjectChoiceComboBox from './OpticalObjectChoiceComboBox.js';
import LightPropagationToggleButton from './LightPropagationToggleButton.js';
import VisibleProperties from './VisibleProperties.js';
import Lens from '../../lens/model/Lens.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import FramedObjectSceneNode from './FramedObjectSceneNode.js';
import OpticalObjectChoice from '../model/OpticalObjectChoice.js';
import Property from '../../../../axon/js/Property.js';
import { RaysType } from '../model/RaysType.js';
import GORulerNode from './GORulerNode.js';
import RulersToolbox from './RulersToolbox.js';
import FramedObjectSceneLabelsNode from './FramedObjectSceneLabelsNode.js';
import ArrowObjectSceneNode from './ArrowObjectSceneNode.js';
import ArrowObjectSceneLabelsNode from './ArrowObjectSceneLabelsNode.js';
import LightObjectSceneNode from './LightObjectSceneNode.js';
import LightObjectSceneLabelsNode from './LightObjectSceneLabelsNode.js';
import GOSceneNode from './GOSceneNode.js';
import { PickRequired } from '../GOTypes.js';
import optionize from '../../../../phet-core/js/optionize.js';

// Zoom scale factors, in ascending order.
// Careful! If you add values here, you may get undesirable tick intervals on rulers.
const ZOOM_SCALES = [ 0.25, 0.5, 1 ];

// view coordinates per cm when zoom scale is 1
const NOMINAL_MODEL_TO_VIEW_SCALE = 2;

type SelfOptions = {

  isBasicsVersion: boolean,

  // Gets the position of the model origin in view coordinates
  getViewOrigin: ( layoutBounds: Bounds2 ) => Vector2,

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  dragLockedProperty: BooleanProperty
};

type GOScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

class GOScreenView extends ScreenView {

  // Nodes and Tandems needed by subclasses, to add additional Nodes.
  protected readonly screenViewRootNode: Node;
  protected readonly controlsLayer: Node;
  protected readonly opticalObjectChoiceComboBox: Node;
  protected readonly opticShapeRadioButtonGroup: Node;
  protected readonly controlsTandem: Tandem;

  // Resets things that are specific to this class.
  private readonly resetGOScreenView: () => void;

  /**
   * @param model
   * @param providedOptions
   */
  constructor( model: GOModel, providedOptions: GOScreenViewOptions ) {

    const options = optionize<GOScreenViewOptions, SelfOptions, ScreenViewOptions>( {

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
    const visibleProperties = new VisibleProperties( ( model.optic instanceof Lens ), {
      tandem: options.tandem.createTandem( 'visibleProperties' )
    } );

    // Zoom level for scenes
    const zoomLevelProperty = new NumberProperty( ZOOM_SCALES.indexOf( 1 ), {
      numberType: 'Integer',
      range: new Range( 0, ZOOM_SCALES.length - 1 ),
      tandem: options.tandem.createTandem( 'zoomLevelProperty' )
    } );

    // Scale factor for the current zoom level
    const zoomScaleProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      ( zoomLevel: number ) => ZOOM_SCALES[ zoomLevel ]
    );

    // Transform applied to rulers and labels
    const zoomTransformProperty = new DerivedProperty(
      [ zoomScaleProperty ],
      ( zoomScale: number ) => {
        const scale = NOMINAL_MODEL_TO_VIEW_SCALE * zoomScale;
        return ModelViewTransform2.createOffsetXYScaleMapping( viewOrigin, scale, -scale );
      } );

    // ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied.
    const modelVisibleBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => zoomTransform.viewToModelBounds( visibleBounds )
    );

    // Portion of the ScreenView's visibleBounds that is dedicated to scenes, in the model coordinate frame,
    // with zoom transform applied. Run with ?debugModelBounds to see this rendered as a red rectangle.
    const sceneBoundsProperty = new DerivedProperty(
      [ modelVisibleBoundsProperty ],
      ( modelVisibleBounds: Bounds2 ) => {
        const y = GOConstants.MAX_DISTANCE_FROM_OPTICAL_AXIS;
        return new Bounds2( modelVisibleBounds.minX, -y, modelVisibleBounds.maxX, y );
      } );

    // Rulers  =========================================================================================================

    const horizontalRulerNode = new GORulerNode( model.horizontalRuler, model.optic.positionProperty,
      zoomTransformProperty, zoomScaleProperty, this.visibleBoundsProperty, {
        tandem: options.tandem.createTandem( 'horizontalRulerNode' )
      } );

    const verticalRulerNode = new GORulerNode( model.verticalRuler, model.optic.positionProperty,
      zoomTransformProperty, zoomScaleProperty, this.visibleBoundsProperty, {
        tandem: options.tandem.createTandem( 'verticalRulerNode' )
      } );

    // Toolbox in the top-right corner of the screen
    const rulersToolbox = new RulersToolbox( [ horizontalRulerNode, verticalRulerNode ], {
      right: erodedLayoutBounds.right,
      top: erodedLayoutBounds.top,
      tandem: options.tandem.createTandem( 'rulersToolbox' )
    } );

    // Tell the rulers where the toolbox is.
    rulersToolbox.visibleProperty.link( visible => {
      const bounds = visible ? rulersToolbox.bounds : Bounds2.NOTHING;
      horizontalRulerNode.setToolboxBounds( bounds );
      verticalRulerNode.setToolboxBounds( bounds );
    } );

    const rulersLayer = new Node( {
      children: [ horizontalRulerNode, verticalRulerNode ]
    } );

    // Use a scene's hotkey targets for the rulers.
    const setRulerHotkeyTargets = ( sceneNode: GOSceneNode ) => {
      horizontalRulerNode.setHotkeyTargets( sceneNode.horizontalRulerHotkeyTargets );
      verticalRulerNode.setHotkeyTargets( sceneNode.verticalRulerHotkeyTargets );
    };

    // Controls  =======================================================================================================

    this.controlsTandem = options.tandem.createTandem( 'controls' );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing the optical object
    const opticalObjectChoiceComboBox = new OpticalObjectChoiceComboBox( model.opticalObjectChoiceProperty, popupsParent, {
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top,
      tandem: this.controlsTandem.createTandem( 'opticalObjectChoiceComboBox' )
    } );

    // Radio buttons for the shape of the optic
    const opticShapeRadioButtonGroup = new OpticShapeRadioButtonGroup( model.optic, {
      centerX: erodedLayoutBounds.centerX,
      top: erodedLayoutBounds.top,
      tandem: this.controlsTandem.createTandem( 'opticShapeRadioButtonGroup' )
    } );

    // Disable the 'Virtual Image' checkbox for lights, see https://github.com/phetsims/geometric-optics/issues/216
    const virtualImageCheckboxEnabledProperty = new DerivedProperty(
      [ model.opticalObjectChoiceProperty ],
      ( opticalObjectChoice: OpticalObjectChoice ) => !OpticalObjectChoice.isLight( opticalObjectChoice ) );

    // Control panel at the bottom-center of the screen
    const controlPanel = new GOControlPanel( model.optic, model.raysTypeProperty, visibleProperties,
      virtualImageCheckboxEnabledProperty, {
        isBasicsVersion: options.isBasicsVersion,
        tandem: this.controlsTandem.createTandem( 'controlPanel' )
      } );
    controlPanel.boundsProperty.link( () => {
      controlPanel.centerBottom = erodedLayoutBounds.centerBottom;
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
      centerX: this.layoutBounds.left + ( controlPanel.left - this.layoutBounds.left ) / 2,
      top: controlPanel.top,
      tandem: this.controlsTandem.createTandem( 'zoomButtonGroup' )
    } );

    // Reset All button at right-bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: this.controlsTandem.createTandem( 'resetAllButton' )
    } );

    // Toggle button above the Reset All button
    const lightPropagationToggleButton = new LightPropagationToggleButton( model.lightPropagationEnabledProperty, {
      tandem: this.controlsTandem.createTandem( 'lightPropagationToggleButton' )
    } );
    lightPropagationToggleButton.centerX = this.layoutBounds.left + ( controlPanel.left - this.layoutBounds.left ) / 2;
    lightPropagationToggleButton.bottom = controlPanel.bottom;

    const controlsLayer = new Node( {
      children: [
        opticShapeRadioButtonGroup,
        controlPanel,
        lightPropagationToggleButton,
        resetAllButton,
        rulersToolbox,
        zoomButtonGroup,
        opticalObjectChoiceComboBox
      ]
    } );

    // Scenes ==========================================================================================================

    const scenesTandem = options.tandem.createTandem( 'scenes' );

    const scenesLayer = new Node();

    const arrowObjectSceneNode = new ArrowObjectSceneNode( model.arrowObjectScene, visibleProperties, modelViewTransform,
      modelVisibleBoundsProperty, sceneBoundsProperty, model.raysTypeProperty, model.lightPropagationEnabledProperty, {
        createOpticNode: options.createOpticNode,
        dragLockedProperty: options.dragLockedProperty,
        visibleProperty: new DerivedProperty( [ model.opticalObjectChoiceProperty ],
          ( opticalObjectChoice: OpticalObjectChoice ) => OpticalObjectChoice.isArrowObject( opticalObjectChoice ) ),
        tandem: scenesTandem.createTandem( 'arrowObjectSceneNode' )
      } );
    scenesLayer.addChild( arrowObjectSceneNode );

    arrowObjectSceneNode.visibleProperty.link( visible => {
      if ( visible ) {
        setRulerHotkeyTargets( arrowObjectSceneNode );
      }
    } );

    const framedObjectSceneNode = new FramedObjectSceneNode( model.framedObjectScene, visibleProperties, modelViewTransform,
      modelVisibleBoundsProperty, sceneBoundsProperty, model.raysTypeProperty, model.lightPropagationEnabledProperty, {
        createOpticNode: options.createOpticNode,
        dragLockedProperty: options.dragLockedProperty,
        visibleProperty: new DerivedProperty( [ model.opticalObjectChoiceProperty ],
          ( opticalObjectChoice: OpticalObjectChoice ) => OpticalObjectChoice.isFramedObject( opticalObjectChoice ) ),
        tandem: scenesTandem.createTandem( 'framedObjectSceneNode' )
      } );
    scenesLayer.addChild( framedObjectSceneNode );

    framedObjectSceneNode.visibleProperty.link( visible => {
      if ( visible ) {
        setRulerHotkeyTargets( framedObjectSceneNode );
      }
    } );

    let lightObjectSceneNode: LightObjectSceneNode | null = null;
    if ( model.lightObjectScene ) {

      lightObjectSceneNode = new LightObjectSceneNode( model.lightObjectScene, visibleProperties,
        modelViewTransform, modelVisibleBoundsProperty, sceneBoundsProperty, model.raysTypeProperty,
        model.lightPropagationEnabledProperty, {
          createOpticNode: options.createOpticNode,
          dragLockedProperty: options.dragLockedProperty,
          visibleProperty: new DerivedProperty( [ model.opticalObjectChoiceProperty ],
            ( opticalObjectChoice: OpticalObjectChoice ) => OpticalObjectChoice.isLight( opticalObjectChoice ) ),
          tandem: scenesTandem.createTandem( 'lightObjectSceneNode' )
        } );
      scenesLayer.addChild( lightObjectSceneNode );

      lightObjectSceneNode.visibleProperty.link( visible => {
        if ( visible ) {
          setRulerHotkeyTargets( lightObjectSceneNode! );
        }
      } );
    }

    // Show the model bounds as a green rectangle.
    if ( GOQueryParameters.debugModelBounds ) {
      const dragBoundsNode = new Rectangle( modelViewTransform.modelToViewBounds( sceneBoundsProperty.value ), {
        stroke: 'red'
      } );
      scenesLayer.addChild( dragBoundsNode );
      sceneBoundsProperty.link( sceneBounds => {
        const viewBounds = modelViewTransform.modelToViewBounds( sceneBounds );
        dragBoundsNode.setRect( viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height );
      } );
    }

    zoomScaleProperty.link( zoomScale => {
      scenesLayer.setScaleMagnitude( zoomScale );
      scenesLayer.translation = viewOrigin;
    } );

    // Labels ==========================================================================================================

    const labelsLayer = new Node();

    const arrowObjectSceneLabelsNode = new ArrowObjectSceneLabelsNode( model.arrowObjectScene, visibleProperties,
      zoomTransformProperty, modelVisibleBoundsProperty, model.lightPropagationEnabledProperty, {
        isBasicsVersion: options.isBasicsVersion,
        visibleProperty: DerivedProperty.and( [ visibleProperties.labelsVisibleProperty,
          arrowObjectSceneNode.visibleProperty ] )
      } );
    labelsLayer.addChild( arrowObjectSceneLabelsNode );

    const framedObjectSceneLabelsNode = new FramedObjectSceneLabelsNode( model.framedObjectScene, visibleProperties,
      zoomTransformProperty, modelVisibleBoundsProperty, model.lightPropagationEnabledProperty, {
        visibleProperty: DerivedProperty.and( [ visibleProperties.labelsVisibleProperty,
          framedObjectSceneNode.visibleProperty ] )
      } );
    labelsLayer.addChild( framedObjectSceneLabelsNode );

    let lightObjectSceneLabelsNode: Node | null = null;
    if ( model.lightObjectScene && lightObjectSceneNode ) {
      lightObjectSceneLabelsNode = new LightObjectSceneLabelsNode( model.lightObjectScene, visibleProperties,
        zoomTransformProperty, modelVisibleBoundsProperty, {
          isBasicsVersion: options.isBasicsVersion,
          visibleProperty: DerivedProperty.and( [ visibleProperties.labelsVisibleProperty, lightObjectSceneNode.visibleProperty ] )
        } );
      labelsLayer.addChild( lightObjectSceneLabelsNode );
    }

    // Layout ==========================================================================================================

    const screenViewRootNode = new Node( {
      children: [
        scenesLayer,
        labelsLayer,
        controlsLayer,
        rulersLayer,
        popupsParent
      ]
    } );
    this.addChild( screenViewRootNode );

    // Listeners =======================================================================================================

    // Changing any of these Properties causes the light rays to animate.
    Property.multilink( [ model.raysTypeProperty, model.lightPropagationEnabledProperty ],
      ( raysType: RaysType, lightPropagationEnabled: boolean ) => model.resetLightRays() );

    // Changing these things interrupts interactions
    const interrupt = () => this.interruptSubtreeInput();
    zoomLevelProperty.lazyLink( interrupt );
    model.opticalObjectChoiceProperty.lazyLink( interrupt );

    //==================================================================================================================

    this.resetGOScreenView = (): void => {
      visibleProperties.reset();
      zoomLevelProperty.reset();
      arrowObjectSceneNode.reset();
      framedObjectSceneNode.reset();
      lightObjectSceneNode && lightObjectSceneNode.reset();
    };

    // pdom -traversal order
    screenViewRootNode.pdomOrder = [
      scenesLayer,
      opticalObjectChoiceComboBox,
      opticShapeRadioButtonGroup,
      rulersToolbox,
      horizontalRulerNode,
      verticalRulerNode,
      zoomButtonGroup,
      lightPropagationToggleButton,
      controlPanel,
      resetAllButton
    ];

    this.screenViewRootNode = screenViewRootNode;
    this.controlsLayer = controlsLayer;
    this.opticalObjectChoiceComboBox = opticalObjectChoiceComboBox;
    this.opticShapeRadioButtonGroup = opticShapeRadioButtonGroup;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGOScreenView();
  }
}

geometricOptics.register( 'GOScreenView', GOScreenView );
export default GOScreenView;
export type { GOScreenViewOptions };