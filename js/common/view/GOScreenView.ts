// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOScreenView is the common ScreenView for this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
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
import GOColors from '../GOColors.js';
import GOConstants from '../GOConstants.js';
import GOQueryParameters from '../GOQueryParameters.js';
import GOModel from '../model/GOModel.js';
import DebugPointNode from './DebugPointNode.js';
import FocalPointNode from './FocalPointNode.js';
import GOControlPanel from './GOControlPanel.js';
import LabelsNode from './LabelsNode.js';
import LightRaysNode from './LightRaysNode.js';
import OpticalAxisNode from './OpticalAxisNode.js';
import OpticShapeRadioButtonGroup from './OpticShapeRadioButtonGroup.js';
import OpticVerticalAxisNode from './OpticVerticalAxisNode.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import RulersToolbox from './RulersToolbox.js';
import SecondPointNode from './SecondPointNode.js';
import ShowHideToggleButton from './ShowHideToggleButton.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetNode from './TargetNode.js';
import VisibleProperties from './VisibleProperties.js';
import RaysType from '../model/RaysType.js';
import Lens from '../../lens/model/Lens.js';
import GORulerNode from './GORulerNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Optic from '../model/Optic.js';
import TwoFPointNode from './TwoFPointNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import OpticalAxisForegroundNode from './OpticalAxisForegroundNode.js';
import LightRaysForegroundNode from './LightRaysForegroundNode.js';

// Zoom scale factors, in ascending order.
// Careful! If you add values here, you may get undesirable tick intervals on rulers.
const ZOOM_SCALES = [ 0.25, 0.5, 1 ];

// view coordinates per cm when zoom scale is 1
const NOMINAL_MODEL_TO_VIEW_SCALE = 2;

type GeometricOpticsScreenViewOptions = {

  // Gets the position of the model origin in view coordinates
  getViewOrigin: ( layoutBounds: Bounds2 ) => Vector2,

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

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
  protected readonly screenViewRootNode: Node;
  protected readonly experimentAreaNode: Node;
  protected readonly additionalNodesParent: Node;
  protected readonly controlsLayer: Node;
  protected readonly representationComboBox: Node;
  protected readonly surfaceTypeRadioButtonGroup: Node;
  protected readonly zoomButtonGroup: Node;

  private readonly model: GOModel;
  private readonly resetGeometricScreenView: () => void;

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

    const targetNode = new TargetNode( model.representationProperty, model.firstTarget, model.optic,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.rayTracingVisibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'targetNode' )
      } );

    const horizontalRulerNode = new GORulerNode( model.horizontalRuler, zoomTransformProperty, zoomScaleProperty,
      this.visibleBoundsProperty, model.optic.positionProperty, model.sourceObject.positionProperty,
      model.secondPoint.positionProperty, model.secondPoint.lightSourcePositionProperty,
      visibleProperties.secondPointVisibleProperty, model.firstTarget.positionProperty,
      targetNode.visibleProperty, model.representationProperty, {
        hotkeysMoveRulerToOptic: options.hotkeysMoveRulerToOptic,
        tandem: options.tandem.createTandem( 'horizontalRulerNode' )
      } );

    const verticalRulerNode = new GORulerNode( model.verticalRuler, zoomTransformProperty, zoomScaleProperty,
      this.visibleBoundsProperty, model.optic.positionProperty, model.sourceObject.positionProperty,
      model.secondPoint.positionProperty, model.secondPoint.lightSourcePositionProperty,
      visibleProperties.secondPointVisibleProperty, model.firstTarget.positionProperty,
      targetNode.visibleProperty, model.representationProperty, {
        hotkeysMoveRulerToOptic: options.hotkeysMoveRulerToOptic,
        tandem: options.tandem.createTandem( 'verticalRulerNode' )
      } );

    const labelsNode = new LabelsNode( model, visibleProperties, zoomTransformProperty );

    // Control panel at the bottom-center of the screen
    const controlPanel = new GOControlPanel( model.representationProperty, model.optic,
      model.raysTypeProperty, visibleProperties, {
        tandem: options.tandem.createTandem( 'controlPanel' )
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
    const surfaceTypeRadioButtonGroup = new OpticShapeRadioButtonGroup( model.optic, {
      centerTop: erodedLayoutBounds.centerTop,
      tandem: options.tandem.createTandem( 'surfaceTypeRadioButtonGroup' )
    } );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing object representation
    const representationComboBox = new RepresentationComboBox( model.representationProperty, popupsParent, {
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top,
      tandem: options.tandem.createTandem( 'representationComboBox' )
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
      tandem: options.tandem.createTandem( 'zoomButtonGroup' )
    } );

    // Reset All button at right-bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Show/hide toggle button above the Reset All button
    const showHideToggleButton = new ShowHideToggleButton( visibleProperties.rayTracingVisibleProperty, {
      tandem: options.tandem.createTandem( 'showHideToggleButton' )
    } );
    showHideToggleButton.centerX = resetAllButton.centerX;
    showHideToggleButton.top = controlPanel.top;

    // ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied.
    const modelVisibleBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) =>
        zoomTransform.viewToModelBounds( visibleBounds )
    );
    
    // Portion of the ScreenView's visibleBounds where things can be dragged, in the model coordinate frame,
    // with zoom transform applied. See https://github.com/phetsims/geometric-optics/issues/204
    const modelBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        const viewBounds = new Bounds2( visibleBounds.left, surfaceTypeRadioButtonGroup.bottom,
          visibleBounds.right, controlPanel.top - 10 );
        return zoomTransform.viewToModelBounds( viewBounds );
      } );

    // the source object or first light source
    const sourceObjectNode = new SourceObjectNode( model.representationProperty, model.sourceObject,
      modelBoundsProperty, model.optic.positionProperty, modelViewTransform, options.dragLockedProperty, {
        tandem: options.tandem.createTandem( 'sourceObjectNode' )
      } );

    // the second point or second light source
    const secondPointNode = new SecondPointNode( model.representationProperty, model.secondPoint,
      sourceObjectNode.dragBoundsProperty, modelViewTransform, options.dragLockedProperty, {
        tandem: options.tandem.createTandem( 'secondPointNode' ),
        visibleProperty: visibleProperties.secondPointVisibleProperty
      } );

    const opticNode = options.createOpticNode( model.optic, modelBoundsProperty, modelViewTransform, options.tandem );

    // The complete optical axis, to be put in the background
    const opticalAxisNode = new OpticalAxisNode(
      model.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform, {
        visibleProperty: model.optic.opticalAxisVisibleProperty
      } );

    // The parts of the optical axis that appear to be in front of Nodes that have 3D perspective.
    const opticalAxisForegroundNode = new OpticalAxisForegroundNode(
      model.optic.positionProperty,
      modelVisibleBoundsProperty,
      modelViewTransform,
      model.lightRays1.raysProcessedEmitter,
      model.representationProperty,
      model.sourceObject.positionProperty,
      sourceObjectNode,
      model.firstTarget.positionProperty,
      targetNode,
      model.projectionScreen, {
        visibleProperty: model.optic.opticalAxisVisibleProperty
      } );

    const opticVerticalAxisNode = new OpticVerticalAxisNode( model.optic, model.raysTypeProperty,
      modelVisibleBoundsProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'opticVerticalAxisNode' )
      } );

    // focal points (F)
    const focalPointsNode = new Node( {
      children: [
        new FocalPointNode( model.optic.leftFocalPointProperty, modelViewTransform ),
        new FocalPointNode( model.optic.rightFocalPointProperty, modelViewTransform )
      ],
      visibleProperty: visibleProperties.focalPointsVisibleProperty,
      tandem: options.tandem.createTandem( 'focalPointsNode' )
    } );

    // 2F points
    const twoFPointsNode = new Node( {
      children: [
        new TwoFPointNode( model.optic.left2FProperty, modelViewTransform ),
        new TwoFPointNode( model.optic.right2FProperty, modelViewTransform )
      ],
      visibleProperty: visibleProperties.twoFPointsVisibleProperty,
      tandem: options.tandem.createTandem( 'twoFPointsNode' )
    } );

    // create the light rays associated with the source object and first light source
    const lightRays1Options = {
      realRaysStroke: GOColors.rays1StrokeProperty,
      virtualRaysStroke: GOColors.rays1StrokeProperty
    };
    const lightRays1Node = new LightRaysNode( model.lightRays1, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, lightRays1Options );
    const lightRays1ForegroundNode = new LightRaysForegroundNode( model.lightRays1, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, modelVisibleBoundsProperty,
      model.optic.positionProperty, model.firstTarget.positionProperty, model.firstTarget.isVirtualProperty, lightRays1Options );

    // create the light rays associated with the second point and second light source
    const lightRays2Options = {
      realRaysStroke: GOColors.rays2StrokeProperty,
      virtualRaysStroke: GOColors.rays2StrokeProperty,
      visibleProperty: visibleProperties.secondPointVisibleProperty
    };
    const lightRays2Node = new LightRaysNode( model.lightRays2, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, lightRays2Options );
    const lightRays2ForegroundNode = new LightRaysForegroundNode( model.lightRays2, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, modelVisibleBoundsProperty,
      model.optic.positionProperty, model.firstTarget.positionProperty, model.firstTarget.isVirtualProperty, lightRays2Options );

    //TODO this is a hack to allow LensScreenView to add the projection screen etc. in the correct layering order
    const additionalNodesParent = new Node();

    // Layer for all the Nodes within the "experiment area".
    // The experiment area is subject to zoom in/out, so include add all Nodes that need to be zoomed.
    const experimentAreaNode = new Node( {
      children: [
        opticalAxisNode,
        sourceObjectNode,
        lightRays1Node,
        lightRays2Node,
        targetNode,
        additionalNodesParent,
        opticalAxisForegroundNode,
        opticNode,
        opticVerticalAxisNode,
        focalPointsNode,
        twoFPointsNode,
        lightRays1ForegroundNode,
        lightRays2ForegroundNode,
        secondPointNode
      ]
    } );

    zoomScaleProperty.link( zoomScale => {
      experimentAreaNode.setScaleMagnitude( zoomScale );
      experimentAreaNode.translation = viewOrigin;
    } );

    Property.multilink(
      [ model.raysTypeProperty, visibleProperties.rayTracingVisibleProperty ],
      ( raysType: RaysType, rayTracingVisible: boolean ) => {
        if ( raysType === 'none' ) {
          model.firstTarget.visibleProperty.value = rayTracingVisible;
          model.secondTarget.visibleProperty.value = rayTracingVisible;
        }
        else {
          if ( !rayTracingVisible ) {
            model.firstTarget.visibleProperty.value = false;
            model.secondTarget.visibleProperty.value = false;
            model.lightRaysTimeProperty.reset();
          }
        }
      } );

    // Changing these things interrupts interactions
    const interrupt = () => this.interruptSubtreeInput();
    zoomLevelProperty.lazyLink( interrupt );
    model.representationProperty.lazyLink( interrupt );

    // Debugging ================================================================================================

    // Add points at the origins of things that have a position.
    //TODO move these into the Nodes, ala LensNode
    if ( GOQueryParameters.debugOrigins ) {
      experimentAreaNode.addChild( new DebugPointNode( model.sourceObject.positionProperty, modelViewTransform ) );
      experimentAreaNode.addChild( new DebugPointNode( model.secondPoint.lightSourcePositionProperty, modelViewTransform ) );
      experimentAreaNode.addChild( new DebugPointNode( model.firstTarget.positionProperty, modelViewTransform ) );
    }

    // Show the model bounds as a green rectangle.
    if ( GOQueryParameters.debugModelBounds ) {
      const dragBoundsNode = new Rectangle( modelViewTransform.modelToViewBounds( modelBoundsProperty.value ), {
        stroke: 'green',
        lineWidth: 2
      } );
      experimentAreaNode.addChild( dragBoundsNode );
      modelBoundsProperty.link( modelBounds => {
        const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
        dragBoundsNode.setRect( viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height );
      } );
    }

    // Layout ================================================================================================

    const controlsLayer = new Node( {
      children: [
        surfaceTypeRadioButtonGroup,
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

    const screenViewRootNode = new Node( {
      children: [
        experimentAreaNode,
        labelsNode,
        controlsLayer,
        rulersLayer,
        popupsParent
      ]
    } );
    this.addChild( screenViewRootNode );

    this.resetGeometricScreenView = (): void => {
      visibleProperties.reset();
      zoomLevelProperty.reset();
      sourceObjectNode.reset();
      secondPointNode.reset();
    };

    // pdom -traversal order
    //TODO https://github.com/phetsims/geometric-optics/issues/235 add second point, light sources
    screenViewRootNode.pdomOrder = [
      representationComboBox,
      surfaceTypeRadioButtonGroup,
      rulersToolbox,
      horizontalRulerNode,
      verticalRulerNode,
      sourceObjectNode,
      zoomButtonGroup,
      controlPanel,
      showHideToggleButton,
      resetAllButton
    ];

    this.model = model;
    this.modelViewTransform = modelViewTransform;
    this.visibleProperties = visibleProperties;
    this.modelBoundsProperty = modelBoundsProperty;
    this.screenViewRootNode = screenViewRootNode;
    this.experimentAreaNode = experimentAreaNode;
    this.additionalNodesParent = additionalNodesParent;
    this.controlsLayer = controlsLayer;
    this.representationComboBox = representationComboBox;
    this.surfaceTypeRadioButtonGroup = surfaceTypeRadioButtonGroup;
    this.zoomButtonGroup = zoomButtonGroup;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGeometricScreenView();
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.visibleProperties.rayTracingVisibleProperty.value ) {
      this.model.stepLightRays( dt );
    }
  }
}

geometricOptics.register( 'GOScreenView', GOScreenView );
export default GOScreenView;
export type { GeometricOpticsScreenViewOptions };