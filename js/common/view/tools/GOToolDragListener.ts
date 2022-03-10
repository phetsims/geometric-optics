// Copyright 2022, University of Colorado Boulder

/**
 * GOToolKeyboardDragListener is the DragListener for use with Geometric Optics tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, DragListenerOptions, PressedDragListener, PressListenerEvent } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import GOToolNode from './GOToolNode.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';

type GOToolDragListenerOptions = PickRequired<DragListenerOptions<PressedDragListener>, 'tandem'> &
  PickOptional<DragListenerOptions<PressedDragListener>, 'offsetPosition'>;

class GOToolDragListener extends DragListener {

  /**
   * @param toolNode
   * @param zoomTransformProperty
   * @param dragBoundsProperty
   * @param shouldReturnToToolbox - given the pointer's position, determine whether tool should be returned to toolbox
   * @param providedOptions
   */
  constructor( toolNode: GOToolNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               dragBoundsProperty: IReadOnlyProperty<Bounds2>,
               shouldReturnToToolbox: ( pointerPosition: Vector2 ) => boolean,
               providedOptions: GOToolDragListenerOptions ) {

    const options = optionize<GOToolDragListenerOptions, {}, DragListenerOptions<PressedDragListener>>( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: toolNode.tool.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: zoomTransformProperty.value,
      start: () => toolNode.moveToFront(),
      end: ( event: PressListenerEvent | null ) => {
        assert && assert( event ); // {PressListenerEvent|null}
        if ( shouldReturnToToolbox( event!.pointer.point ) ) {
          toolNode.returnToToolbox( false /* focus, because we're not using the keyboard */ );
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
export default GOToolDragListener;