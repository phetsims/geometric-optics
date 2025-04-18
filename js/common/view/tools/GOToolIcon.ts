// Copyright 2022-2025, University of Colorado Boulder

/**
 * GOToolIcon is the abstract base class for icons that appear in the toolbox.
 * An icon is associated with a specific tool Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import InteractiveHighlighting from '../../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import RichDragListener from '../../../../../scenery/js/listeners/RichDragListener.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
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
   * @param pointerPositionToToolPosition - given the pointer position, determine the tool's model position
   * @param providedOptions
   */
  protected constructor( contentNode: Node,
                         tool: GOTool,
                         toolNode: GOToolNode,
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
      tagName: 'button',
      isDisposable: false
    }, providedOptions );

    super( options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    tool.isInToolboxProperty.link( isInToolbox => {
      this.visible = isInToolbox;
    } );

    this.addInputListener( RichDragListener.createForwardingListener( toolNode, event => {

      // Take the tool out of the toolbox.
      tool.isInToolboxProperty.value = false;

      if ( event.isFromPDOM() ) {

        // Set the position of the tool.
        tool.positionProperty.value = Vector2.ZERO;
      }
      else {

        // Set the position of the tool.
        tool.positionProperty.value = pointerPositionToToolPosition( event.pointer.point );

        // Forward the event to toolNode DragListener.
        toolNode.startDrag( event );
      }
    } ) );
  }
}

geometricOptics.register( 'GOToolIcon', GOToolIcon );