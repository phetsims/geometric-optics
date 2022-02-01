// Copyright 2021-2022, University of Colorado Boulder

/**
 * GORay extends dot.Ray2 by adding a length property. A GORay can have finite or semi-infinite length.
 * Used by LightRay to compute the segments of a light ray.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';

class GORay extends Ray2 {

  private length: number;

  /**
   * @param position - origin of the ray
   * @param direction - direction of the ray, must be a normalized vector.
   */
  constructor( position: Vector2, direction: Vector2 ) {
    super( position, direction );
    this.length = Infinity; // semi-infinite by default
  }

  /**
   * Sets the length of the ray.
   * @param length
   */
  public setLength( length: number ): void {
    assert && assert( isFinite( length ) && length > 0 );
    this.length = length;
  }

  /**
   * Gets the length of the ray. Note that the length may be Infinity.
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Sets the length of the ray by using a final point.
   * The final point must be along the direction of the ray.
   * @param finalPoint
   */
  public setFinalPoint( finalPoint: Vector2 ): void {
    assert && assert( this.isPointAlongRay( finalPoint ), 'final point is not along ray' );
    this.setLength( finalPoint.minus( this.position ).magnitude );
  }

  /**
   * Determines if a point is along the direction of the ray.
   * @param point
   * @param [epsilon] - tolerance value
   */
  public isPointAlongRay( point: Vector2, epsilon = 1e-4 ): boolean {
    const displacementVector = point.minus( this.position );
    return displacementVector.normalized().equalsEpsilon( this.direction, epsilon );
  }

  /**
   * Gets the distance from the ray's position to a specified point.
   * The point does not need to be along the direction of the ray.
   * @param point
   */
  public getDistanceTo( point: Vector2 ): number {
    const displacementVector = point.minus( this.position );
    return this.direction.dot( displacementVector );
  }
}

geometricOptics.register( 'GORay', GORay );
export default GORay;