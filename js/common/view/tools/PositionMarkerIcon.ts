// Copyright 2022, University of Colorado Boulder

/**
 * PositionMarkerIcon is a position-marker icon that appears in the toolbox. It is associated with a specific
 * position-marker Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../../geometricOptics.js';
import PositionMarkerNode from './PositionMarkerNode.js';
import MapMarkerNode from '../MapMarkerNode.js';
import GOToolIcon from './GOToolIcon.js';
import PositionMarker from '../../model/tools/PositionMarker.js';

export default class PositionMarkerIcon extends GOToolIcon {

  /**
   * @param positionMarker - model element
   * @param positionMarkerNode - view element
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   */
  public constructor( positionMarker: PositionMarker,
                      positionMarkerNode: PositionMarkerNode,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    // GOToolIconOptions
    const options = {
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5
    };

    const contentNode = new MapMarkerNode( {
      fill: positionMarker.fill,
      stroke: positionMarker.stroke,
      scale: 0.8 // slightly smaller for toolbox icon
    } );

    const pointerPositionToToolPosition = ( pointerPosition: Vector2 ) => {
      const zoomTransform = zoomTransformProperty.value;
      const viewPosition = positionMarkerNode.globalToParentPoint( pointerPosition );
      const x = viewPosition.x;
      const y = viewPosition.y - positionMarkerNode.height;
      return zoomTransform.viewToModelXY( x, y );
    };

    super( contentNode, positionMarker, positionMarkerNode, zoomTransformProperty, pointerPositionToToolPosition,
      options );
  }
}

geometricOptics.register( 'PositionMarkerIcon', PositionMarkerIcon );