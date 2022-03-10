// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/355 factor out duplication into GOToolIcon
/**
 * PositionMarkerIcon is a position-marker icon that appears in the toolbox. It is associated with a specific
 * position-marker Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, PressListenerEvent } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import PositionMarkerNode from './PositionMarkerNode.js';
import MapMarkerNode from '../MapMarkerNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import PositionMarker from '../../model/tools/PositionMarker.js';
import GOToolIcon, { GOToolIconOptions } from './GOToolIcon.js';

type PositionMarkerIconOptions = PickRequired<GOToolIconOptions, 'tandem'>;

class PositionMarkerIcon extends GOToolIcon {

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

    const contentNode = new MapMarkerNode( {
      fill: positionMarker.fill,
      stroke: positionMarker.stroke,
      scale: 0.8 // slightly smaller for toolbox icon
    } );

    super( contentNode, positionMarkerNode, zoomTransformProperty, providedOptions );

    // Dragging with mouse/touch. Drag events are forwarded from the icon to its associated tool.
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
  }
}

geometricOptics.register( 'PositionMarkerIcon', PositionMarkerIcon );
export default PositionMarkerIcon;