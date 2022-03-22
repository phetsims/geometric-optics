// Copyright 2022, University of Colorado Boulder

/**
 * ToolJumpPoint describes an 'interesting' point to place a tool, which can be 'jumped' to via the 'J' hotkey.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';

type ToolJumpPoint = {

  // a position that is interesting to put a tool, in model coordinates
  positionProperty: IReadOnlyProperty<Vector2 | null>;

  // whether the thing at the position is currently visible
  visibleProperty: IReadOnlyProperty<boolean>;
}

export default ToolJumpPoint;