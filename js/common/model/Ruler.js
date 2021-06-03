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

    this.positionProperty = new Vector2Property( position );
    this.length = length;

    this.orientation = options.orientation;
  }
}

geometricOptics.register( 'Ruler', Ruler );
export default Ruler;
