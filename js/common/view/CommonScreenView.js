// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import CommonModel from '../model/CommonModel.js';
import ControlPanel from './ControlPanel.js';
import FocalPointsNode from './FocalPointsNode.js';
import LensNode from './LensNode.js';
import LightRaysNode from './LightRaysNode.js';
import SourceObjectNode from './SourceObjectNode.js';
import TargetImageNode from './TargetImageNode.js';
import VisibleProperties from './VisibleProperties.js';
import SourceObjectComboBox from './SourceObjectComboBox.js';

const ZOOM_DEFAULT = GeometricOpticsConstants.ZOOM_RANGE.defaultValue;
const SCALE_FACTOR = 4 / 3;

class CommonScreenView extends ScreenView {

  /**
   * @param {CommonModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof CommonModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    const centerPoint = ScreenView.DEFAULT_LAYOUT_BOUNDS.getCenter();

    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( centerPoint, 200, -200 );

    this.visibleProperties = new VisibleProperties( tandem );

    const sourceObjectNode = new SourceObjectNode( model.sourceObject, this.visibleProperties.visibleMovablePointProperty, this.modelViewTransform, tandem );
    const lensNode = new LensNode( model.lens, this.modelViewTransform, tandem );
    const lightRaysNode = new LightRaysNode( model.lightRays, this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );
    const targetImageNode = new TargetImageNode( model.targetImage, this.visibleProperties.visibleVirtualImageProperty, this.modelViewTransform, tandem );

    const focalPointsNode = new FocalPointsNode( model.lens, this.modelViewTransform, tandem );

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

    // create control panel
    const controlPanel = new ControlPanel( model.lens, model.lightRays, this.visibleProperties, this.modelViewTransform, tandem );

    // layer for all the nodes within the play area
    const playAreaNode = new Node();

    playAreaNode.addChild( sourceObjectNode );
    playAreaNode.addChild( lensNode );
    playAreaNode.addChild( targetImageNode );
    playAreaNode.addChild( focalPointsNode );
    playAreaNode.addChild( lightRaysNode );

    this.visibleProperties.visibleFocalPointProperty.linkAttribute( focalPointsNode, 'visible' );

    const comboBox = new SourceObjectComboBox( model.sourceObject.typeProperty, tandem );


    // scale the playAreaNode
    this.zoomLevelProperty.link( ( zoomLevel, oldZoomLevel ) => {

      // TODO: works, but this is a very clumsy way to scale.
      // TODO: combine the two Node transformations
      // TODO: find a way to stop relying on oldZoomLevel
      if ( oldZoomLevel ) {
        const scale = Math.pow( SCALE_FACTOR, zoomLevel - oldZoomLevel );
        const translateVector = centerPoint.times( 1 / scale - 1 );
        playAreaNode.scale( scale );
        playAreaNode.translate( translateVector );
      }
    } );

    this.addChild( magnifyingGlassZoomButtonGroup );
    this.addChild( controlPanel );
    this.addChild( playAreaNode );
    this.addChild( comboBox );


    controlPanel.centerBottom = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).centerBottom;
    comboBox.rightTop = ScreenView.DEFAULT_LAYOUT_BOUNDS.eroded( GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN ).rightTop;
    magnifyingGlassZoomButtonGroup.top = 10;
    magnifyingGlassZoomButtonGroup.left = 10;
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.zoomLevelProperty.reset();
    this.visibleProperties.reset();
  }

}

geometricOptics.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;
