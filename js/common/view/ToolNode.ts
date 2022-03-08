// Copyright 2022, University of Colorado Boulder

/**
 * ToolNode is the interface implemented by all tool Nodes (rulers, position markers).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';

interface ToolNode {

  // the icon associated with a tool, as it appears in the toolbox
  readonly iconNode: Node;

  // Tell the tool where the toolbox is located, in view coordinates.
  // This allows the tool to determine when it has been dragged back to the toolbox.
  setToolboxBounds( toolboxBounds: Bounds2 ): void
}

export default ToolNode;