// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightRay is the model of a single light ray, and creates the LightRaySegments that describe that light ray.
 * A LightRay can fork to have real and virtual ray components.
 * The segments are initially described as Rays, then converted to LightRaySegments.
 * LightRay has a flag that determines if it has reached the point where the optical Image forms.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { RayIntersection } from '../../../../kite/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from '../../lens/model/Lens.js';
import ProjectionScreen from './ProjectionScreen.js';
import Mirror from '../../mirror/model/Mirror.js';
import GOQueryParameters from '../GOQueryParameters.js';
import Optic from './Optic.js';
import GORay from './GORay.js';
import { RaysType } from './RaysType.js';

export type LightRaySegment = {
  startPoint: Vector2;
  endPoint: Vector2;
};

export default class LightRay {

  // segments for the real rays
  public readonly realSegments: LightRaySegment[];

  // segments for the virtual rays
  public readonly virtualSegments: LightRaySegment[];

  // true when the LightRay has reached its target (the optical image position, or the projection screen position)
  public readonly hasReachedTarget: boolean;

  // a collection of sequential rays
  private readonly realRays: GORay[];

  // there is a maximum of one virtual ray per LightRay
  private readonly virtualRay: GORay | null;

  /**
   * @param opticalObjectPosition - where this LightRay originated
   * @param direction - initial direction of this LightRay
   * @param raysAnimationTime - elapsed time of light rays animation
   * @param optic - the optic that this ray may interact with
   * @param opticalImagePosition - point of focus of all rays based on thin lens law
   * @param isImageVirtual - is the optical image virtual?
   * @param raysType
   * @param [projectionScreen] - optional projection screen that can block the rays
   */
  public constructor( opticalObjectPosition: Vector2, direction: Vector2, raysAnimationTime: number, optic: Optic, opticalImagePosition: Vector2,
                      isImageVirtual: boolean, raysType: RaysType, projectionScreen?: ProjectionScreen ) {

    assert && assert( raysAnimationTime >= 0, `invalid raysAnimationTime: ${raysAnimationTime}` );

    this.realSegments = [];
    this.virtualSegments = [];

    // maximum travel distance if ray is unimpeded
    const distanceTraveled = GOQueryParameters.lightSpeed * raysAnimationTime;

    // ray (position and direction) emerging from optical object
    const initialRay = new GORay( opticalObjectPosition, direction );

    // first intersection point - a null value implies that the initialRay does not intersect the optic
    const firstPoint: Vector2 | null = getFirstPoint( initialRay, optic, raysType );

    this.realRays = getRealRays( initialRay, firstPoint, optic, raysType, opticalImagePosition );

    // If we have a projection screen, attempt to terminate the last real ray on the projection screen.
    if ( projectionScreen ) {
      const lastRay = this.realRays[ this.realRays.length - 1 ];
      terminateOnProjectionScreen( lastRay, projectionScreen );
    }

    this.virtualRay = getVirtualRay( isImageVirtual, this.realRays, opticalImagePosition );

    this.hasReachedTarget = this.getHasReachedTarget( distanceTraveled, opticalObjectPosition, opticalImagePosition,
      projectionScreen );

    // Process rays to convert them to line segments.
    this.raysToSegments( distanceTraveled );
  }

  /**
   * Have the rays reached the target? If a projection screen is provided, the target is the projection screen.
   * Otherwise, the target is the optical image position.
   * @param distanceTraveled - how far the ray has traveled in its animation
   * @param opticalObjectPosition
   * @param opticalImagePosition
   * @param [projectionScreen]
   */
  private getHasReachedTarget( distanceTraveled: number, opticalObjectPosition: Vector2,
                               opticalImagePosition: Vector2, projectionScreen?: ProjectionScreen ): boolean {
    let hasReachedTarget;
    if ( projectionScreen ) {

      // For the projection screen, we're interested in whether the ray has reached the vertical plane of the
      // screen, not whether it has intersected the screen. Since the ray originates at the optical object,
      // compare the distance traveled to the distance of the screen from the optical object.
      // See https://github.com/phetsims/geometric-optics/issues/417
      hasReachedTarget = distanceTraveled >= ( projectionScreen.positionProperty.value.x - opticalObjectPosition.x );
    }
    else {

      let distance = 0;

      // Exclude the last real ray in the calculation of length, because it has infinite length.
      assert && assert( this.realRays[ this.realRays.length - 1 ].getLength() === Infinity );
      for ( let i = 0; i < this.realRays.length - 1; i++ ) {
        distance = distance + this.realRays[ i ].getLength();
      }

      // If the Image is virtual, the target point is along the virtual ray.
      // Otherwise, the target point probably lies along the last real ray.
      const targetRay = this.virtualRay || this.realRays[ this.realRays.length - 1 ];

      // Add the last bit of distance to the target.
      if ( targetRay ) {
        distance = distance + targetRay.getDistanceTo( opticalImagePosition );
      }

      // only rays that have been refracted (or reflected) that have traveled long enough can reach the target.
      hasReachedTarget = ( this.realRays.length > 1 ) && ( distanceTraveled > distance );
    }
    return hasReachedTarget;
  }

  /**
   * Processes all the rays into LightRaySegment instances, populates this.realSegments and this.virtualSegments.
   * @param distanceTraveled - how far the ray has traveled in its animation
   */
  private raysToSegments( distanceTraveled: number ): void {

    // remaining distance to travel for the ray
    let remainingDistance = distanceTraveled;

    // counter for real rays
    let i = 0;

    // Process until we cover the entire distance, or until we run out of rays.
    while ( remainingDistance > 0 && i < this.realRays.length ) {

      // Real ray being processed
      const realRay = this.realRays[ i ];

      // Determine the distance covered by the line ray.
      const realRayDistance = Math.min( remainingDistance, realRay.getLength() );
      const realEndPoint = realRay.pointAtDistance( realRayDistance );

      // Add a line segment based on the traveling distance of the ray being processed
      this.realSegments.push( { startPoint: realRay.position, endPoint: realEndPoint } );

      // Wait to process virtual ray until the virtual starting point matches the starting point of the ray being processed.
      if ( this.virtualRay && this.virtualRay.position === realRay.position ) {

        // Determine the distance of the virtual ray.
        const virtualRayDistance = Math.min( remainingDistance, this.virtualRay.getLength() );
        const virtualEndPoint = this.virtualRay.pointAtDistance( virtualRayDistance );

        // Add a line segment based on the virtual ray.
        this.virtualSegments.push( { startPoint: this.virtualRay.position, endPoint: virtualEndPoint } );
      }

      // Update the value of the distance remaining.
      remainingDistance = remainingDistance - realRayDistance;

      // Update the realRay counter.
      i++;
    }
  }
}

/**
 * Gets the first intersection Point, where it hits the front (left-facing) surface of the optic.
 * @param initialRay - the ray emerging from the optical object
 * @param optic - the optic that the ray may interact with
 * @param raysType - representation used for rays
 */
function getFirstPoint( initialRay: GORay, optic: Optic, raysType: RaysType ): Vector2 | null {
  const firstIntersection = optic.getFrontShapeTranslated( raysType ).intersection( initialRay );
  return getPoint( firstIntersection );
}

/**
 * Gets all the real rays that form a light ray. The transmitted ray (last ray) is set to be of infinite length by
 * default This can be corrected later if the ray is intercepted by a projectionScreen
 * @param initialRay - the ray emerging from the optical object
 * @param firstPoint - first intersection point with the optic
 * @param optic - the optic that the ray may interact with
 * @param raysType - representation used for rays
 * @param opticalImagePosition - position of the optical image
 */
function getRealRays( initialRay: GORay, firstPoint: Vector2 | null, optic: Optic, raysType: RaysType,
                      opticalImagePosition: Vector2 ): GORay[] {

  // array to store all the rays
  const rays = [];

  // add the initial ray
  rays.push( initialRay );

  // we can only proceed if the first point (intersection point) exists,
  // otherwise we bail out
  if ( firstPoint ) {

    // update the final point of the initial ray, since we hit something
    initialRay.setFinalPoint( firstPoint );

    // determine the ray(s) that come have the initial ray

    // mirror or principal ray mode have only "one surface" to hit
    if ( optic instanceof Mirror || ( raysType === 'principal' ) ) {

      // add the semi-infinite transmitted ray
      rays.push( getTransmittedRay( firstPoint, opticalImagePosition, optic ) );
    }
    else {
      assert && assert( optic instanceof Lens ); // eslint-disable-line no-simple-type-checking-assertions
      const lens = optic as Lens;

      // find bisecting point of the lens, used to determine outgoing ray
      const intermediatePoint = getIntermediatePoint( initialRay, firstPoint, lens );

      // create a semi-infinite ray starting at intermediate point to the target point
      const transmittedRay = getTransmittedRay( intermediatePoint, opticalImagePosition, lens );

      // determine the intersection of the transmitted ray with the back shape of the lens
      const backIntersection = lens.getBackShapeTranslated().intersection( transmittedRay );

      // back shape point intersecting the transmitted ray
      const backPoint = getPoint( backIntersection );

      // if back point exists, add transmitted and internal ray
      if ( backPoint ) {

        // ray that spans the front to the back of the lens
        const internalRay = new GORay( firstPoint, backPoint.minus( firstPoint ).normalized() );

        // set the internal ray back point
        internalRay.setFinalPoint( backPoint );

        // create a semi-infinite ray, starting at the back point, parallel to target point
        const transmittedRay = getTransmittedRay( backPoint, opticalImagePosition, lens );

        // add the rays
        rays.push( internalRay, transmittedRay );
      }
      else {
        // back shape is not hit, see https://github.com/phetsims/geometric-optics/issues/124

        // create a semi-infinite ray, starting at the front point, parallel to target point
        const transmittedRay = getTransmittedRay( firstPoint, opticalImagePosition, lens );

        // add the rays
        rays.push( transmittedRay );
      }
    }
  }
  return rays;
}

/**
 * Gets an "intermediate" point. Find the point of intersection of the initial ray with an imaginary vertical line
 * at position share by the optic position
 * @param initialRay - the ray emerging from the optical object
 * @param firstPoint - first intersection point with the optic
 * @param optic - the optic that the ray may interact with
 */
function getIntermediatePoint( initialRay: GORay, firstPoint: Vector2, optic: Optic ): Vector2 {

  // displacement vector from the object to the optic position
  const objectOpticVector = optic.positionProperty.value.minus( initialRay.position );

  // displacement vector from the object to the first point hit by the ray.
  const firstVector = firstPoint.minus( initialRay.position );

  // return a point that will be directed along the initial ray but has an
  // x position that is equal to opticPosition.x
  return initialRay.position.blend( firstPoint, objectOpticVector.x / firstVector.x );
}

/**
 * If ray intersects the projection screen, terminate the ray on the projection screen by setting
 * the ray's final point.
 */
function terminateOnProjectionScreen( realRay: GORay, projectionScreen: ProjectionScreen ): void {

  const intersection = projectionScreen.getBisectorLineTranslated().intersection( realRay );

  const pointOnScreen = getPoint( intersection );

  // If intersection is found, set the transmittedRay final point
  if ( pointOnScreen ) {
    realRay.setFinalPoint( pointOnScreen );
  }
}

/**
 * Processes a point from the intersection. Returns null if the point cannot be found.
 */
function getPoint( intersection: RayIntersection[] ): Vector2 | null {

  // all shapes have been defined as line (straight or curved) so there can only be one intersection point at most
  if ( intersection && intersection[ 0 ] && intersection[ 0 ].point ) {
    return intersection[ 0 ].point;
  }
  else {
    return null;
  }
}

/**
 * Returns a semi-infinite ray starting at originPoint. The ray is along (or opposite to) the direction of opticalImagePosition.
 */
function getTransmittedRay( originPoint: Vector2, opticalImagePosition: Vector2, optic: Optic ): GORay {

  const direction = originPoint.minus( opticalImagePosition ).normalized();

  // real rays should only propagate to the right for lens and to left for a mirror
  if ( ( optic instanceof Lens && direction.x < 0 ) || ( optic instanceof Mirror && direction.x > 0 ) ) {
    direction.negate();
  }
  return new GORay( originPoint, direction );
}

/**
 * Returns a virtual ray that is opposite to the last real ray.
 * Returns null if the ray does not intersect the optical image.
 */
function getVirtualRay( isImageVirtual: boolean, realRays: GORay[], opticalImagePosition: Vector2 ): GORay | null {
  let virtualRay: GORay | null = null;

  // If the image is virtual and the real rays have refracted...
  if ( isImageVirtual && realRays.length > 1 ) {
    const lastRealRay = realRays[ realRays.length - 1 ];

    // Virtual ray has the same position as the real ray, but propagates in the opposite direction.
    virtualRay = new GORay( lastRealRay.position, lastRealRay.direction.negated() );

    // If the ray intersects the target point, terminate at the target point.
    if ( virtualRay.isPointAlongRay( opticalImagePosition ) ) {
      virtualRay.setFinalPoint( opticalImagePosition );
    }
    else {
      virtualRay = null;
    }
  }
  return virtualRay;
}

geometricOptics.register( 'LightRay', LightRay );