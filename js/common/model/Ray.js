// Copyright 2021, University of Colorado Boulder

/**
 * Model element of a Ray. A ray can be semi infinite, or of finite length
 *
 * @author Martin Veillette
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';

class Ray extends Ray2 {

  /**
   * @param {Vector2} position
   * @param {Vector2} direction
   * @param {Object} [options]
   */
  constructor( position,
               direction,
               options ) {

    options = merge( {
      length: Infinity // semi infinite rays by default
    }, options );

    super( position, direction );

    assert && assert( typeof options.length === 'number' );

    this.length = options.length;
  }

  /**
   * @public
   * @param {number} length
   */
  setLength( length ) {
    this.length = length;
  }

  /**
   * @public
   * @param {Vector2} point
   */
  setFinalPoint( point ) {
    assert && assert( this.isFinalPointAlongRay( point, 1e-4 ), 'final point is not along ray' );
    this.setLength( point.minus( this.position ).magnitude );
  }

  /**
   * @public
   * @returns {number} length
   */
  getLength() {
    return this.length;
  }

  /**
   * @public
   * @param {Vector2} point
   * @param {number} epsilon - tolerance value
   * @returns {boolean}
   */
  isFinalPointAlongRay( point, epsilon ) {
    const displacementVector = point.minus( this.position );
    return displacementVector.normalized().equalsEpsilon( this.direction, epsilon );
  }

  /**
   * get distance from origin to point (point may not lay along the direction of the ray)
   * @public
   * @param {Vector2} point
   * @returns {number} distance
   */
  getDistanceTo( point ) {
    const displacementVector = point.minus( this.position );
    return this.direction.dot( displacementVector );
  }

}

geometricOptics.register( 'Ray', Ray );
export default Ray;
