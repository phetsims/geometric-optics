// Copyright 2021, University of Colorado Boulder

/**
 * Barrier is the interface for things that block light rays, like the projection screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';

interface Barrier {

  // Position of the barrier, in cm
  readonly positionProperty: Property<Vector2>;

  // Gets the vertical line that bisects the barrier, in the model's global coordinate frame.
  getBisectorLineTranslated(): Shape
}

export default Barrier;