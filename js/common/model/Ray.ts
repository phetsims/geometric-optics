// Copyright 2021, University of Colorado Boulder

/**
 * Model element of a Ray. A ray can be semi infinite, or of finite length
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';

class Ray extends Ray2 {

  private length: number;

  /**
   * @param position - origin of the ray
   * @param direction - direction of the ray, must be a normalized vector.
   */
  constructor( position: Vector2, direction: Vector2 ) {
    super( position, direction );
    this.length = Infinity; // semi-infinite rays by default
  }

  /**
   * Sets the length of the ray
   */
  public setLength( length: number ): void {
    assert && assert( isFinite( length ) );
    this.length = length;
  }

  /**
   * Gets the length of the ray. Note that the length may be Infinity.
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Sets the length of a ray by using a final point.
   * @param finalPoint
   */
  public setFinalPoint( finalPoint: Vector2 ): void {
    assert && assert( this.isPointAlongRay( finalPoint ), 'final point is not along ray' );
    this.setLength( finalPoint.minus( this.position ).magnitude );
  }

  /**
   * Determines if the point is along the ray direction.
   * @param point
   * @param epsilon - tolerance value
   */
  public isPointAlongRay( point: Vector2, epsilon = 1e-4 ): boolean {
    const displacementVector = point.minus( this.position );
    return displacementVector.normalized().equalsEpsilon( this.direction, epsilon );
  }

  /**
   * Gets distance from origin to point. The point may not lay along the direction of the ray.
   */
  public getDistanceTo( point: Vector2 ): number {
    const displacementVector = point.minus( this.position );
    return this.direction.dot( displacementVector );
  }
}

geometricOptics.register( 'Ray', Ray );
export default Ray;