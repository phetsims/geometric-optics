// Copyright 2021, University of Colorado Boulder

/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';

class Ruler {
  /**
   *
   * @param {Vector2} position
   * @param {number} length
   * @param {Object} [options]
   */
  constructor( position, length, options ) {

    options = merge( {
      orientation: Ruler.Orientation.HORIZONTAL
    }, options );

    // @public {Property.<Vector2>} position of the ruler in view coordinates
    this.positionProperty = new Vector2Property( position );

    // @public {number} length of the ruler in centimeters.
    this.length = length;

    // @private
    this.nominalLength = length;

    // @public (read-only) {string} orientation of the ruler (valid choices are vertical and horizontal).
    this.orientation = options.orientation;
  }


  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * @public
   * @param {number} absoluteScale
   */
  scaleLength( absoluteScale ) {
    this.length = this.nominalLength * absoluteScale;
  }

  /**
   * @public
   * @returns {boolean}
   */
  isHorizontal() {
    return this.orientation === Ruler.Orientation.HORIZONTAL;
  }

  /**
   * @public
   * @returns {boolean}
   */
  isVertical() {
    return this.orientation === Ruler.Orientation.VERTICAL;
  }
}

Ruler.Orientation = Enumeration.byKeys(
  [ 'VERTICAL',
    'HORIZONTAL' ]
);

geometricOptics.register( 'Ruler', Ruler );
export default Ruler;
