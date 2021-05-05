// Copyright 2021, University of Colorado Boulder

/**
 * Model element of a Light Ray. A LightRay is straight segment of a beam.
 *
 * @author Martin Veillette
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import Line from '../../../../kite/js/segments/Line.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class LightRay {

  /**
   * @param {Vector2} tail - tail position of light ray
   * @param {Vector2} tip - tip position of light ray
   * @param {Tandem} tandem
   */
  constructor( tail, tip, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // Directionality is important for propagation
    this.tip = tip; // @public (read-only)
    this.tail = tail; // @public (read-only)

  }

  /**
   * Check to see if this light ray hits a shape
   * @public
   * @param {Shape} shape
   * @returns {Array}
   */
  getIntersections( shape ) {
    return shape.intersection( this.getRay() );
  }

  /**
   * @public
   * @returns {Ray2}
   */
  getRay() {
    return new Ray2( this.tail, this.getUnitVector() );
  }

  /**
   * @public
   * @returns {Line}
   */
  toLine() {
    return new Line( this.tail, this.tip );
  }

  /**
   * Determines length of light ray
   * @public
   * @returns {number}
   */
  getLength() {
    return this.tip.distance( this.tail );
  }

  /**
   * @public
   * @returns {Vector2}
   */
  getVector() {
    return this.tip.minus( this.tail );
  }

  /**
   * Determines the unit vector of light ray
   * @public
   * @returns {Vector2}
   */
  getUnitVector() {
    return this.getVector().normalized();
  }

  /**
   * Determines the angle of light ray in radians
   * @public
   * @returns {number}
   */
  getAngle() {
    return this.getVector().getAngle();
  }

  /**
   * Determine if the light ray contains the specified position,
   * @public
   * @param {Vector2} position
   * @returns {boolean}
   */
  contains( position ) {
    return this.toLine().explicitClosestToPoint( position )[ 0 ].distanceSquared < 1E-14;
  }
}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;
