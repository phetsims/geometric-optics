// Copyright 2022, University of Colorado Boulder

/**
 * PositionMarkerIcon is a position-marker icon that appears in the toolbox. It is associated with a specific
 * position-marker Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../../geometricOptics.js';
import PositionMarkerNode from './PositionMarkerNode.js';
import MapMarkerNode from '../MapMarkerNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOToolIcon, { GOToolIconOptions } from './GOToolIcon.js';
import PositionMarker from '../../model/tools/PositionMarker.js';

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
      scale: 0.8, // slightly smaller for toolbox icon
      tagName: 'button' // contentNode is the button, what gets focus
    } );

    const pointerPositionToToolPosition = ( pointerPosition: Vector2 ) => {
      const zoomTransform = zoomTransformProperty.value;
      const viewPosition = positionMarkerNode.globalToParentPoint( pointerPosition );
      const x = viewPosition.x;
      const y = viewPosition.y - positionMarkerNode.height;
      return zoomTransform.viewToModelXY( x, y );
    };

    super( contentNode, positionMarker, positionMarkerNode, zoomTransformProperty, pointerPositionToToolPosition,
      providedOptions );
  }
}

geometricOptics.register( 'PositionMarkerIcon', PositionMarkerIcon );
export default PositionMarkerIcon;