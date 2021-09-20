// Copyright 2021, University of Colorado Boulder

/**
 * Common screen view for the simulation
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import FocalPoint from '../model/FocalPoint.js';
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import LightRayMode from '../model/LightRayMode.js';
import CurveControl from './CurveControl.js';
import FocalPointNode from './FocalPointNode.js';
import GeometricOpticsControlPanel from './GeometricOpticsControlPanel.js';
import GeometricOpticRulersLayer from './GeometricOpticsRulersLayer.js';
import LabelsNode from './LabelsNode.js';
import LightRaysNode from './LightRaysNode.js';
import OpticalAxisLine from './OpticalAxisLine.js';
import OpticNode from './OpticNode.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import RulersToolboxPanel from './RulersToolboxPanel.js';
import SecondSourceNode from './SecondSourceNode.js';
import ShowHideToggleButton from './ShowHideToggleButton.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetNode from './TargetNode.js';
import TrackingDiskNode from './TrackingDiskNode.js';
import VisibleProperties from './VisibleProperties.js';

// constants
const ZOOM_RANGE = GeometricOpticsConstants.ZOOM_RANGE;
const ORIGIN_POINT = GeometricOpticsConstants.ORIGIN_POINT;

class GeometricOpticsScreenView extends ScreenView {

  /**
   * @param {GeometricOpticsModel} model
   */
  constructor( model ) {
    assert && assert( model instanceof GeometricOpticsModel, 'invalid model' );

    super();

    // @private
    this.model = model;

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY( GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN,
      GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN );

    // @protected Create visibleProperty instances for Nodes in the view.
    this.visibleProperties = new VisibleProperties();

    // @private {Property.<number>} controls zoom in play area
    this.zoomLevelProperty = new NumberProperty( ZOOM_RANGE.defaultValue, { range: ZOOM_RANGE } );

    // @protected create a Y inverted modelViewTransform with isometric scaling along X and Y
    this.modelViewTransform = this.getModelViewTransformForZoomLevel( ZOOM_RANGE.defaultValue );

    // @protected {DerivedProperty.<ModelViewTransform2>} modelViewTransform
    this.zoomModelViewTransformProperty = new DerivedProperty(
      [ this.zoomLevelProperty ],
      zoomLevel => this.getModelViewTransformForZoomLevel( zoomLevel )
    );

    // @protected {DerivedProperty.<number>} zoom scale associate with the zoom level
    this.absoluteScaleProperty = new DerivedProperty(
      [ this.zoomLevelProperty ],
      zoomLevel => this.getAbsoluteScale( zoomLevel )
    );

    //----------------------------------------------------------------------------
    //               Buttons, Controls and Panels

    // create Rulers
    this.rulersLayer = new GeometricOpticRulersLayer(
      model.horizontalRuler,
      model.verticalRuler,
      this.visibleBoundsProperty,
      this.absoluteScaleProperty,
      this.zoomModelViewTransformProperty
    );

    // create control panel at the bottom of the screen
    const controlPanel = new GeometricOpticsControlPanel( model.optic,
      model.lightRayModeProperty, this.visibleProperties, this.modelViewTransform, {
        hasLens: model.optic.isLens()
      } );
    controlPanel.centerBottom = erodedLayoutBounds.centerBottom;

    // create toolbox panel at the top right corner of the screen
    const toolboxPanel = new RulersToolboxPanel( this.rulersLayer );
    toolboxPanel.rightTop = erodedLayoutBounds.rightTop;

    // pass the bounds of the toolbox to the rulers for their return to toolbox
    this.rulersLayer.setToolboxPanelBounds( toolboxPanel.bounds );

    // create the control buttons to toggle between convex and concave optic at the left bottom
    const curveControl = new CurveControl( model.optic );
    curveControl.rightCenter = controlPanel.leftCenter.minusXY( 20, 0 );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing object representation
    const representationComboBox = new RepresentationComboBox( model.representationProperty, popupsParent, {
      centerTop: erodedLayoutBounds.centerTop
    } );

    // create magnifying buttons for zooming in and out at the left top
    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( this.zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: 8,
      magnifyingGlassNodeOptions: {
        scale: 0.5
      },
      buttonOptions: {
        xMargin: 5,
        yMargin: 4
      }
    } );
    zoomButtonGroup.leftTop = erodedLayoutBounds.leftTop;

    // create reset all button at the right bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom
    } );

    // create the show/hide eye toggle button above the reset all button
    const showHideToggleButton = new ShowHideToggleButton( this.visibleProperties.rayTracingVisibleProperty );
    showHideToggleButton.centerX = resetAllButton.centerX;
    showHideToggleButton.top = controlPanel.top;

    //-------------------------------------------------------------------

    // @protected {DerivedProperty.<Bounds2>} playAreaModelBoundsProperty
    this.playAreaModelBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, this.zoomModelViewTransformProperty ],
      ( visibleBounds, zoomModelViewTransform ) => {
        const playAreaBounds = new Bounds2( visibleBounds.minX, 0,
          visibleBounds.maxX, controlPanel.top );
        return zoomModelViewTransform.viewToModelBounds( playAreaBounds );
      } );

    //----------------------------------------------------------------------
    //                          scenery nodes for play area

    // @protected layer for all the nodes within the play area: Play area layer is subject to zoom in/out
    this.playAreaNode = new Node();

    // @private create the source/object on the left hand side of screen
    this.sourceObjectNode = new SourceObjectNode(
      model.representationProperty,
      model.sourceObject,
      this.playAreaModelBoundsProperty,
      model.optic.positionProperty,
      this.modelViewTransform
    );

    // @private the second source
    this.secondSourceNode = new SecondSourceNode(
      model.representationProperty,
      model.sourceObject,
      this.modelViewTransform, {
        visibleProperty: this.visibleProperties.secondSourceVisibleProperty
      } );

    // create the optical axis attached to the optical element
    const opticalAxisLine = new OpticalAxisLine( model.optic.positionProperty,
      this.playAreaModelBoundsProperty, this.modelViewTransform );

    const opticNode = new OpticNode(
      model.optic,
      model.lightRayModeProperty,
      this.playAreaModelBoundsProperty,
      this.modelViewTransform
    );

    // create the light rays associated with the object
    const lightRaysNode = new LightRaysNode( model.firstLightRays,
      this.visibleProperties.virtualImageVisibleProperty, this.modelViewTransform, {
        realRayStroke: GeometricOpticsColors.realRayOneStrokeProperty,
        virtualRayStroke: GeometricOpticsColors.virtualRayOneStrokeProperty
      } );

    // create the light rays associated with the second source
    const secondSourceLightRaysNode = new LightRaysNode( model.secondLightRays,
      this.visibleProperties.virtualImageVisibleProperty, this.modelViewTransform, {
        realRayStroke: GeometricOpticsColors.realRayTwoStrokeProperty,
        virtualRayStroke: GeometricOpticsColors.virtualRayTwoStrokeProperty
      } );

    // the second source light rays visibility is tied to the status of the checkbox
    this.visibleProperties.secondSourceVisibleProperty.linkAttribute( secondSourceLightRaysNode, 'visible' );

    // create the target image
    const targetNode = new TargetNode(
      model.representationProperty,
      model.firstTarget,
      model.optic,
      this.visibleProperties.virtualImageVisibleProperty,
      this.modelViewTransform
    );

    // create two focal points
    const leftFocalPointNode = new FocalPointNode( model.leftFocalPoint, this.modelViewTransform, {
      visibleProperty: this.visibleProperties.focalPointVisibleProperty
    } );
    const rightFocalPointNode = new FocalPointNode( model.rightFocalPoint, this.modelViewTransform, {
      visibleProperty: this.visibleProperties.focalPointVisibleProperty
    } );
    const focalPointsLayer = new Node( {
      children: [ leftFocalPointNode, rightFocalPointNode ]
    } );

    // add children that need to be zoomed in/out. order is important
    this.playAreaNode.addChild( opticalAxisLine );
    this.playAreaNode.addChild( this.sourceObjectNode );
    this.playAreaNode.addChild( opticNode );
    this.playAreaNode.addChild( targetNode );
    this.playAreaNode.addChild( lightRaysNode );
    this.playAreaNode.addChild( secondSourceLightRaysNode );
    this.playAreaNode.addChild( this.secondSourceNode );
    this.playAreaNode.addChild( focalPointsLayer );

    // scale the playAreaNode
    this.zoomLevelProperty.lazyLink( ( zoomLevel, oldZoomLevel ) => {

      // scaling factor between zoom levels
      const relativeScale = this.getRelativeScale( zoomLevel, oldZoomLevel );

      // offset of the play areaNode such that the origin point remains fixed through zoom
      const translateVector = ORIGIN_POINT.times( 1 / relativeScale - 1 );

      // scale and translate the playArea
      this.playAreaNode.scale( relativeScale );
      this.playAreaNode.translate( translateVector );
    } );

    Property.multilink(
      [ model.lightRayModeProperty, this.visibleProperties.rayTracingVisibleProperty ],
      ( lightRayMode, rayTracingVisible ) => {
        if ( lightRayMode === LightRayMode.NONE ) {
          model.firstTarget.enabledProperty.value = rayTracingVisible;
          model.secondTarget.enabledProperty.value = rayTracingVisible;
        }
        else {
          if ( !rayTracingVisible ) {
            model.firstTarget.enabledProperty.value = false;
            model.secondTarget.enabledProperty.value = false;
            model.lightRaysTimeProperty.reset();
          }
        }
      } );

    // labels
    const labelsNode = new LabelsNode( model, this.visibleProperties, this.zoomModelViewTransformProperty,
      this.zoomLevelProperty );

    // add playAreaNode and controls to the scene graph
    this.addChild( curveControl );
    this.addChild( controlPanel );
    this.addChild( showHideToggleButton );
    this.addChild( resetAllButton );
    this.addChild( this.playAreaNode );
    this.addChild( toolboxPanel );
    this.addChild( zoomButtonGroup );
    this.addChild( representationComboBox );
    this.addChild( labelsNode );
    this.addChild( this.rulersLayer );
    this.addChild( popupsParent );

    //------------------------------------------------------------
    //                  Query Parameters

    // add disks at position of optic, source and target
    if ( GeometricOpticsQueryParameters.showDebugPoints ) {
      this.playAreaNode.addChild( new TrackingDiskNode( model.firstTarget.positionProperty, this.modelViewTransform,
        { fill: 'magenta' } ) );
      this.playAreaNode.addChild( new TrackingDiskNode( model.sourceObject.firstPositionProperty, this.modelViewTransform,
        { fill: 'magenta' } ) );
      this.playAreaNode.addChild( new TrackingDiskNode( model.optic.positionProperty, this.modelViewTransform,
        { fill: 'magenta' } ) );
    }

    // add disks at a distance 2f for optic on each side of optic
    if ( GeometricOpticsQueryParameters.show2fPoints ) {
      const minus2fPoint = new FocalPoint( model.optic.positionProperty, model.optic.focalLengthProperty, {
        multiplicativeFactor: -2
      } );
      const plus2fPoint = new FocalPoint( model.optic.positionProperty, model.optic.focalLengthProperty, {
        multiplicativeFactor: 2
      } );
      this.playAreaNode.addChild( new TrackingDiskNode( minus2fPoint.positionProperty, this.modelViewTransform,
        { fill: 'black' } ) );
      this.playAreaNode.addChild( new TrackingDiskNode( plus2fPoint.positionProperty, this.modelViewTransform,
        { fill: 'black' } ) );
    }
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.zoomLevelProperty.reset();
    this.visibleProperties.reset();
    this.sourceObjectNode.reset();
    this.secondSourceNode.reset();
    this.rulersLayer.reset();
  }

  /**
   * Time stepper
   * @public
   */
  step( dt ) {
    if ( this.visibleProperties.rayTracingVisibleProperty.value ) {
      this.model.stepLightRays( dt );
    }
  }

  /**
   * Scale function
   * @public
   * @returns {number}
   */
  scaleFunction( zoomLevel ) {
    return Math.pow( GeometricOpticsConstants.ZOOM_SCALE_FACTOR, zoomLevel );
  }

  /**
   * Returns the relative scale between a zoom level and a previous old zoom level
   * @private
   * @param {number} zoomLevel
   * @param {number} oldZoomLevel
   * @returns {number}
   */
  getRelativeScale( zoomLevel, oldZoomLevel ) {
    const scale = this.scaleFunction( zoomLevel );
    const oldScale = this.scaleFunction( oldZoomLevel );
    return scale / oldScale;
  }

  /**
   * Returns the absolute scaling factor measured from the initial zoom level
   * The absolute scale returns 1 if the zoom level is the initial zoom level value
   * @private
   * @param {number} zoomLevel
   * @returns {number}
   */
  getAbsoluteScale( zoomLevel ) {
    return this.getRelativeScale( zoomLevel, ZOOM_RANGE.defaultValue );
  }

  /**
   * Returns a model view transform appropriate for the zoom level
   * @private
   * @param {number} zoomLevel
   * @returns {ModelViewTransform2}
   */
  getModelViewTransformForZoomLevel( zoomLevel ) {

    // scaling factor between zoom level measured from the initial zoom level
    const absoluteScale = this.getAbsoluteScale( zoomLevel );

    // number of view coordinates for 1 model coordinate
    const viewModelScale = GeometricOpticsConstants.NOMINAL_VIEW_MODEL_CONVERSION * absoluteScale;

    // create a Y inverted modelViewTransform with isometric scaling along X and Y
    return ModelViewTransform2.createOffsetXYScaleMapping( ORIGIN_POINT, viewModelScale, -viewModelScale );
  }
}

geometricOptics.register( 'GeometricOpticsScreenView', GeometricOpticsScreenView );
export default GeometricOpticsScreenView;