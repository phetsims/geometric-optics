// Copyright 2022, University of Colorado Boulder

/**
 * GOToolIcon is the abstract base class for icons that appear in the toolbox.
 * An icon is associated with a specific tool Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, InteractiveHighlighting, Node, NodeOptions, PressListenerEvent } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import GOTool from '../../model/tools/GOTool.js';
import GOToolNode from './GOToolNode.js';

type SelfOptions = {
  touchAreaDilationX?: number;
  touchAreaDilationY?: number;
  mouseAreaDilationX?: number;
  mouseAreaDilationY?: number;
};

export type GOToolIconOptions = SelfOptions;

export default abstract class GOToolIcon extends InteractiveHighlighting( Node ) {

  /**
   * @param contentNode - the icon's content, what it looks like
   * @param tool - model element
   * @param toolNode - view element
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param pointerPositionToToolPosition - given the pointer position, determine the tool's model position
   * @param providedOptions
   */
  protected constructor( contentNode: Node,
                         tool: GOTool,
                         toolNode: GOToolNode,
                         zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                         pointerPositionToToolPosition: ( pointerPosition: Vector2 ) => Vector2,
                         providedOptions: GOToolIconOptions ) {

    const options = optionize<GOToolIconOptions, SelfOptions, NodeOptions>()( {

      // pointer areas
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5,

      // NodeOptions
      children: [ contentNode ],
      cursor: 'pointer',
      tagName: 'button'
    }, providedOptions );

    super( options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    tool.isInToolboxProperty.link( isInToolbox => {
      this.visible = isInToolbox;
    } );

    // Dragging with mouse/touch. Drag events are forwarded from the icon to its associated tool Node.
    this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {

      // Take the tool out of the toolbox.
      tool.isInToolboxProperty.value = false;

      // Set the position of the tool.
      tool.positionProperty.value = pointerPositionToToolPosition( event.pointer.point );

      // Forward the event to toolNode.
      toolNode.startDrag( event );
    } ) );

    // When the icon is clicked via the keyboard, take the tool out of the toolbox, and place it at the model origin.
    this.addInputListener( {
      click: () => {
        tool.isInToolboxProperty.value = false;
        tool.positionProperty.value = Vector2.ZERO;
        toolNode.focus();
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOToolIcon', GOToolIcon );