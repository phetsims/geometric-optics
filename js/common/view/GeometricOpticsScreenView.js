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
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
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
import OpticalAxis from './OpticalAxis.js';
import OpticNode from './OpticNode.js';
import OpticVerticalAxis from './OpticVerticalAxis.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import RulersToolbox from './RulersToolbox.js';
import SecondPointNode from './SecondPointNode.js';
import ShowHideToggleButton from './ShowHideToggleButton.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetNode from './TargetNode.js';
import VisibleProperties from './VisibleProperties.js';

// constants
const X_MARGIN = 20;
const Y_MARGIN = 15;
const ZOOM_RANGE = new RangeWithValue( 1, 3, 3 );
const NOMINAL_VIEW_MODEL_CONVERSION = 2; // view coordinates per cm in initial zoom level

class GeometricOpticsScreenView extends ScreenView {

  /**
   * @param {GeometricOpticsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof GeometricOpticsModel );

    options = merge( {

      // Workaround for things shifting around while dragging
      // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/geometric-optics/issues/213
      preventFit: true,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // View position of the model's origin, slightly above center of the layoutBounds.
    const viewOrigin = new Vector2( this.layoutBounds.centerX, this.layoutBounds.centerY - 0.08 * this.layoutBounds.height );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY( X_MARGIN, Y_MARGIN );

    // Create a Y inverted modelViewTransform with isometric scaling along x and y axes.
    // In the model coordinate frame, +x is right, +y is up.
    const modelViewTransform = this.getTransformForZoomLevel( ZOOM_RANGE.defaultValue, viewOrigin );

    // Properties  ====================================================================================================

    // Create visibleProperty instances for Nodes in the view.
    const visibleProperties = new VisibleProperties( model.optic.opticType, {
      tandem: options.tandem.createTandem( 'visibleProperties' )
    } );

    // {Property.<number>} controls zoom in play area
    const zoomLevelProperty = new NumberProperty( ZOOM_RANGE.defaultValue, { range: ZOOM_RANGE } );

    // {DerivedProperty.<ModelViewTransform2>}
    const zoomTransformProperty = new DerivedProperty(
      [ zoomLevelProperty ],
      zoomLevel => this.getTransformForZoomLevel( zoomLevel, viewOrigin )
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
      model.raysModeProperty, visibleProperties, {
        tandem: options.tandem.createTandem( 'controlPanel' )
      } );
    controlPanel.boundsProperty.link( () => {
      controlPanel.centerBottom = erodedLayoutBounds.centerBottom;
    } );

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

    // the source object or first light source
    const sourceObjectNode = new SourceObjectNode( model.representationProperty, model.sourceObject,
      modelBoundsProperty, model.optic.positionProperty, modelViewTransform );

    // the second point or second light source
    const secondPointNode = new SecondPointNode( model.representationProperty, model.secondPoint,
      sourceObjectNode.dragBoundsProperty, modelViewTransform, {
        visibleProperty: visibleProperties.secondPointVisibleProperty
      } );

    const opticalAxis = new OpticalAxis( model.optic.positionProperty, modelBoundsProperty, modelViewTransform );

    const opticNode = new OpticNode( model.optic, modelBoundsProperty, modelViewTransform, {
      tandem: options.tandem.createTandem( 'opticNode' )
    } );

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
      visibleProperties.virtualImageVisibleProperty, modelViewTransform );

    // create two focal points
    const focalPointsLayer = new Node( {
      children: [
        new FocalPointNode( model.leftFocalPoint, modelViewTransform ),
        new FocalPointNode( model.rightFocalPoint, modelViewTransform )
      ],
      visibleProperty: visibleProperties.focalPointsVisibleProperty
    } );

    // Layer for all the Nodes within the "play area".
    // The play area is subject to zoom in/out, so add all Nodes that need to be zoomed.
    const playAreaNode = new Node( {
      children: [
        opticalAxis,
        sourceObjectNode,
        opticNode,
        opticVerticalAxis,
        targetNode,
        lightRaysNode,
        secondPointLightRaysNode,
        secondPointNode,
        focalPointsLayer
      ]
    } );

    // Handle zoom level.
    zoomLevelProperty.lazyLink( ( zoomLevel, oldZoomLevel ) => {

      // Scale the play area.
      const relativeScale = this.getRelativeScale( zoomLevel, oldZoomLevel );
      playAreaNode.scale( relativeScale );

      // Translate the play areaNode such that the origin point remains fixed through zoom levels.
      const translateVector = viewOrigin.times( 1 / relativeScale - 1 );
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

    // Add points at the position of things that move around.
    if ( GeometricOpticsQueryParameters.showPositions ) {
      const options = { fill: 'red' };
      playAreaNode.addChild( new DebugPointNode( model.optic.positionProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( model.sourceObject.positionProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( model.secondPoint.lightSourcePositionProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( model.firstTarget.positionProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( model.projectionScreen.positionProperty, modelViewTransform, options ) );
    }

    // Add points at a distance 2f on each side of optic
    if ( GeometricOpticsQueryParameters.show2f ) {
      const left2fProperty = new DerivedProperty( [ model.leftFocalPoint.positionProperty ], position => position.timesScalar( 2 ) );
      const right2fProperty = new DerivedProperty( [ model.rightFocalPoint.positionProperty ], position => position.timesScalar( 2 ) );
      const options = { fill: GeometricOpticsColors.focalPointFillProperty };
      playAreaNode.addChild( new DebugPointNode( left2fProperty, modelViewTransform, options ) );
      playAreaNode.addChild( new DebugPointNode( right2fProperty, modelViewTransform, options ) );
    }

    // Show the value of modelBoundsProperty
    if ( GeometricOpticsQueryParameters.showModelBounds ) {
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
      secondPointNode.reset();
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
   * Returns the relative scale between a zoom level and a previous old zoom level
   * @private
   * @param {number} zoomLevel
   * @param {number} oldZoomLevel
   * @returns {number}
   */
  getRelativeScale( zoomLevel, oldZoomLevel ) {
    const base = 2;
    const scale = Math.pow( base, zoomLevel );
    const oldScale = Math.pow( base, oldZoomLevel );
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
   * @param {Vector2} viewOrigin
   * @returns {ModelViewTransform2}
   */
  getTransformForZoomLevel( zoomLevel, viewOrigin ) {

    // scaling factor between zoom level measured from the initial zoom level
    const absoluteScale = this.getAbsoluteScale( zoomLevel );

    // number of view coordinates for 1 model coordinate
    const viewModelScale = NOMINAL_VIEW_MODEL_CONVERSION * absoluteScale;

    // create a Y inverted modelViewTransform with isometric scaling along X and Y
    return ModelViewTransform2.createOffsetXYScaleMapping( viewOrigin, viewModelScale, -viewModelScale );
  }
}

geometricOptics.register( 'GeometricOpticsScreenView', GeometricOpticsScreenView );
export default GeometricOpticsScreenView;