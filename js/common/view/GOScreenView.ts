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
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
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
import ShowHideToggleButton from './ShowHideToggleButton.js';
import VisibleProperties from './VisibleProperties.js';
import Lens from '../../lens/model/Lens.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Optic from '../model/Optic.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import FramedObjectSceneNode from './FramedObjectSceneNode.js';
import OpticalObjectChoice from '../model/OpticalObjectChoice.js';
import Property from '../../../../axon/js/Property.js';
import { RaysType } from '../model/RaysType.js';
import GORulerNode from './GORulerNode.js';
import RulersToolbox from './RulersToolbox.js';
import FramedObjectSceneLabelsNode from './FramedObjectSceneLabelsNode.js';

// Zoom scale factors, in ascending order.
// Careful! If you add values here, you may get undesirable tick intervals on rulers.
const ZOOM_SCALES = [ 0.25, 0.5, 1 ];

// view coordinates per cm when zoom scale is 1
const NOMINAL_MODEL_TO_VIEW_SCALE = 2;

type GeometricOpticsScreenViewOptions = {

  // Gets the position of the model origin in view coordinates
  getViewOrigin: ( layoutBounds: Bounds2 ) => Vector2,

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  // Hotkeys to move a ruler to the optic
  hotkeysMoveRulerToOptic: string[],

  dragLockedProperty: BooleanProperty,

  // phet-io
  tandem: Tandem
};

class GOScreenView extends ScreenView {

  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly visibleProperties: VisibleProperties;
  protected readonly modelBoundsProperty: IReadOnlyProperty<Bounds2>;
  protected readonly modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>;
  protected readonly zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>;
  protected readonly screenViewRootNode: Node;
  protected readonly experimentAreaNode: Node;
  protected readonly scenesNode: Node;
  protected readonly labelsLayer: Node;
  protected readonly controlsLayer: Node;
  protected readonly representationComboBox: Node;
  protected readonly opticShapeRadioButtonGroup: Node;
  protected readonly zoomButtonGroup: Node;
  protected readonly scenesTandem: Tandem;
  protected readonly controlsTandem: Tandem;
  protected readonly horizontalRulerNode: GORulerNode;
  protected readonly verticalRulerNode: GORulerNode;

  private readonly model: GOModel;
  private readonly resetGOScreenView: () => void;

  /**
   * @param model
   * @param providedOptions
   */
  constructor( model: GOModel, providedOptions: GeometricOpticsScreenViewOptions ) {

    const options = merge( {

      // Workaround for things shifting around while dragging
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/geometric-optics/issues/213
      preventFit: true
    }, providedOptions );

    super( options );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY(
      GOConstants.SCREEN_VIEW_X_MARGIN, GOConstants.SCREEN_VIEW_Y_MARGIN );

    // Create a Y inverted modelViewTransform with isometric scaling along x and y axes.
    // In the model coordinate frame, +x is right, +y is up.
    // This transform is used for things that children of experimentAreaNode, and are subject to zooming.
    const modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( Vector2.ZERO,
      NOMINAL_MODEL_TO_VIEW_SCALE, -NOMINAL_MODEL_TO_VIEW_SCALE );

    // Properties  ====================================================================================================

    // Create visibleProperty instances for Nodes in the view.
    const visibleProperties = new VisibleProperties( ( model.optic instanceof Lens ), {
      tandem: options.tandem.createTandem( 'visibleProperties' )
    } );

    // Controls zoom in experiment area
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

    const viewOrigin = options.getViewOrigin( this.layoutBounds );

    // Transform applied to rulers and labels
    const zoomTransformProperty = new DerivedProperty(
      [ zoomScaleProperty ],
      ( zoomScale: number ) => {
        const scale = NOMINAL_MODEL_TO_VIEW_SCALE * zoomScale;
        return ModelViewTransform2.createOffsetXYScaleMapping( viewOrigin, scale, -scale );
      } );

    const horizontalRulerNode = new GORulerNode( model.horizontalRuler, zoomTransformProperty, zoomScaleProperty,
      this.visibleBoundsProperty, {
        hotkeysMoveRulerToOptic: options.hotkeysMoveRulerToOptic,
        tandem: options.tandem.createTandem( 'horizontalRulerNode' )
      } );

    const verticalRulerNode = new GORulerNode( model.verticalRuler, zoomTransformProperty, zoomScaleProperty,
      this.visibleBoundsProperty, {
        hotkeysMoveRulerToOptic: options.hotkeysMoveRulerToOptic,
        tandem: options.tandem.createTandem( 'verticalRulerNode' )
      } );

    this.controlsTandem = options.tandem.createTandem( 'controls' );

    // Disable the 'Virtual Image' checkbox for light source, see https://github.com/phetsims/geometric-optics/issues/216
    const virtualImageCheckboxEnabledProperty = new DerivedProperty(
      [ model.opticalObjectChoiceProperty ],
      ( opticalObjectChoice: OpticalObjectChoice ) => !OpticalObjectChoice.isLightSource( opticalObjectChoice ) );

    // Control panel at the bottom-center of the screen
    const controlPanel = new GOControlPanel( model.optic, model.raysTypeProperty, visibleProperties,
      virtualImageCheckboxEnabledProperty, {
        tandem: this.controlsTandem.createTandem( 'controlPanel' )
      } );
    controlPanel.boundsProperty.link( () => {
      controlPanel.centerBottom = erodedLayoutBounds.centerBottom;
    } );

    // Toolbox in the top-right corner of the screen
    const rulersToolbox = new RulersToolbox( [ horizontalRulerNode, verticalRulerNode ], {
      rightTop: erodedLayoutBounds.rightTop,
      tandem: options.tandem.createTandem( 'rulersToolbox' )
    } );

    // Tell the rulers where the toolbox is.
    rulersToolbox.visibleProperty.link( visible => {
      const bounds = visible ? rulersToolbox.bounds : Bounds2.NOTHING;
      horizontalRulerNode.setToolboxBounds( bounds );
      verticalRulerNode.setToolboxBounds( bounds );
    } );

    // Radio buttons for the shape of the optic
    const opticShapeRadioButtonGroup = new OpticShapeRadioButtonGroup( model.optic, {
      centerTop: erodedLayoutBounds.centerTop,
      tandem: this.controlsTandem.createTandem( 'opticShapeRadioButtonGroup' )
    } );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing the optical object
    const representationComboBox = new OpticalObjectChoiceComboBox( model.opticalObjectChoiceProperty, popupsParent, {
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top,
      tandem: this.controlsTandem.createTandem( 'representationComboBox' )
    } );

    // Zoom buttons
    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      orientation: 'vertical',
      spacing: 8,
      magnifyingGlassNodeOptions: {
        scale: 0.5
      },
      buttonOptions: {
        xMargin: 5,
        yMargin: 4
      },
      right: erodedLayoutBounds.left + ( controlPanel.left - erodedLayoutBounds.left ) / 2,
      centerY: controlPanel.centerY,
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

    // Show/hide toggle button above the Reset All button
    const showHideToggleButton = new ShowHideToggleButton( visibleProperties.raysAndImagesVisibleProperty, {
      tandem: this.controlsTandem.createTandem( 'showHideToggleButton' )
    } );
    showHideToggleButton.centerX = resetAllButton.centerX;
    showHideToggleButton.top = controlPanel.top;

    // ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied.
    const modelVisibleBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => zoomTransform.viewToModelBounds( visibleBounds )
    );

    // Portion of the ScreenView's visibleBounds where things can be dragged, in the model coordinate frame,
    // with zoom transform applied. See https://github.com/phetsims/geometric-optics/issues/204 and
    // https://github.com/phetsims/geometric-optics/issues/289.
    // Run with ?debugModelBounds to see this rendered as a rectangle.
    const modelBoundsProperty = new DerivedProperty(
      [ modelVisibleBoundsProperty ],
      ( modelVisibleBounds: Bounds2 ) => {
        const y = model.maxDistanceFromOpticalAxis;
        return new Bounds2( modelVisibleBounds.minX, -y, modelVisibleBounds.maxX, y );
      } );

    this.scenesTandem = options.tandem.createTandem( 'scenes' );

    const framedObjectSceneNode = new FramedObjectSceneNode( model.framedObjectScene, visibleProperties, modelViewTransform,
      modelVisibleBoundsProperty, modelBoundsProperty, model.raysTypeProperty, {
        createOpticNode: options.createOpticNode,
        dragLockedProperty: options.dragLockedProperty,
        tandem: this.scenesTandem.createTandem( 'framedObjectSceneNode' )
      } );

    const scenesNode = new Node( {
      children: [ framedObjectSceneNode ]
    } );

    //TODO is experimentAreaNode still needed, or does scenesNode fill that role?
    // Layer for all the Nodes within the "experiment area".
    // The experiment area is subject to zoom in/out, so include add all Nodes that need to be zoomed.
    const experimentAreaNode = new Node( {
      children: [ scenesNode ]
    } );

    zoomScaleProperty.link( zoomScale => {
      experimentAreaNode.setScaleMagnitude( zoomScale );
      experimentAreaNode.translation = viewOrigin;
    } );

    // Changing any of these Properties causes the light rays to animate.
    Property.multilink(
      [ model.raysTypeProperty, visibleProperties.raysAndImagesVisibleProperty ],
      ( raysType: RaysType, raysAndImagesVisible: boolean ) =>
        model.framedObjectScene.lightRaysAnimationTimeProperty.reset() );

    // Changing these things interrupts interactions
    const interrupt = () => this.interruptSubtreeInput();
    zoomLevelProperty.lazyLink( interrupt );
    model.opticalObjectChoiceProperty.lazyLink( interrupt );

    // Debugging ================================================================================================

    // Show the model bounds as a green rectangle.
    if ( GOQueryParameters.debugModelBounds ) {
      const dragBoundsNode = new Rectangle( modelViewTransform.modelToViewBounds( modelBoundsProperty.value ), {
        stroke: 'red'
      } );
      experimentAreaNode.addChild( dragBoundsNode );
      modelBoundsProperty.link( modelBounds => {
        const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
        dragBoundsNode.setRect( viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height );
      } );
    }

    // Layout ================================================================================================

    const framedObjectSceneLabelsNode = new FramedObjectSceneLabelsNode( model.framedObjectScene, visibleProperties,
      zoomTransformProperty, modelVisibleBoundsProperty, {
        visibleProperty: DerivedProperty.and( [ visibleProperties.labelsVisibleProperty,
          framedObjectSceneNode.visibleProperty ] )
      } );

    const controlsLayer = new Node( {
      children: [
        opticShapeRadioButtonGroup,
        controlPanel,
        showHideToggleButton,
        resetAllButton,
        rulersToolbox,
        zoomButtonGroup,
        representationComboBox
      ]
    } );

    const rulersLayer = new Node( {
      children: [ horizontalRulerNode, verticalRulerNode ]
    } );

    const labelsLayer = new Node( {
      children: [ framedObjectSceneLabelsNode ]
    } );

    const screenViewRootNode = new Node( {
      children: [
        experimentAreaNode,
        labelsLayer,
        controlsLayer,
        rulersLayer,
        popupsParent
      ]
    } );
    this.addChild( screenViewRootNode );

    model.opticalObjectChoiceProperty.link( opticalObjectChoice => {
      framedObjectSceneNode.visible = ( OpticalObjectChoice.isFramedObject( opticalObjectChoice ) );
      if ( framedObjectSceneNode.visible ) {
        horizontalRulerNode.setHotkeysData( framedObjectSceneNode.rulerHotkeysData );
        verticalRulerNode.setHotkeysData( framedObjectSceneNode.rulerHotkeysData );
      }
    } );

    this.resetGOScreenView = (): void => {
      visibleProperties.reset();
      zoomLevelProperty.reset();
      framedObjectSceneNode.reset();
    };

    // pdom -traversal order
    screenViewRootNode.pdomOrder = [
      representationComboBox,
      opticShapeRadioButtonGroup,
      rulersToolbox,
      horizontalRulerNode,
      verticalRulerNode,
      scenesNode,
      zoomButtonGroup,
      controlPanel,
      showHideToggleButton,
      resetAllButton
    ];

    this.model = model;
    this.modelViewTransform = modelViewTransform;
    this.visibleProperties = visibleProperties;
    this.modelBoundsProperty = modelBoundsProperty;
    this.modelVisibleBoundsProperty = modelVisibleBoundsProperty;
    this.zoomTransformProperty = zoomTransformProperty;
    this.screenViewRootNode = screenViewRootNode;
    this.experimentAreaNode = experimentAreaNode;
    this.scenesNode = scenesNode;
    this.labelsLayer = labelsLayer;
    this.controlsLayer = controlsLayer;
    this.representationComboBox = representationComboBox;
    this.opticShapeRadioButtonGroup = opticShapeRadioButtonGroup;
    this.zoomButtonGroup = zoomButtonGroup;
    this.horizontalRulerNode = horizontalRulerNode;
    this.verticalRulerNode = verticalRulerNode;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGOScreenView();
  }

  //TODO stepping model should be done in model.step
  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.visibleProperties.raysAndImagesVisibleProperty.value ) {
      this.model.stepLightRays( dt );
    }
  }
}

geometricOptics.register( 'GOScreenView', GOScreenView );
export default GOScreenView;
export type { GeometricOpticsScreenViewOptions };