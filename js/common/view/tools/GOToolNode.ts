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

type SelfOptions = {
  iconTandem: Tandem,
  linkedElementTandemName: string
};

export type GOToolNodeOptions = SelfOptions & PickRequired<Node, 'tandem'>;

abstract class GOToolNode extends Node {

  // the icon associated with this tool, as it appears in the toolbox
  public abstract icon: Node;

  protected abstract dragListener: DragListener;

  public readonly tool: GOTool;

  // Bounds of the toolbox, in view coordinates. This tells the tool where to return to.
  public toolboxBounds: Bounds2; //TODO this is currently in parent coordinate frame, should be in global

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

    this.tool = tool;
    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds

    this.addLinkedElement( tool, {
      tandem: options.tandem.createTandem( options.linkedElementTandemName )
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
   * Returns the tool to the toolbox.
   * @param focus - whether to move focus to the icon in the toolbox, should be true for keyboard input handling
   */
  public returnToToolbox( focus: boolean ) {
    this.tool.isInToolboxProperty.value = true;
    focus && this.icon.focus();
  }

  /**
   * Forwards an event from the toolbox to start dragging this Node.
   * @param event
   */
  public startDrag( event: PressListenerEvent ): void {
    this.dragListener.press( event, this );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

export default GOToolNode;