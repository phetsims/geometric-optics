// Copyright 2022, University of Colorado Boulder

/**
 * GOToolNode is the view base class for all tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  iconTandem: Tandem
};

export type GOToolNodeOptions = SelfOptions & PickRequired<Node, 'tandem'>;

abstract class GOToolNode extends Node {

  // the icon associated with this tool, as it appears in the toolbox
  abstract icon: Node;

  // bounds of the toolbox, in view coordinates
  protected toolboxBounds: Bounds2; //TODO this is currently in parent coordinate frame, should be in global

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GOToolNodeOptions ) {

    const options = optionize<GOToolNodeOptions, SelfOptions, NodeOptions>( {

      // NodeOptions
      tagName: 'div',
      focusable: true,
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds
  }

  /**
   * Sets the bounds of the toolbox, so the ruler knows where to return to.
   * @param toolboxBounds
   */
  public setToolboxBounds( toolboxBounds: Bounds2 ): void {
    this.toolboxBounds = toolboxBounds;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

export default GOToolNode;