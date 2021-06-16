// Copyright 2021, University of Colorado Boulder

/**
 * Common screen view for the simulation
 *
 * @author Martin Veillette
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EyeToggleButton from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import FocalPoint from '../model/FocalPoint.js';
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import CurveControl from './CurveControl.js';
import FocalPointNode from './FocalPointNode.js';
import GeometricOpticsControlPanel from './GeometricOpticsControlPanel.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';
import LabelsNode from './LabelsNode.js';
import LightRaysNode from './LightRaysNode.js';
import OpticalAxisLine from './OpticalAxisLine.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetImageNode from './TargetImageNode.js';
import ToolboxPanel from './ToolboxPanel.js';
import TrackingDiskNode from './TrackingDiskNode.js';
import VisibleProperties from './VisibleProperties.js';

const SCREEN_VIEW_X_MARGIN = GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN;
const SCREEN_VIEW_Y_MARGIN = GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN;
const ZOOM_RANGE = GeometricOpticsConstants.ZOOM_RANGE;
const ZOOM_SCALE_FACTOR = GeometricOpticsConstants.ZOOM_SCALE_FACTOR;

class GeometricOpticsScreenView extends ScreenView {

  /**
   * @param {GeometricOpticsModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof GeometricOpticsModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    const centerPoint = this.layoutBounds.getCenter();

    // @protected create a Y inverted modelViewTransform with isometric scaling along X and Y
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( centerPoint, 200, -200 );

    // convenience variable for laying out scenery nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY( SCREEN_VIEW_X_MARGIN, SCREEN_VIEW_Y_MARGIN );

    // @protected create visible properties associated with checkboxes
    this.visibleProperties = new VisibleProperties( tandem );

    // @private {Property.<number>} property that controls zoom in play area
    this.zoomLevelProperty = new NumberProperty( ZOOM_RANGE.defaultValue, { range: ZOOM_RANGE } );

    //----------------------------------------------------------------------
    //                          scenery nodes for play area

    // @protected layer for all the nodes within the play area: Play area layer is subject to zoom in/out
    this.playAreaNode = new Node();

    // @private create the source/object on the left hand side of screen
    this.sourceObjectNode = new SourceObjectNode( model.representationProperty,
      model.sourceObject, this.visibleProperties.visibleMovablePointProperty, this.modelViewTransform, tandem );

    // create the optical axis attached to the optical element
    const opticalAxisLine = new OpticalAxisLine( model.optic.positionProperty,
      this.layoutBounds, this.modelViewTransform );

    // create the light rays associated with the object
    const lightRaysNode = new LightRaysNode( model.lightRays,
      this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );

    // create the light rays associated with the movable point
    const movableLightRaysNode = new LightRaysNode( model.movableLightRays,
      this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );

    // the movable light rays visibility is tied to the status of the checkbox
    this.visibleProperties.visibleMovablePointProperty.linkAttribute( movableLightRaysNode, 'visible' );

    // create the target image
    const targetImageNode = new TargetImageNode( model.representationProperty,
      model.targetImage, model.optic, this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );

    // create two focal points
    const firstFocalPointNode = new FocalPointNode( model.firstFocalPoint,
      this.visibleProperties.visibleFocalPointProperty, this.modelViewTransform, tandem );
    const secondFocalPointNode = new FocalPointNode( model.secondFocalPoint,
      this.visibleProperties.visibleFocalPointProperty, this.modelViewTransform, tandem );
    const focalPointsLayer = new Node( { children: [ firstFocalPointNode, secondFocalPointNode ] } );

    // add children that need to be zoomed in/out. order is important
    this.playAreaNode.addChild( opticalAxisLine );
    this.playAreaNode.addChild( this.sourceObjectNode );
    this.playAreaNode.addChild( targetImageNode );
    this.playAreaNode.addChild( focalPointsLayer );
    this.playAreaNode.addChild( lightRaysNode );
    this.playAreaNode.addChild( movableLightRaysNode );


    // @private scale the playAreaNode
    this.zoomLevelProperty.lazyLink( ( zoomLevel, oldZoomLevel ) => {

      // TODO: works, but this is a very clumsy way to scale.
      // TODO: combine the two Node transformations
      // TODO: find a way to stop relying on oldZoomLevel
      const scale = GeometricOpticsScreenView.scaleFunction( zoomLevel );
      const oldScale = GeometricOpticsScreenView.scaleFunction( oldZoomLevel );
      const relativeScale = scale / oldScale;
      const translateVector = centerPoint.times( 1 / relativeScale - 1 );
      this.playAreaNode.scale( relativeScale );
      this.playAreaNode.translate( translateVector );

    } );

    //----------------------------------------------------------------------------
    //               Buttons, Controls and Panels

    // create control panel at the bottom of the screen
    const geometricOpticsControlPanel = new GeometricOpticsControlPanel( model.optic,
      model.lightRayModeProperty, this.visibleProperties, this.modelViewTransform, tandem,
      { hasLens: model.optic.isLens() } );
    geometricOpticsControlPanel.centerBottom = erodedLayoutBounds.centerBottom;

    // @private create rulers
    // TODO: pass in toolbox bounds
    this.horizontalRulerNode = new GeometricOpticsRulerNode( model.horizontalRuler,
      this.visibleProperties.visibleRulersProperty, this.zoomLevelProperty, this.layoutBounds, this.modelViewTransform );
    this.verticalRulerNode = new GeometricOpticsRulerNode( model.verticalRuler,
      this.visibleProperties.visibleRulersProperty, this.zoomLevelProperty, this.layoutBounds, this.modelViewTransform );

    // create toolbox panel at the top right corner of the screen
    const toolboxPanel = new ToolboxPanel( this.horizontalRulerNode, tandem );
    toolboxPanel.rightTop = erodedLayoutBounds.rightTop;


    // create the control buttons to toggle between convex and concave optic at the left bottom
    const curveControl = new CurveControl( model.optic.curveProperty, model.optic );
    curveControl.leftBottom = erodedLayoutBounds.leftBottom;

    // create the combo box at the right top below the toolbox panel.
    const comboBox = new RepresentationComboBox( model.representationProperty, tandem,
      { hasLens: model.optic.isLens() } );
    comboBox.rightTop = toolboxPanel.rightBottom.plusXY( 0, 5 );

    // create magnifying buttons for zooming in and out at the left top
    const magnifyingGlassZoomButtonGroup = new MagnifyingGlassZoomButtonGroup( this.zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: 8,
      magnifyingGlassNodeOptions: {
        glassRadius: 8
      }
    } );
    magnifyingGlassZoomButtonGroup.leftTop = erodedLayoutBounds.leftTop;

    // create reset all button at the right bottom
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // create the eyeToggle button above the reset all button
    const eyeToggleButton = new EyeToggleButton( this.visibleProperties.visibleRayTracingProperty,
      { baseColor: 'yellow' } );
    eyeToggleButton.centerBottom = resetAllButton.centerTop.plusXY( 0, -8 );

    // labels
    const labelsNode = new LabelsNode( model, this, this.visibleProperties, this.modelViewTransform, this.zoomLevelProperty );

    // add playAreaNode and controls to the scene graph
    this.addChild( magnifyingGlassZoomButtonGroup );
    this.addChild( comboBox );
    this.addChild( curveControl );
    this.addChild( geometricOpticsControlPanel );
    this.addChild( toolboxPanel );
    this.addChild( eyeToggleButton );
    this.addChild( resetAllButton );
    this.addChild( this.playAreaNode );
    this.addChild( labelsNode );
    this.addChild( this.horizontalRulerNode );
    this.addChild( this.verticalRulerNode );

    //------------------------------------------------------------
    //                  Query Parameters

    // add disks at position of optic, source and target
    if ( GeometricOpticsQueryParameters.showDebugPoints ) {
      this.addChild( new TrackingDiskNode( model.targetImage.positionProperty, this.modelViewTransform, tandem,
        { fill: 'magenta' } ) );
      this.addChild( new TrackingDiskNode( model.sourceObject.positionProperty, this.modelViewTransform, tandem,
        { fill: 'magenta' } ) );
      this.addChild( new TrackingDiskNode( model.optic.positionProperty, this.modelViewTransform, tandem,
        { fill: 'magenta' } ) );
    }

    // add disks at a distance 2f for optic on each side of optic
    if ( GeometricOpticsQueryParameters.show2fPoints ) {
      const minus2fPoint = new FocalPoint( model.optic.positionProperty, model.optic.focalLengthProperty, tandem,
        { multiplicativeFactor: -2 } );
      const plus2fPoint = new FocalPoint( model.optic.positionProperty, model.optic.focalLengthProperty, tandem,
        { multiplicativeFactor: 2 } );
      this.addChild( new TrackingDiskNode( minus2fPoint.positionProperty, this.modelViewTransform, tandem,
        { fill: 'black' } ) );
      this.addChild( new TrackingDiskNode( plus2fPoint.positionProperty, this.modelViewTransform, tandem,
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
    this.horizontalRulerNode.reset();
    this.verticalRulerNode.reset();
  }


  /**
   * Scale function
   * @public
   *
   * @returns {number}
   */
  static scaleFunction( zoomLevel ) {
    return Math.pow( ZOOM_SCALE_FACTOR, zoomLevel );
  }
}


geometricOptics.register( 'GeometricOpticsScreenView', GeometricOpticsScreenView );
export default GeometricOpticsScreenView;
