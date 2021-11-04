// Copyright 2021, University of Colorado Boulder

/**
 * Model element of a Ray. A ray can be semi infinite, or of finite length
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';

class Ray extends Ray2 {

  private length: number;

  /**
   * @param {Vector2} position - origin of the ray
   * @param {Vector2} direction - direction of the ray, must be a normalized vector.
   * @param {Object} [options]
   */
  constructor( position: Vector2, direction: Vector2, options?: any ) { //TODO-TS any

    options = merge( {
      length: Infinity // semi-infinite rays by default
    }, options );

    assert && assert( typeof options.length === 'number' );

    super( position, direction );

    this.length = options.length;
  }

  /**
   * Sets the length of the ray
   * @param {number} length
   */
  public setLength( length: number ) {
    assert && assert( isFinite( length ) );
    this.length = length;
  }

  /**
   * Convenience function that set the length of a ray by through the use of a final point
   * @param {Vector2} point
   */
  public setFinalPoint( point: Vector2 ) {
    assert && assert( this.isPointAlongRay( point ), 'final point is not along ray' );
    this.setLength( point.minus( this.position ).magnitude );
  }

  /**
   * Gets the length of the ray. Note that the length may be Infinity.
   * @returns {number} length
   */
  public getLength() {
    return this.length;
  }

  /**
   * Determines if the point is along the ray direction.
   * @param {Vector2} point
   * @param {number} [epsilon] - tolerance value
   * @returns {boolean}
   */
  public isPointAlongRay( point: Vector2, epsilon = 1e-4 ) {
    const displacementVector = point.minus( this.position );
    return displacementVector.normalized().equalsEpsilon( this.direction, epsilon );
  }

  /**
   * Gets distance from origin to point. The point may not lay along the direction of the ray.
   * @param {Vector2} point
   * @returns {number} distance
   */
  public getDistanceTo( point: Vector2 ) {
    const displacementVector = point.minus( this.position );
    return this.direction.dot( displacementVector );
  }
}

geometricOptics.register( 'Ray', Ray );
export default Ray;