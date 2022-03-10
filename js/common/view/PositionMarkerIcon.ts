// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/355 factor out duplication into GOToolIcon
/**
 * PositionMarkerIcon is a position-marker icon that appears in the toolbox. It is associated with a specific
 * position-marker Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, Node, NodeOptions, PressListenerEvent } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import PositionMarkerNode from './PositionMarkerNode.js';
import MapMarkerNode from './MapMarkerNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PositionMarker from '../model/PositionMarker.js';

type SelfOptions = {
  touchAreaDilationX?: number;
  touchAreaDilationY?: number;
  mouseAreaDilationX?: number;
  mouseAreaDilationY?: number;
};

type PositionMarkerIconOptions = SelfOptions & PickRequired<Node, 'tandem'>;

class PositionMarkerIcon extends Node {

  /**
   * @param positionMarker
   * @param positionMarkerNode
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( positionMarker: PositionMarker,
               positionMarkerNode: PositionMarkerNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: PositionMarkerIconOptions ) {

    const mapMarkerNode = new MapMarkerNode( {
      fill: positionMarker.fill,
      stroke: positionMarker.stroke,
      scale: 0.8 // slightly smaller for toolbox icon
    } );

    const options = optionize<PositionMarkerIconOptions, SelfOptions, NodeOptions>( {

      // pointer areas
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5,

      // NodeOptions
      children: [ mapMarkerNode ],
      cursor: 'pointer',
      tagName: 'button'
    }, providedOptions );

    super( options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    // Change visibility of  mapMarkerNode instead of this, so that iO clients can hide icons in toolbox.
    positionMarker.isInToolboxProperty.link( isInToolbox => {
      mapMarkerNode.visible = isInToolbox;
    } );

    // Dragging with mouse/touch. Drag events are forwarded from the icon to its associated ruler.
    this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {

      // Take the marker out of the toolbox.
      positionMarker.isInToolboxProperty.value = false;

      // Set position of the marker so that the pointer is initially at the centerBottom of positionMarkerNode.
      assert && assert( event.pointer.point ); // {Vector2|null}
      const zoomTransform = zoomTransformProperty.value;
      const viewPosition = positionMarkerNode.globalToParentPoint( event.pointer.point! );
      const x = viewPosition.x;
      const y = viewPosition.y - positionMarkerNode.height;
      positionMarker.positionProperty.value = zoomTransform.viewToModelXY( x, y );

      // Forward events to the PositionMarkerNode.
      positionMarkerNode.startDrag( event );
    } ) );

    // When the icon is clicked via the keyboard, take the marker out of the toolbox, and place it at the model origin.
    this.addInputListener( {
      click: () => {
        positionMarker.isInToolboxProperty.value = false;
        positionMarker.positionProperty.value = Vector2.ZERO;
        positionMarkerNode.focus();
      }
    } );
  }
}

geometricOptics.register( 'PositionMarkerIcon', PositionMarkerIcon );
export default PositionMarkerIcon;