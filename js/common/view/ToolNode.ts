// Copyright 2022, University of Colorado Boulder

/**
 * ToolNode is the interface implemented by all tool Nodes (rulers, position markers).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';

interface ToolNode {

  // the icon associated with a tool, as it appears in the toolbox
  readonly iconNode: Node;
}

export default ToolNode;