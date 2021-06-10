// Copyright 2021, University of Colorado Boulder

/**
 * Common screen view for the simulation
 *
 * @author Martin Veillette
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import FocalPoint from '../model/FocalPoint.js';
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import ControlPanel from './ControlPanel.js';
import CurveControl from './CurveControl.js';
import FocalPointNode from './FocalPointNode.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';
import LightRaysNode from './LightRaysNode.js';
import OpticalAxisLine from './OpticalAxisLine.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetImageNode from './TargetImageNode.js';
import TrackingDiskNode from './TrackingDiskNode.js';
import VisibleProperties from './VisibleProperties.js';

const ZOOM_DEFAULT = GeometricOpticsConstants.ZOOM_RANGE.defaultValue;
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

    // @protected create visible properties associated with checkboxes
    this.visibleProperties = new VisibleProperties( tandem );

    // @private {Property.<number>} property that controls zoom in play area
    this.zoomLevelProperty = new NumberProperty( ZOOM_DEFAULT, { range: GeometricOpticsConstants.ZOOM_RANGE } );

    // create magnifying buttons for zooming in and out
    const magnifyingGlassZoomButtonGroup = new MagnifyingGlassZoomButtonGroup( this.zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: 8,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5,
      magnifyingGlassNodeOptions: {
        glassRadius: 8  // like ZoomButton,
      }
    } );

    // @private create the source/object on the left hand side of screen
    this.sourceObjectNode = new SourceObjectNode( model.representationProperty,
      model.sourceObject, this.visibleProperties.visibleMovablePointProperty, this.modelViewTransform, tandem );

    // create the optical axis attached to the optical element
    const opticalAxisLine = new OpticalAxisLine( model.optic.positionProperty,
      ScreenView.DEFAULT_LAYOUT_BOUNDS, this.modelViewTransform );

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

    // @private create rulers
    this.horizontalRulerNode = new GeometricOpticsRulerNode( model.horizontalRuler,
      this.visibleProperties.visibleRulersProperty, this.dragBoundsProperty, this.modelViewTransform );
    this.verticalRulerNode = new GeometricOpticsRulerNode( model.verticalRuler,
      this.visibleProperties.visibleRulersProperty, this.dragBoundsProperty, this.modelViewTransform );

    // create control panel at the bottom of the screen
    const controlPanel = new ControlPanel( model.optic,
      model.lightRayModeProperty, this.visibleProperties, this.modelViewTransform, tandem,
      { hasLens: model.optic.isLens() } );
    controlPanel.centerBottom = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded(
      GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).centerBottom;

    // create the control buttons to toggle between convex and concave optic
    const curveControl = new CurveControl( model.optic.curveProperty, model.optic );
    this.addChild( curveControl );
    curveControl.leftBottom = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded(
      GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).leftBottom;

    // @protected layer for all the nodes within the play area: Play are ode is subject to zoom in and out
    this.playAreaNode = new Node();

    // add children that need to be zoomed in/out. order is important
    this.playAreaNode.addChild( opticalAxisLine );
    this.playAreaNode.addChild( this.sourceObjectNode );
    this.playAreaNode.addChild( targetImageNode );
    this.playAreaNode.addChild( focalPointsLayer );
    this.playAreaNode.addChild( lightRaysNode );
    this.playAreaNode.addChild( movableLightRaysNode );
    this.playAreaNode.addChild( this.horizontalRulerNode );
    this.playAreaNode.addChild( this.verticalRulerNode );

    const comboBox = new RepresentationComboBox( model.representationProperty, tandem,
      { hasLens: model.optic.isLens() } );

    // @private scale the playAreaNode
    this.zoomLevelProperty.link( ( zoomLevel, oldZoomLevel ) => {

      // TODO: works, but this is a very clumsy way to scale.
      // TODO: combine the two Node transformations
      // TODO: find a way to stop relying on oldZoomLevel
      if ( oldZoomLevel ) {
        const scale = Math.pow( ZOOM_SCALE_FACTOR, zoomLevel - oldZoomLevel );
        const translateVector = centerPoint.times( 1 / scale - 1 );
        this.playAreaNode.scale( scale );
        this.playAreaNode.translate( translateVector );
      }
    } );

    this.addChild( magnifyingGlassZoomButtonGroup );
    this.addChild( this.playAreaNode );
    this.addChild( comboBox );
    this.addChild( controlPanel );

    comboBox.rightTop = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).rightTop;
    magnifyingGlassZoomButtonGroup.top = 10;
    magnifyingGlassZoomButtonGroup.left = 10;

    // create reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

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
}

geometricOptics.register( 'GeometricOpticsScreenView', GeometricOpticsScreenView );
export default GeometricOpticsScreenView;
