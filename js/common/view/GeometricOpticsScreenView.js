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
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import RaysMode from '../model/RaysMode.js';
import CurveRadioButtonGroup from './CurveRadioButtonGroup.js';
import DebugPointNode from './DebugPointNode.js';
import FocalPointNode from './FocalPointNode.js';
import GeometricOpticsControlPanel from './GeometricOpticsControlPanel.js';
import GeometricOpticRulersLayer from './GeometricOpticsRulersLayer.js';
import LabelsNode from './LabelsNode.js';
import LightRaysNode from './LightRaysNode.js';
import OpticalAxisLine from './OpticalAxisLine.js';
import OpticNode from './OpticNode.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import RulersToolbox from './RulersToolbox.js';
import SecondSourceNode from './SecondSourceNode.js';
import ShowHideToggleButton from './ShowHideToggleButton.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetNode from './TargetNode.js';
import VisibleProperties from './VisibleProperties.js';

// constants
const ZOOM_RANGE = GeometricOpticsConstants.ZOOM_RANGE;
const ORIGIN_POINT = GeometricOpticsConstants.ORIGIN_POINT;

class GeometricOpticsScreenView extends ScreenView {

  /**
   * @param {GeometricOpticsModel} model
   */
  constructor( model ) {
    assert && assert( model instanceof GeometricOpticsModel );

    super( {
      // Workaround for things shifting around while dragging
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/geometric-optics/issues/213
      preventFit: true
    } );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY( GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN,
      GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN );

    // create a Y inverted modelViewTransform with isometric scaling along X and Y
    const modelViewTransform = this.getZoomTransform( ZOOM_RANGE.defaultValue );

    // Properties  ====================================================================================================

    // Create visibleProperty instances for Nodes in the view.
    const visibleProperties = new VisibleProperties( model.optic.opticType );

    // {Property.<number>} controls zoom in play area
    const zoomLevelProperty = new NumberProperty( ZOOM_RANGE.defaultValue, { range: ZOOM_RANGE } );

    // {DerivedProperty.<ModelViewTransform2>}
    const zoomTransformProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      zoomLevel => this.getZoomTransform( zoomLevel )
    );

    // {DerivedProperty.<number>} zoom scale associate with the zoom level
    const absoluteScaleProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      zoomLevel => this.getAbsoluteScale( zoomLevel )
    );

    // Things that are outside the Play Area ===========================================================================

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
      model.raysModeProperty, visibleProperties, modelViewTransform );
    controlPanel.centerBottom = erodedLayoutBounds.centerBottom;

    // create toolbox at the top right corner of the screen
    const toolbox = new RulersToolbox( rulersLayer, {
      rightTop: erodedLayoutBounds.rightTop
    } );

    // pass the bounds of the toolbox to the rulers for their return to toolbox
    rulersLayer.setToolboxBounds( toolbox.bounds );

    // create the control buttons to toggle between convex and concave optic at the left bottom
    const curveRadioButtonGroup = new CurveRadioButtonGroup( model.optic, {
      centerTop: erodedLayoutBounds.centerTop
    } );

    // Parent for any popups
    const popupsParent = new Node();

    // Combo box for choosing object representation
    const representationComboBox = new RepresentationComboBox( model.representationProperty, popupsParent, {
      left: this.layoutBounds.left + 100,
      top: erodedLayoutBounds.top
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
      centerY: controlPanel.centerY
    } );

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
    const showHideToggleButton = new ShowHideToggleButton( visibleProperties.rayTracingVisibleProperty );
    showHideToggleButton.centerX = resetAllButton.centerX;
    showHideToggleButton.top = controlPanel.top;

    // Play Area ================================================================================================

    // {DerivedProperty.<Bounds2>} bounds of the model, and area that does not overlap any controls.
    // See https://github.com/phetsims/geometric-optics/issues/204
    const modelBoundsProperty = new DerivedProperty(
      [ this.visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds, zoomTransform ) => {
        const playAreaBounds = new Bounds2( visibleBounds.left, curveRadioButtonGroup.bottom, visibleBounds.right, controlPanel.top );
        return zoomTransform.viewToModelBounds( playAreaBounds );
      } );

    // create the source/object on the left hand side of screen
    const sourceObjectNode = new SourceObjectNode( model.representationProperty, model.sourceObject,
      modelBoundsProperty, model.optic.positionProperty, modelViewTransform );

    // the second source
    const secondSourceNode = new SecondSourceNode( model.representationProperty, model.secondSource,
      sourceObjectNode.dragBoundsProperty, modelViewTransform, {
        visibleProperty: visibleProperties.secondSourceVisibleProperty
      } );

    // create the optical axis attached to the optical element
    const opticalAxisLine = new OpticalAxisLine( model.optic.positionProperty, modelBoundsProperty, modelViewTransform );

    const opticNode = new OpticNode( model.optic, model.raysModeProperty, modelBoundsProperty, modelViewTransform );

    // create the light rays associated with the object
    const lightRaysNode = new LightRaysNode( model.firstLightRays, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, {
        realRayStrokes: GeometricOpticsColors.realRays1StrokeProperty,
        virtualRaysStroke: GeometricOpticsColors.virtualRays1StrokeProperty
      } );

    // create the light rays associated with the second source
    const secondSourceLightRaysNode = new LightRaysNode( model.secondLightRays, model.representationProperty,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform, {
        realRayStrokes: GeometricOpticsColors.realRays2StrokeProperty,
        virtualRaysStroke: GeometricOpticsColors.virtualRays2StrokeProperty,
        visibleProperty: visibleProperties.secondSourceVisibleProperty
      } );

    // create the target image
    const targetNode = new TargetNode( model.representationProperty, model.firstTarget, model.optic,
      visibleProperties.virtualImageVisibleProperty, modelViewTransform );

    // create two focal points
    const focalPointsLayer = new Node( {
      children: [
        new FocalPointNode( model.leftFocalPoint, modelViewTransform ),
        new FocalPointNode( model.rightFocalPoint, modelViewTransform )
      ],
      visibleProperty: visibleProperties.focalPointVisibleProperty
    } );

    // Layer for all the Nodes within the "play area".
    // The play area is subject to zoom in/out, so add all Nodes that need to be zoomed.
    const playAreaNode = new Node( {
      children: [
        opticalAxisLine,
        sourceObjectNode,
        opticNode,
        targetNode,
        lightRaysNode,
        secondSourceLightRaysNode,
        secondSourceNode,
        focalPointsLayer
      ]
    } );

    // scale the playAreaNode
    zoomLevelProperty.lazyLink( ( zoomLevel, oldZoomLevel ) => {

      // scaling factor between zoom levels
      const relativeScale = this.getRelativeScale( zoomLevel, oldZoomLevel );

      // offset of the play areaNode such that the origin point remains fixed through zoom
      const translateVector = ORIGIN_POINT.times( 1 / relativeScale - 1 );

      // scale and translate the playArea
      playAreaNode.scale( relativeScale );
      playAreaNode.translate( translateVector );
    } );

    Property.multilink(
      [ model.raysModeProperty, visibleProperties.rayTracingVisibleProperty ],
      ( raysMode, rayTracingVisible ) => {
        if ( raysMode === RaysMode.NONE ) {
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

    // Add points at position of optic, source, and target.
    if ( GeometricOpticsQueryParameters.showDebugPoints ) {
      const options = { fill: 'red' };
      playAreaNode.addChild( new DebugPointNode( model.firstTarget.positionProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( model.sourceObject.positionProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( model.optic.positionProperty, modelViewTransform, options ) );
    }

    // Add points at a distance 2f on each side of optic
    if ( GeometricOpticsQueryParameters.show2fPoints ) {
      const left2fProperty = new DerivedProperty( [ model.leftFocalPoint.positionProperty ], position => position.timesScalar( 2 ) );
      const right2fProperty = new DerivedProperty( [ model.rightFocalPoint.positionProperty ], position => position.timesScalar( 2 ) );
      const options = { fill: GeometricOpticsColors.focalPointFillProperty };
      playAreaNode.addChild( new DebugPointNode( left2fProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( right2fProperty, modelViewTransform, options ) );
    }

    // Show the value of modelBoundsProperty
    if ( GeometricOpticsQueryParameters.showDragBounds ) {
      const dragBoundsNode = new Rectangle( modelViewTransform.modelToViewBounds( modelBoundsProperty.value ), {
        stroke: 'green',
        lineWidth: 2
      } );
      playAreaNode.addChild( dragBoundsNode );
      modelBoundsProperty.link( modelBounds => {
        const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
        dragBoundsNode.setRect( viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height );
      } );
    }

    // Layout ================================================================================================

    this.addChild( playAreaNode );
    this.addChild( labelsNode );
    this.addChild( curveRadioButtonGroup );
    this.addChild( controlPanel );
    this.addChild( showHideToggleButton );
    this.addChild( resetAllButton );
    this.addChild( toolbox );
    this.addChild( zoomButtonGroup );
    this.addChild( representationComboBox );
    this.addChild( rulersLayer );
    this.addChild( popupsParent );

    // @private
    this.resetGeometricScreenView = () => {
      zoomLevelProperty.reset();
      visibleProperties.reset();
      sourceObjectNode.reset();
      secondSourceNode.reset();
      rulersLayer.reset();
    };

    // @private
    this.model = model; // {GeometricOpticsModel}

    // @protected
    this.modelViewTransform = modelViewTransform; // {ModelViewTransform2}
    this.visibleProperties = visibleProperties; // {VisibleProperties}
    this.modelBoundsProperty = modelBoundsProperty; // {DerivedProperty.<Bounds2>}
    this.playAreaNode = playAreaNode; // {Node}
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.resetGeometricScreenView();
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
   * @private
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
   * Returns a model-view transform appropriate for the zoom level
   * @private
   * @param {number} zoomLevel
   * @returns {ModelViewTransform2}
   */
  getZoomTransform( zoomLevel ) {

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