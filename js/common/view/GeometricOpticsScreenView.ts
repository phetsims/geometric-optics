// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsScreenView is the common ScreenView for this simulation.
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
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import DebugPointNode from './DebugPointNode.js';
import FocalPointNode from './FocalPointNode.js';
import GeometricOpticsControlPanel from './GeometricOpticsControlPanel.js';
import GeometricOpticRulersLayer from './GeometricOpticsRulersLayer.js';
import LabelsNode from './LabelsNode.js';
import LightRaysNode from './LightRaysNode.js';
import OpticalAxis from './OpticalAxis.js';
import OpticShapeRadioButtonGroup from './OpticShapeRadioButtonGroup.js';
import OpticVerticalAxis from './OpticVerticalAxis.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import RulersToolbox from './RulersToolbox.js';
import SecondPointNode from './SecondPointNode.js';
import ShowHideToggleButton from './ShowHideToggleButton.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetNode from './TargetNode.js';
import VisibleProperties from './VisibleProperties.js';
import RaysModeEnum from '../model/RaysModeEnum.js';
import Lens from '../../lens/model/Lens.js';
import Optic from '../model/Optic.js';

// constants
const ZOOM_RANGE = new RangeWithValue( 1, 3, 3 );
const NOMINAL_VIEW_MODEL_CONVERSION = 2; // view coordinates per cm in initial zoom level

class GeometricOpticsScreenView extends ScreenView {

  protected readonly screenViewRootNode: Node;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly visibleProperties: VisibleProperties;
  protected readonly modelBoundsProperty: DerivedProperty<Bounds2>;
  protected readonly experimentAreaNode: Node;
  protected readonly zoomButtonGroup: Node;

  private readonly model: GeometricOpticsModel;
  private readonly resetGeometricScreenView: () => void;

  /**
   * @param model
   * @param config
   */
  constructor( model: GeometricOpticsModel, config: any ) {

    config = merge( {

      // Workaround for things shifting around while dragging
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/geometric-optics/issues/213
      preventFit: true,

      // By default, the origin is at the center of the layoutBounds.
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2( this.layoutBounds.centerX, this.layoutBounds.centerY ),

      // Creates the Node for the optic
      createOpticNode: ( optic: Optic, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2,
                         parentTandem: Tandem ) => Node,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, config );
    assert && assert( config.createOpticNode, 'createOpticNode is required' );

    super( config );

    const viewOrigin = config.getViewOrigin( this.layoutBounds );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY(
      GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN, GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN );

    // Create a Y inverted modelViewTransform with isometric scaling along x and y axes.
    // In the model coordinate frame, +x is right, +y is up.
    const modelViewTransform = this.getTransformForZoomLevel( ZOOM_RANGE.defaultValue, viewOrigin );

    // Properties  ====================================================================================================

    // Create visibleProperty instances for Nodes in the view.
    const visibleProperties = new VisibleProperties( ( model.optic instanceof Lens ), {
      tandem: config.tandem.createTandem( 'visibleProperties' )
    } );

    // {Property.<number>} controls zoom in experiment area
    const zoomLevelProperty = new NumberProperty( ZOOM_RANGE.defaultValue, {
      numberType: 'Integer',
      range: ZOOM_RANGE,
      tandem: config.tandem.createTandem( 'zoomLevelProperty' )
    } );

    // {DerivedProperty.<ModelViewTransform2>}
    const zoomTransformProperty = new DerivedProperty<ModelViewTransform2>(
      [ zoomLevelProperty ],
      ( zoomLevel: number ) => this.getTransformForZoomLevel( zoomLevel, viewOrigin )
    );

    // {DerivedProperty.<number>} zoom scale associate with the zoom level
    const absoluteScaleProperty = new DerivedProperty<number>(
      [ zoomLevelProperty ],
      ( zoomLevel: number ) => getAbsoluteScale( zoomLevel )
    );

    // Things that are outside the Experiment Area =====================================================================

    // create Rulers
    const rulersLayer = new GeometricOpticRulersLayer(
      model.horizontalRuler,
      model.verticalRuler,
      this.visibleBoundsProperty,
      absoluteScaleProperty,
      zoomTransformProperty
    );

    // create control panel at the bottom of the screen
    const controlPanel = new GeometricOpticsControlPanel( model.representationProperty, model.optic,
      model.raysModeProperty, visibleProperties, {
        tandem: config.tandem.createTandem( 'controlPanel' )
      } );
    controlPanel.boundsProperty.link( () => {
      controlPanel.centerBottom = erodedLayoutBounds.centerBottom;
    } );

    // create toolbox at the top right corner of the screen
    const toolbox = new RulersToolbox( rulersLayer, {
      rightTop: erodedLayoutBounds.rightTop,
      tandem: config.tandem.createTandem( 'toolbox' )
    } );

    // Tell the rulersLayer where the toolbox is.
    rulersLayer.toolboxBounds.set( toolbox.bounds );

    // radio buttons for the shape of the optic
    const opticShapeRadioButtonGroup = new OpticShapeRadioButtonGroup( model.optic, {
      centerTop: erodedLayoutBounds.centerTop,
      tandem: config.tandem.createTandem( 'opticShapeRadioButtonGroup' )
    } );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing object representation
    const representationComboBox = new RepresentationComboBox( model.representationProperty, popupsParent, {
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top,
      tandem: config.tandem.createTandem( 'representationComboBox' )
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
      tandem: config.tandem.createTandem( 'zoomButtonGroup' )
    } );

    // create reset all button at the right bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: config.tandem.createTandem( 'resetAllButton' )
    } );

    // create the show/hide eye toggle button above the reset all button
    const showHideToggleButton = new ShowHideToggleButton( visibleProperties.rayTracingVisibleProperty, {
      tandem: config.tandem.createTandem( 'showHideToggleButton' )
    } );
    showHideToggleButton.centerX = resetAllButton.centerX;
    showHideToggleButton.top = controlPanel.top;

    // Experiment Area ================================================================================================

    // {DerivedProperty.<Bounds2>} bounds of the model, an area that does not overlap any controls, in model coordinates
    // See https://github.com/phetsims/geometric-optics/issues/204
    const modelBoundsProperty = new DerivedProperty<Bounds2>(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        const viewBounds = new Bounds2( visibleBounds.left, opticShapeRadioButtonGroup.bottom,
          visibleBounds.right, controlPanel.top );
        return zoomTransform.viewToModelBounds( viewBounds );
      } );

    // the source object or first light source
    const sourceObjectNode = new SourceObjectNode( model.representationProperty, model.sourceObject,
      modelBoundsProperty, model.optic.positionProperty, modelViewTransform, {
        tandem: config.tandem.createTandem( 'sourceObjectNode' )
      } );

    // the second point or second light source
    const secondPointNode = new SecondPointNode( model.representationProperty, model.secondPoint,
      sourceObjectNode.dragBoundsProperty, modelViewTransform, {
        visibleProperty: visibleProperties.secondPointVisibleProperty,
        tandem: config.tandem.createTandem( 'secondPointNode' )
      } );

    const opticalAxis = new OpticalAxis( model.optic.positionProperty, modelBoundsProperty, modelViewTransform, {
      visibleProperty: model.optic.opticalAxisVisibleProperty
    } );

    const opticNode = config.createOpticNode( model.optic, modelBoundsProperty, modelViewTransform, config.tandem );

    const opticVerticalAxis = new OpticVerticalAxis( model.optic, model.raysModeProperty, modelBoundsProperty, modelViewTransform );

    // create the light rays associated with the source object and first light source
    const lightRaysNode = new LightRaysNode( model.firstLightRays, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, {
        realRaysStroke: GeometricOpticsColors.realRays1StrokeProperty,
        virtualRaysStroke: GeometricOpticsColors.virtualRays1StrokeProperty
      } );

    // create the light rays associated with the second point and second light source
    const secondPointLightRaysNode = new LightRaysNode( model.secondLightRays, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, {
        realRaysStroke: GeometricOpticsColors.realRays2StrokeProperty,
        virtualRaysStroke: GeometricOpticsColors.virtualRays2StrokeProperty,
        visibleProperty: visibleProperties.secondPointVisibleProperty
      } );

    // create the target image
    const targetNode = new TargetNode( model.representationProperty, model.firstTarget, model.optic,
      visibleProperties.virtualImageVisibleProperty, visibleProperties.rayTracingVisibleProperty, modelViewTransform );

    // create two focal points
    const focalPointsNode = new Node( {
      children: [
        new FocalPointNode( model.optic.leftFocalPointProperty, modelViewTransform ),
        new FocalPointNode( model.optic.rightFocalPointProperty, modelViewTransform )
      ],
      visibleProperty: visibleProperties.focalPointsVisibleProperty,
      tandem: config.tandem.createTandem( 'focalPointsNode' )
    } );

    // Layer for all the Nodes within the "experiment area".
    // The experiment area is subject to zoom in/out, so include add all Nodes that need to be zoomed.
    const experimentAreaNode = new Node( {
      children: [
        opticalAxis,
        sourceObjectNode,
        opticNode,
        opticVerticalAxis,
        targetNode,
        focalPointsNode,
        lightRaysNode,
        secondPointLightRaysNode,
        secondPointNode
      ]
    } );

    // Handle zoom level.
    zoomLevelProperty.lazyLink( ( zoomLevel: number, oldZoomLevel: number ) => {

      // Scale the experiment area.
      const relativeScale = getRelativeScale( zoomLevel, oldZoomLevel );
      experimentAreaNode.scale( relativeScale );

      // Translate experimentAreaNode such that the origin point remains fixed through zoom levels.
      const translateVector = viewOrigin.times( 1 / relativeScale - 1 );
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
    const labelsNode = new LabelsNode( model, visibleProperties, zoomTransformProperty, zoomLevelProperty );

    // Debugging ================================================================================================

    // Add points at the position of things that move around.
    if ( GeometricOpticsQueryParameters.showPositions ) {
      const config = { fill: 'red' };
      experimentAreaNode.addChild( new DebugPointNode( model.optic.positionProperty, modelViewTransform, config ) );
      experimentAreaNode.addChild( new DebugPointNode( model.sourceObject.positionProperty, modelViewTransform, config ) );
      experimentAreaNode.addChild( new DebugPointNode( model.secondPoint.lightSourcePositionProperty, modelViewTransform, config ) );
      experimentAreaNode.addChild( new DebugPointNode( model.firstTarget.positionProperty, modelViewTransform, config ) );
    }

    // Add the 2F points on each side of optic
    if ( GeometricOpticsQueryParameters.show2F ) {
      const left2fProperty = new DerivedProperty<Vector2>( [ model.optic.leftFocalPointProperty ],
        ( position: Vector2 ) => position.timesScalar( 2 ) );
      const right2fProperty = new DerivedProperty<Vector2>( [ model.optic.rightFocalPointProperty ],
        ( position: Vector2 ) => position.timesScalar( 2 ) );
      const options = { fill: GeometricOpticsColors.focalPointFillProperty };
      experimentAreaNode.addChild( new DebugPointNode( left2fProperty, modelViewTransform, options ) );
      experimentAreaNode.addChild( new DebugPointNode( right2fProperty, modelViewTransform, options ) );
    }

    // Show the value of modelBoundsProperty
    if ( GeometricOpticsQueryParameters.showModelBounds ) {
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

    const screenViewRootNode = new Node( {
      children: [
        experimentAreaNode,
        labelsNode,
        opticShapeRadioButtonGroup,
        controlPanel,
        showHideToggleButton,
        resetAllButton,
        toolbox,
        zoomButtonGroup,
        representationComboBox,
        rulersLayer,
        popupsParent
      ]
    } );
    this.addChild( screenViewRootNode );

    this.resetGeometricScreenView = (): void => {
      zoomLevelProperty.reset();
      visibleProperties.reset();
      sourceObjectNode.reset();
      secondPointNode.reset();
      rulersLayer.reset();
    };

    // pdom -traversal order
    //TODO https://github.com/phetsims/geometric-optics/issues/235 add Object, second point, light sources, toolbox, rulers
    // @ts-ignore TYPESCRIPT Property 'pdomOrder' does not exist on type 'Node'.
    screenViewRootNode.pdomOrder = [
      representationComboBox,
      opticShapeRadioButtonGroup,
      zoomButtonGroup,
      controlPanel,
      showHideToggleButton,
      resetAllButton
    ];

    this.model = model; // {GeometricOpticsModel}
    this.screenViewRootNode = screenViewRootNode; // {Node}
    this.modelViewTransform = modelViewTransform; // {ModelViewTransform2}
    this.visibleProperties = visibleProperties; // {VisibleProperties}
    this.modelBoundsProperty = modelBoundsProperty; // {DerivedProperty.<Bounds2>}
    this.experimentAreaNode = experimentAreaNode; // {Node}
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

  /**
   * Returns a model-view transform appropriate for the zoom level
   * @param zoomLevel
   * @param viewOrigin
   */
  private getTransformForZoomLevel( zoomLevel: number, viewOrigin: Vector2 ): ModelViewTransform2 {

    // scaling factor between zoom level measured from the initial zoom level
    const absoluteScale = getAbsoluteScale( zoomLevel );

    // number of view coordinates for 1 model coordinate
    const viewModelScale = NOMINAL_VIEW_MODEL_CONVERSION * absoluteScale;

    // create a Y inverted modelViewTransform with isometric scaling along X and Y
    return ModelViewTransform2.createOffsetXYScaleMapping( viewOrigin, viewModelScale, -viewModelScale );
  }
}

/**
 * Returns the relative scale between a zoom level and a previous old zoom level
 */
function getRelativeScale( zoomLevel: number, oldZoomLevel: number ): number {
  const base = 2;
  const scale = Math.pow( base, zoomLevel );
  const oldScale = Math.pow( base, oldZoomLevel );
  return scale / oldScale;
}

/**
 * Returns the absolute scaling factor measured from the initial zoom level.
 * The absolute scale returns 1 if the zoom level is the initial zoom level value.
 */
function getAbsoluteScale( zoomLevel: number ): number {
  return getRelativeScale( zoomLevel, ZOOM_RANGE.defaultValue );
}


geometricOptics.register( 'GeometricOpticsScreenView', GeometricOpticsScreenView );
export default GeometricOpticsScreenView;