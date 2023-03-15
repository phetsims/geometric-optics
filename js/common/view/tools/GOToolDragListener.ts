// Copyright 2022-2023, University of Colorado Boulder

/**
 * GOToolDragListener is the DragListener for use with Geometric Optics tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, DragListenerOptions, PressedDragListener } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import GOToolNode from './GOToolNode.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import GOTool from '../../model/tools/GOTool.js';

type SelfOptions = EmptySelfOptions;

type GOToolDragListenerOptions = SelfOptions &
  PickRequired<DragListenerOptions<PressedDragListener>, 'tandem'> &
  PickOptional<DragListenerOptions<PressedDragListener>, 'offsetPosition'>;

export default class GOToolDragListener extends DragListener {

  /**
   * @param tool - model element
   * @param toolNode - view element
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param dragBoundsProperty - dragging is constrained to these bounds
   * @param shouldReturnToToolbox - given the pointer's position, determine whether tool should be returned to toolbox
   * @param providedOptions
   */
  public constructor( tool: GOTool,
                      toolNode: GOToolNode,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      dragBoundsProperty: TReadOnlyProperty<Bounds2>,
                      shouldReturnToToolbox: ( pointerPoint: Vector2 ) => boolean,
                      providedOptions: GOToolDragListenerOptions ) {

    // options.end will get a null event if the drag is interrupted, which can definitely happen with multitouch.
    // So keep track of where the pointer is.
    let previousPointerPoint: Vector2 = Vector2.ZERO;

    const options = optionize<GOToolDragListenerOptions, SelfOptions, DragListenerOptions<PressedDragListener>>()( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: tool.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: zoomTransformProperty,
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
  }
}

geometricOptics.register( 'GOToolDragListener', GOToolDragListener );