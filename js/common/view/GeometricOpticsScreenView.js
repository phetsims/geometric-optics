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
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import ControlPanel from './ControlPanel.js';
import FocalPointNode from './FocalPointNode.js';
import LightRaysNode from './LightRaysNode.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetImageNode from './TargetImageNode.js';
import TrackingDiskNode from './TrackingDiskNode.js';
import VisibleProperties from './VisibleProperties.js';
import RepresentationComboBox from './RepresentationComboBox.js';
import OpticalAxisNode from './OpticalAxisNode.js';

const ZOOM_DEFAULT = GeometricOpticsConstants.ZOOM_RANGE.defaultValue;
const SCALE_FACTOR = 4 / 3;

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

    const centerPoint = ScreenView.DEFAULT_LAYOUT_BOUNDS.getCenter();

    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( centerPoint, 200, -200 );

    this.visibleProperties = new VisibleProperties( tandem );

    this.sourceObjectNode = new SourceObjectNode( model.representationProperty, model.sourceObject, this.visibleProperties.visibleMovablePointProperty, this.modelViewTransform, tandem );

    const opticalAxisNode = new OpticalAxisNode( model.optic.positionProperty, this.modelViewTransform );

    const lightRaysNode = new LightRaysNode( model.lightRays, this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );
    const movableLightRaysNode = new LightRaysNode( model.movableLightRays, this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );

    const targetImageNode = new TargetImageNode( model.representationProperty, model.targetImage, model.optic, this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );

    const firstFocalPointNode = new FocalPointNode( model.firstFocalPoint, this.visibleProperties.visibleFocalPointProperty, this.modelViewTransform, tandem );
    const secondFocalPointNode = new FocalPointNode( model.secondFocalPoint, this.visibleProperties.visibleFocalPointProperty, this.modelViewTransform, tandem );
    const focalPointsLayer = new Node( { children: [ firstFocalPointNode, secondFocalPointNode ] } );

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

    const controlPanel = new ControlPanel( model.optic, model.lightRayModeProperty, this.visibleProperties, this.modelViewTransform, tandem,
      { hasLens: model.optic.isLens() } );
    this.addChild( controlPanel );
    controlPanel.centerBottom = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).centerBottom;

    // layer for all the nodes within the play area
    this.playAreaNode = new Node();
    this.playAreaNode.addChild( opticalAxisNode );
    this.playAreaNode.addChild( this.sourceObjectNode );
    this.playAreaNode.addChild( targetImageNode );
    this.playAreaNode.addChild( focalPointsLayer );
    this.playAreaNode.addChild( lightRaysNode );
    this.playAreaNode.addChild( movableLightRaysNode );


    this.visibleProperties.visibleMovablePointProperty.linkAttribute( movableLightRaysNode, 'visible' );

    const comboBox = new RepresentationComboBox( model.representationProperty, tandem, { hasLens: model.optic.isLens() } );


    // scale the playAreaNode
    this.zoomLevelProperty.link( ( zoomLevel, oldZoomLevel ) => {

      // TODO: works, but this is a very clumsy way to scale.
      // TODO: combine the two Node transformations
      // TODO: find a way to stop relying on oldZoomLevel
      if ( oldZoomLevel ) {
        const scale = Math.pow( SCALE_FACTOR, zoomLevel - oldZoomLevel );
        const translateVector = centerPoint.times( 1 / scale - 1 );
        this.playAreaNode.scale( scale );
        this.playAreaNode.translate( translateVector );
      }
    } );

    this.addChild( magnifyingGlassZoomButtonGroup );

    this.addChild( this.playAreaNode );
    this.addChild( comboBox );


    comboBox.rightTop = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).rightTop;
    magnifyingGlassZoomButtonGroup.top = 10;
    magnifyingGlassZoomButtonGroup.left = 10;

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


    // add disks at some useful locations
    if ( GeometricOpticsQueryParameters.showDebugPoints ) {
      this.addChild( new TrackingDiskNode( model.targetImage.positionProperty, this.modelViewTransform, tandem, { fill: 'magenta' } ) );
      this.addChild( new TrackingDiskNode( model.sourceObject.positionProperty, this.modelViewTransform, tandem, { fill: 'magenta' } ) );
      this.addChild( new TrackingDiskNode( model.optic.positionProperty, this.modelViewTransform, tandem, { fill: 'magenta' } ) );
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
  }

}

geometricOptics.register( 'GeometricOpticsScreenView', GeometricOpticsScreenView );
export default GeometricOpticsScreenView;
