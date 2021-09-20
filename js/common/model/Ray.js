// Copyright 2021, University of Colorado Boulder

/**
 * Model element of a Ray. A ray can be semi infinite, or of finite length
 *
 * @author Martin Veillette
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';

class Ray extends Ray2 {

  /**
   * @param {Vector2} position - origin of the ray
   * @param {Vector2} direction - direction of the ray, must be a normalized vector.
   * @param {Object} [options]
   */
  constructor( position, direction, options ) {
    assert && assert( position instanceof Vector2 );
    assert && assert( direction instanceof Vector2 );

    options = merge( {
      length: Infinity // semi-infinite rays by default
    }, options );

    assert && assert( typeof options.length === 'number' );

    super( position, direction );

    // @public {number}
    this.length = options.length;
  }

  /**
   * Sets the length of the ray
   * @public
   * @param {number} length
   */
  setLength( length ) {
    assert && assert( typeof length === 'number' && isFinite( length ) );
    this.length = length;
  }

  /**
   * Convenience function that set the length of a ray by through the use of a final point
   * @public
   * @param {Vector2} point
   */
  setFinalPoint( point ) {
    assert && assert( point instanceof Vector2 );
    assert && assert( this.isPointAlongRay( point ), 'final point is not along ray' );
    this.setLength( point.minus( this.position ).magnitude );
  }

  /**
   * Gets the length of the ray. Note that the length may be Infinity.
   * @public
   * @returns {number} length
   */
  getLength() {
    return this.length;
  }

  /**
   * Determines if the point is along the ray direction.
   * @public
   * @param {Vector2} point
   * @param {number} [epsilon] - tolerance value
   * @returns {boolean}
   */
  isPointAlongRay( point, epsilon = 1e-4 ) {
    assert && assert( point instanceof Vector2 );
    const displacementVector = point.minus( this.position );
    return displacementVector.normalized().equalsEpsilon( this.direction, epsilon );
  }

  /**
   * Gets distance from origin to point. The point may not lay along the direction of the ray.
   * @public
   * @param {Vector2} point
   * @returns {number} distance
   */
  getDistanceTo( point ) {
    assert && assert( point instanceof Vector2 );
    const displacementVector = point.minus( this.position );
    return this.direction.dot( displacementVector );
  }
}

geometricOptics.register( 'Ray', Ray );
export default Ray;