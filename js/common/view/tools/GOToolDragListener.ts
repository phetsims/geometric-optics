// Copyright 2022, University of Colorado Boulder

/**
 * GOToolDragListener is the DragListener for use with Geometric Optics tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, DragListenerOptions, PressedDragListener } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import GOToolNode from './GOToolNode.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import GOTool from '../../model/tools/GOTool.js';

type GOToolDragListenerOptions = PickRequired<DragListenerOptions<PressedDragListener>, 'tandem'> &
  PickOptional<DragListenerOptions<PressedDragListener>, 'offsetPosition'>;

export default class GOToolDragListener extends DragListener {

  /**
   * @param tool
   * @param toolNode
   * @param zoomTransformProperty
   * @param dragBoundsProperty
   * @param shouldReturnToToolbox - given the pointer's position, determine whether tool should be returned to toolbox
   * @param providedOptions
   */
  constructor( tool: GOTool,
               toolNode: GOToolNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               dragBoundsProperty: IReadOnlyProperty<Bounds2>,
               shouldReturnToToolbox: ( pointerPoint: Vector2 ) => boolean,
               providedOptions: GOToolDragListenerOptions ) {

    // options.end will get a null event if the drag is interrupted, which can definitely happen with multitouch.
    // So keep track of where the pointer is.
    let previousPointerPoint: Vector2 = Vector2.ZERO;

    const options = optionize<GOToolDragListenerOptions, {}, DragListenerOptions<PressedDragListener>>( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: tool.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: zoomTransformProperty.value,
      start: () => toolNode.moveToFront(),
      drag: event => {
        previousPointerPoint = event.pointer.point;
      },
      end: event => {
        const point = event ? event.pointer.point : previousPointerPoint;
        if ( shouldReturnToToolbox( point ) ) {
          tool.isInToolboxProperty.value = true;
        }
      }
    }, providedOptions );

    super( options );

    // When the transform changes, update this listener.
    zoomTransformProperty.link( zoomTransform => {
      this.transform = zoomTransform;
    } );
  }
}

geometricOptics.register( 'GOToolDragListener', GOToolDragListener );