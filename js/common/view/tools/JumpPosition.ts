// Copyright 2022, University of Colorado Boulder

/**
 * JumpPosition describes an 'interesting' measurement point for a tool, which can be 'jumped' to via J+P hotkey.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';

type JumpPosition = {

  // a position that is interesting to put a tool, in model coordinates
  positionProperty: IReadOnlyProperty<Vector2>;

  // whether the thing at the position is currently visible
  visibleProperty: IReadOnlyProperty<boolean>;
}

export default JumpPosition;