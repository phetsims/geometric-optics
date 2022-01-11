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
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
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
import RaysModeEnum from '../model/RaysModeEnum.js';
import Lens from '../../lens/model/Lens.js';
import GORulerNode from './GORulerNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Optic from '../model/Optic.js';
import TwoFPointNode from './TwoFPointNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragLockedButton from './DragLockedButton.js';
import OpticalAxisForegroundNode from './OpticalAxisForegroundNode.js';
import LightRaysForegroundNode from './LightRaysForegroundNode.js';

// constants
const ZOOM_RANGE = new RangeWithValue( 1, 3, 3 );
const NOMINAL_MODEL_TO_VIEW_SCALE = 2; // view coordinates per cm in initial zoom level

type GeometricOpticsScreenViewOptions = {

  // Gets the position of the model origin in view coordinates
  getViewOrigin: ( layoutBounds: Bounds2 ) => Vector2,

  // Creates the Node for the optic
  createOpticNode: ( optic: Optic, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => Node,

  // Hotkeys to move a ruler to the optic
  hotkeysMoveRulerToOptic: string[],

  // phet-io
  tandem: Tandem
};

class GOScreenView extends ScreenView {

  protected readonly screenViewRootNode: Node;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly visibleProperties: VisibleProperties;
  protected readonly modelBoundsProperty: IReadOnlyProperty<Bounds2>;
  protected readonly experimentAreaNode: Node;
  protected readonly additionalNodesParent: Node;
  protected readonly zoomButtonGroup: Node;

  private readonly model: GOModel;
  private readonly resetGeometricScreenView: () => void;

  /**
   * @param model
   * @param options
   */
  constructor( model: GOModel, options: GeometricOpticsScreenViewOptions ) {

    super( merge( {

      // Workaround for things shifting around while dragging
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/geometric-optics/issues/213
      preventFit: true
    }, options ) );

    const viewOrigin = options.getViewOrigin( this.layoutBounds );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY(
      GOConstants.SCREEN_VIEW_X_MARGIN, GOConstants.SCREEN_VIEW_Y_MARGIN );

    // Create a Y inverted modelViewTransform with isometric scaling along x and y axes.
    // In the model coordinate frame, +x is right, +y is up.
    const modelViewTransform = createTransformForZoomLevel( ZOOM_RANGE.defaultValue, viewOrigin );

    // Properties  ====================================================================================================

    // Create visibleProperty instances for Nodes in the view.
    const visibleProperties = new VisibleProperties( ( model.optic instanceof Lens ), {
      tandem: options.tandem.createTandem( 'visibleProperties' )
    } );

    // Controls zoom in experiment area
    const zoomLevelProperty = new NumberProperty( ZOOM_RANGE.defaultValue, {
      numberType: 'Integer',
      range: ZOOM_RANGE,
      tandem: options.tandem.createTandem( 'zoomLevelProperty' )
    } );

    // ModelViewTransform2 for the current zoom level
    const zoomTransformProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      ( zoomLevel: number ) => createTransformForZoomLevel( zoomLevel, viewOrigin )
    );

    // scale for with the current zoom level
    const zoomScaleProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      ( zoomLevel: number ) => getAbsoluteZoomScale( zoomLevel )
    );

    // Things that are outside the Experiment Area =====================================================================

    // create Rulers
    const horizontalRulerNode = new GORulerNode( model.horizontalRuler, zoomTransformProperty, zoomScaleProperty,
      this.visibleBoundsProperty, model.optic.positionProperty, model.sourceObject.positionProperty,
      model.secondPoint.positionProperty, model.secondPoint.lightSourcePositionProperty,
      visibleProperties.secondPointVisibleProperty,
      model.firstTarget.positionProperty, model.representationProperty, {
        hotkeysMoveRulerToOptic: options.hotkeysMoveRulerToOptic,
        tandem: options.tandem.createTandem( 'horizontalRulerNode' )
      } );
    const verticalRulerNode = new GORulerNode( model.verticalRuler, zoomTransformProperty, zoomScaleProperty,
      this.visibleBoundsProperty, model.optic.positionProperty, model.sourceObject.positionProperty,
      model.secondPoint.positionProperty, model.secondPoint.lightSourcePositionProperty,
      visibleProperties.secondPointVisibleProperty,
      model.firstTarget.positionProperty, model.representationProperty, {
        hotkeysMoveRulerToOptic: options.hotkeysMoveRulerToOptic,
        tandem: options.tandem.createTandem( 'verticalRulerNode' )
      } );

    // create control panel at the bottom of the screen
    const controlPanel = new GOControlPanel( model.representationProperty, model.optic,
      model.raysModeProperty, visibleProperties, {
        tandem: options.tandem.createTandem( 'controlPanel' )
      } );
    controlPanel.boundsProperty.link( () => {
      controlPanel.centerBottom = erodedLayoutBounds.centerBottom;
    } );

    // create toolbox at the top right corner of the screen
    const rulersToolbox = new RulersToolbox( [ horizontalRulerNode, verticalRulerNode ], zoomTransformProperty, {
      rightTop: erodedLayoutBounds.rightTop,
      tandem: options.tandem.createTandem( 'rulersToolbox' )
    } );

    // Tell the rulers where the toolbox is.
    rulersToolbox.visibleProperty.link( visible => {
      const bounds = visible ? rulersToolbox.bounds : Bounds2.NOTHING;
      horizontalRulerNode.setToolboxBounds( bounds );
      verticalRulerNode.setToolboxBounds( bounds );
    } );

    // radio buttons for the shape of the optic
    const opticShapeRadioButtonGroup = new OpticShapeRadioButtonGroup( model.optic, {
      centerTop: erodedLayoutBounds.centerTop,
      tandem: options.tandem.createTandem( 'opticShapeRadioButtonGroup' )
    } );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing object representation
    const representationComboBox = new RepresentationComboBox( model.representationProperty, popupsParent, {
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top,
      tandem: options.tandem.createTandem( 'representationComboBox' )
    } );

    const dragLockedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'dragLockedProperty' ),
      phetioDocumentation: 'Controls dragging of the source object and light sources.<br>' +
                           'true = may be dragged horizontally only<br>' +
                           'false = may be dragged horizontally and vertically'
    } );

    const dragLockedButton = new DragLockedButton( dragLockedProperty, {
      left: representationComboBox.right + 25,
      centerY: representationComboBox.centerY,
      tandem: options.tandem.createTandem( 'dragLockedButton' )
    } );

    // create magnifying buttons for zooming in and out at the left top
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

    // create reset all button at the right bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // create the show/hide eye toggle button above the reset all button
    const showHideToggleButton = new ShowHideToggleButton( visibleProperties.rayTracingVisibleProperty, {
      tandem: options.tandem.createTandem( 'showHideToggleButton' )
    } );
    showHideToggleButton.centerX = resetAllButton.centerX;
    showHideToggleButton.top = controlPanel.top;

    // Experiment Area ================================================================================================

    // {DerivedProperty.<Bounds2>} bounds of the model, an area that does not overlap any controls, in model coordinates
    // See https://github.com/phetsims/geometric-optics/issues/204
    const modelBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        const viewBounds = new Bounds2( visibleBounds.left, opticShapeRadioButtonGroup.bottom,
          visibleBounds.right, controlPanel.top );
        return zoomTransform.viewToModelBounds( viewBounds );
      } );

    // the source object or first light source
    const sourceObjectNode = new SourceObjectNode( model.representationProperty, model.sourceObject,
      modelBoundsProperty, model.optic.positionProperty, modelViewTransform, dragLockedProperty, {
        tandem: options.tandem.createTandem( 'sourceObjectNode' )
      } );

    // the second point or second light source
    const secondPointNode = new SecondPointNode( model.representationProperty, model.secondPoint,
      sourceObjectNode.dragBoundsProperty, modelViewTransform, dragLockedProperty, {
        tandem: options.tandem.createTandem( 'secondPointNode' ),
        visibleProperty: visibleProperties.secondPointVisibleProperty
      } );

    // create the target image
    const targetNode = new TargetNode( model.representationProperty, model.firstTarget, model.optic,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.rayTracingVisibleProperty, modelViewTransform, {
        tandem: options.tandem.createTandem( 'targetNode' )
      } );

    // The complete optical axis, to be put in the background
    const opticalAxisNode = new OpticalAxisNode( model.optic.positionProperty, modelBoundsProperty, modelViewTransform, {
      visibleProperty: model.optic.opticalAxisVisibleProperty
    } );

    // The part of the optical axis that appears to be in front of the things. This makes it looks like
    // the axis is going through the source object, real/virtual image, etc.
    const opticalAxisForegroundNode = new OpticalAxisForegroundNode( model.optic.positionProperty,
      model.representationProperty, model.sourceObject.positionProperty, model.firstTarget.positionProperty,
      model.firstTarget.isVirtualProperty, model.barrier, modelBoundsProperty, modelViewTransform,
      targetNode.boundsProperty, {
        visibleProperty: model.optic.opticalAxisVisibleProperty
      } );

    const opticNode = options.createOpticNode( model.optic, modelBoundsProperty, modelViewTransform, options.tandem );

    const opticVerticalAxisNode = new OpticVerticalAxisNode( model.optic, model.raysModeProperty, modelBoundsProperty, modelViewTransform, {
      tandem: options.tandem.createTandem( 'opticVerticalAxisNode' )
    } );

    // create the light rays associated with the source object and first light source
    const lightRays1Options = {
      realRaysStroke: GOColors.realRays1StrokeProperty,
      virtualRaysStroke: GOColors.virtualRays1StrokeProperty
    };
    const lightRays1Node = new LightRaysNode( model.lightRays1, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, lightRays1Options );
    const lightRays1ForegroundNode = new LightRaysForegroundNode( model.lightRays1, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, this.visibleBoundsProperty,
      model.optic.positionProperty, model.firstTarget.positionProperty, model.firstTarget.isVirtualProperty, lightRays1Options );

    // create the light rays associated with the second point and second light source
    const lightRays2Options = {
      realRaysStroke: GOColors.realRays2StrokeProperty,
      virtualRaysStroke: GOColors.virtualRays2StrokeProperty,
      visibleProperty: visibleProperties.secondPointVisibleProperty
    };
    const lightRays2Node = new LightRaysNode( model.lightRays2, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, lightRays2Options );
    const lightRays2ForegroundNode = new LightRaysForegroundNode( model.lightRays2, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, this.visibleBoundsProperty,
      model.optic.positionProperty, model.firstTarget.positionProperty, model.firstTarget.isVirtualProperty, lightRays2Options );

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

    // Handle zoom level.
    zoomLevelProperty.lazyLink( ( zoomLevel: number, oldZoomLevel: number ) => {

      // Scale the experiment area.
      const relativeZoomScale = getRelativeZoomScale( zoomLevel, oldZoomLevel );
      experimentAreaNode.scale( relativeZoomScale );

      // Translate experimentAreaNode such that the origin point remains fixed through zoom levels.
      const translateVector = viewOrigin.times( 1 / relativeZoomScale - 1 );
      experimentAreaNode.translate( translateVector.x, translateVector.y );
    } );

    Property.multilink(
      [ model.raysModeProperty, visibleProperties.rayTracingVisibleProperty ],
      ( raysMode: RaysModeEnum, rayTracingVisible: boolean ) => {
        if ( raysMode === 'none' ) {
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

    // labels
    const labelsNode = new LabelsNode( model, visibleProperties, zoomTransformProperty );

    // Changing these things interrupts interactions ============================================================

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

    const rulersLayer = new Node( {
      children: [ horizontalRulerNode, verticalRulerNode ]
    } );

    const screenViewRootNode = new Node( {
      children: [
        experimentAreaNode,
        labelsNode,
        opticShapeRadioButtonGroup,
        controlPanel,
        showHideToggleButton,
        resetAllButton,
        rulersToolbox,
        zoomButtonGroup,
        representationComboBox,
        dragLockedButton,
        rulersLayer,
        popupsParent
      ]
    } );
    this.addChild( screenViewRootNode );

    this.resetGeometricScreenView = (): void => {
      visibleProperties.reset();
      zoomLevelProperty.reset();
      dragLockedProperty.reset();
      sourceObjectNode.reset();
      secondPointNode.reset();
    };

    // pdom -traversal order
    //TODO https://github.com/phetsims/geometric-optics/issues/235 add second point, light sources
    screenViewRootNode.pdomOrder = [
      representationComboBox,
      dragLockedButton,
      opticShapeRadioButtonGroup,
      rulersToolbox,
      horizontalRulerNode,
      verticalRulerNode,
      sourceObjectNode,
      zoomButtonGroup,
      controlPanel,
      showHideToggleButton,
      resetAllButton
    ];

    this.model = model; // {GOModel}
    this.screenViewRootNode = screenViewRootNode; // {Node}
    this.modelViewTransform = modelViewTransform; // {ModelViewTransform2}
    this.visibleProperties = visibleProperties; // {VisibleProperties}
    this.modelBoundsProperty = modelBoundsProperty; // {DerivedProperty.<Bounds2>}
    this.experimentAreaNode = experimentAreaNode; // {Node}
    this.additionalNodesParent = additionalNodesParent; // {Node}
    this.zoomButtonGroup = zoomButtonGroup; // {Node}
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

/**
 * Gets the relative scale between a zoom level and a previous zoom level.
 */
function getRelativeZoomScale( zoomLevel: number, previousZoomLevel: number ): number {
  const base = 2;
  const scale = Math.pow( base, zoomLevel );
  const previousScale = Math.pow( base, previousZoomLevel );
  return scale / previousScale;
}

/**
 * Gets the absolute scaling factor measured from the initial zoom level.
 * The absolute scale returns 1 if the zoom level is the initial zoom level value.
 */
function getAbsoluteZoomScale( zoomLevel: number ): number {
  return getRelativeZoomScale( zoomLevel, ZOOM_RANGE.defaultValue );
}

/**
 * Creates a model-view transform appropriate for the zoom level
 * @param zoomLevel
 * @param viewOrigin
 */
function createTransformForZoomLevel( zoomLevel: number, viewOrigin: Vector2 ): ModelViewTransform2 {

  // scaling factor between zoom level measured from the initial zoom level
  const absoluteZoomScale = getAbsoluteZoomScale( zoomLevel );

  // number of view coordinates for 1 model coordinate
  const modelToViewScale = NOMINAL_MODEL_TO_VIEW_SCALE * absoluteZoomScale;

  // create a Y inverted modelViewTransform with isometric scaling along X and Y
  return ModelViewTransform2.createOffsetXYScaleMapping( viewOrigin, modelToViewScale, -modelToViewScale );
}

geometricOptics.register( 'GOScreenView', GOScreenView );
export default GOScreenView;
export type { GeometricOpticsScreenViewOptions };