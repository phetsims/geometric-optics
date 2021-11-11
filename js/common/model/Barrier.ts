// Copyright 2021, University of Colorado Boulder

/**
 * Barrier is the interface for things that block light rays, like the projection screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';

interface Barrier {

  // Position of the barrier, in cm
  readonly positionProperty: Vector2Property;

  // Gets the vertical line that bisects the barrier, in the model's global coordinate frame.
  getBisectorLineTranslated(): Shape
}

export default Barrier;