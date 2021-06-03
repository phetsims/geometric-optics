// Copyright 2021, University of Colorado Boulder

/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang, Swarthmore College
 */

import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';

class Ruler {
  /**
   *
   * @param {Vector2} position
   * @param {number} length
   * @param {Object} [options]
   */
  constructor( position, length, options ) {

    options = merge( {
      orientation: 'horizontal'
    }, options );

    // @public {Property.<Vector2>} position of the ruler
    this.positionProperty = new Vector2Property( position );

    // @public (read-only) {number} length of the ruler in meters.
    this.length = length;

    // @public (read-only) {string} orientation of the ruler (valid choices are vertical and horizontal).
    this.orientation = options.orientation;
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }
}

geometricOptics.register( 'Ruler', Ruler );
export default Ruler;
