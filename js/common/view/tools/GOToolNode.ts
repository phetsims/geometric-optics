// Copyright 2022, University of Colorado Boulder

/**
 * GOToolNode is the abstract base class for the view of all tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { DragListener, Node, NodeOptions, PressListenerEvent } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import GOTool from '../../model/tools/GOTool.js';
import ToolJumpPoint from './ToolJumpPoint.js';

type SelfOptions = {

  // tandem to be used for the icon associated with this tool Node
  iconTandem: Tandem
};

export type GOToolNodeOptions = SelfOptions & PickRequired<Node, 'tandem'>;

abstract class GOToolNode extends Node {

  // the icon associated with this tool, as it appears in the toolbox
  public abstract icon: Node;

  protected abstract dragListener: DragListener;

  // Bounds of the toolbox, in global view coordinates. This tells the tool where to return to.
  public toolboxBounds: Bounds2;

  // positions that are 'interesting' to measure, for the J+P hotkey
  protected jumpPoints: ToolJumpPoint[];

  // current index into jumpPoints
  protected jumpPointsIndex: number;

  /**
   * @param tool
   * @param providedOptions
   */
  protected constructor( tool: GOTool, providedOptions: GOToolNodeOptions ) {

    const options = optionize<GOToolNodeOptions, SelfOptions, NodeOptions>( {

      // NodeOptions
      visibleProperty: DerivedProperty.not( tool.isInToolboxProperty ), // visible when not in the toolbox
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds
    this.jumpPoints = [];
    this.jumpPointsIndex = 0;

    this.addLinkedElement( tool, {
      tandem: options.tandem.createTandem( tool.tandem.name )
    } );
  }

  /**
   * Sets the bounds of the toolbox, so the ruler knows where to return to.
   * @param toolboxBounds
   */
  public setToolboxBounds( toolboxBounds: Bounds2 ): void {
    this.toolboxBounds = toolboxBounds;
  }

  /**
   * Forwards an event from the toolbox to start dragging this Node.
   * @param event
   */
  public startDrag( event: PressListenerEvent ): void {
    this.dragListener.press( event, this );
  }

  /**
   * Sets the jump points used by the J+P hotkey.
   * @param jumpPoints
   */
  public setJumpPoints( jumpPoints: ToolJumpPoint[] ): void {
    this.jumpPoints = jumpPoints;
    this.jumpPointsIndex = 0;
  }

  /**
   * Handles the J+P (Jump to Point) hotkey, which jumps (moves) the ruler to the next 'interesting' point.
   */
  public abstract jumpToPoint(): void;

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

export default GOToolNode;