// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightRay is the model of a single light ray, and creates the LightRaySegments that describe that light ray.
 * A LightRay can fork to have real and virtual ray components.
 * The segments are initially described as Rays, then converted to LightRaySegments.
 * LightRay has a flag that determines if it has reached a target.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import RayIntersection from '../../../../kite/js/util/RayIntersection.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from '../../lens/model/Lens.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import Mirror from '../../mirror/model/Mirror.js';
import GOQueryParameters from '../GOQueryParameters.js';
import LightRaySegment from './LightRaySegment.js';
import Optic from './Optic.js';
import Ray from './Ray.js';

class LightRay {

  // segments for the real rays
  readonly realSegments: Array<LightRaySegment>;

  // segments for the virtual rays
  readonly virtualSegments: Array<LightRaySegment>;

  //TODO document
  readonly isTargetReached: boolean;

  // a collection of sequential rays
  private readonly realRays: Array<Ray>;

  // Does this light ray have a virtual ray attached to it?
  private readonly hasVirtualRay: boolean;

  // there is a maximum of one virtual ray per LightRay
  private readonly virtualRay: Ray | null;

  /**
   * @param sourcePosition - where this LightRay originated
   * @param direction - initial direction of this LightRay
   * @param lightRaysTime - elapsed time of light rays animation
   * @param optic - model of the optic
   * @param targetPoint - point of focus of all rays based on thin lens law
   * @param isVirtual - is the image virtual?
   * @param isPrincipalRaysType - is the light ray mode set to Principal rays
   * @param projectionScreen - optional projection screen that can block the rays
   */
  constructor( sourcePosition: Vector2, direction: Vector2, lightRaysTime: number, optic: Optic, targetPoint: Vector2,
               isVirtual: boolean, isPrincipalRaysType: boolean, projectionScreen: ProjectionScreen | null ) {

    assert && AssertUtils.assertNonNegativeNumber( lightRaysTime );

    this.realSegments = [];
    this.virtualSegments = [];

    // {number} maximum travel distance if ray is unimpeded
    const distanceTraveled = GOQueryParameters.lightSpeed * lightRaysTime;

    // ray (position and direction) emerging from source
    const initialRay = new Ray( sourcePosition, direction );

    // {Vector2|null} first intersection point - a null value implies that the initialRay does not intersect the optic
    const firstPoint = getFirstPoint( initialRay, optic, isPrincipalRaysType );

    this.realRays = getRealRays( initialRay, firstPoint, optic, isPrincipalRaysType, targetPoint );

    // If we have a projection screen, check whether the last ray terminates on the projection screen.
    if ( projectionScreen ) {
      const lastRay = this.realRays[ this.realRays.length - 1 ];
      terminateOnProjectionScreen( lastRay, projectionScreen );
    }

    this.hasVirtualRay = hasVirtualComponent( isVirtual, this.realRays );

    this.virtualRay = this.hasVirtualRay ?
                      getVirtualRay( this.realRays, targetPoint ) :
                      null;

    this.isTargetReached = this.getHasReachedTarget( distanceTraveled, !!projectionScreen, targetPoint );

    // Process rays to convert them to line segments.
    this.raysToSegments( distanceTraveled );
  }

  /**
   * Have the rays reached the target (projection screen or target point)?
   * @param distanceTraveled
   * @param hasProjectionScreen
   * @param targetPoint
   */
  private getHasReachedTarget( distanceTraveled: number, hasProjectionScreen: boolean, targetPoint: Vector2 ): boolean {

    let distance = 0;

    if ( hasProjectionScreen ) {

      // distance to projection screen
      for ( let i = 0; i < this.realRays.length; i++ ) {
        distance = distance + this.realRays[ i ].getLength();
      }
    }
    else {

      // exclude the last real ray in the calculation of length
      for ( let i = 0; i < this.realRays.length - 1; i++ ) {
        distance = distance + this.realRays[ i ].getLength();
      }

      // if the image is virtual, the target point is along the virtual ray,
      // otherwise, the target point probably lies along the last real ray
      const targetRay = this.hasVirtualRay ?
                        this.virtualRay :
                        this.realRays[ this.realRays.length - 1 ];

      // add the last bit of distance to the target
      if ( targetRay ) {
        distance = distance + targetRay.getDistanceTo( targetPoint );
      }
    }

    // only rays that have been refracted (or reflected) that have traveled long enough can reach the target.
    return this.realRays.length > 1 && distanceTraveled > distance;
  }

  /**
   * Processes all the rays (virtual and real) into line segments.
   * @param distanceTraveled
   */
  private raysToSegments( distanceTraveled: number ): void {

    // {number} remaining distance to travel for the ray
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
      this.realSegments.push( new LightRaySegment( realRay.position, realEndPoint ) );

      // Wait to process virtual ray until the virtual starting point matches the starting point of the ray being processed.
      if ( this.virtualRay && this.virtualRay.position === realRay.position ) {

        // Determine the distance of the virtual ray.
        const virtualRayDistance = Math.min( remainingDistance, this.virtualRay.getLength() );
        const virtualEndPoint = this.virtualRay.pointAtDistance( virtualRayDistance );

        // Add a line segment based on the virtual ray.
        this.virtualSegments.push( new LightRaySegment( this.virtualRay.position, virtualEndPoint ) );
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
 * @param initialRay
 * @param optic
 * @param isPrincipalRaysType
 */
function getFirstPoint( initialRay: Ray, optic: Optic, isPrincipalRaysType: boolean ): Vector2 | null {
  const firstIntersection = optic.getFrontShapeTranslated( isPrincipalRaysType ).intersection( initialRay );
  return getPoint( firstIntersection );
}

/**
 * Gets all the real rays that form a light ray. The transmitted ray (last ray) is set to be of infinite length by
 * default This can be corrected later if the ray is intercepted by a projectionScreen
 * @param initialRay
 * @param firstPoint
 * @param optic
 * @param isPrincipalRaysType
 * @param targetPoint
 */
function getRealRays( initialRay: Ray, firstPoint: Vector2 | null, optic: Optic, isPrincipalRaysType: boolean,
                      targetPoint: Vector2 ): Ray[] {

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

    // mirror and principal ray mode have only "one surface" to hit
    if ( optic instanceof Mirror || isPrincipalRaysType ) {

      // add the semi-infinite transmitted ray
      rays.push( getTransmittedRay( firstPoint, targetPoint, optic ) );
    }
    else {
      assert && assert( ( optic instanceof Lens ) && !isPrincipalRaysType );

      // {Vector2} find bisecting point of the lens, used to determine outgoin ray
      const intermediatePoint = getIntermediatePoint( initialRay, firstPoint, optic );

      // create a semi infinite ray starting at intermediate point to the target point
      const transmittedRay = getTransmittedRay( intermediatePoint, targetPoint, optic );

      // determine the intersection of the transmitted ray with the back shape of the optic
      const backIntersection = optic.getBackShapeTranslated().intersection( transmittedRay );

      // back shape point intersecting the transmitted ray
      const backPoint = getPoint( backIntersection );

      // if back point exists, add transmitted and internal ray
      if ( backPoint ) {

        // ray that spans the front to the back of the lens
        const internalRay = new Ray( firstPoint, backPoint.minus( firstPoint ).normalized() );

        // set the internal ray back point
        internalRay.setFinalPoint( backPoint );

        // create a semi-infinite ray, starting at the back point, parallel to target point
        const transmittedRay = getTransmittedRay( backPoint, targetPoint, optic );

        // add the rays
        rays.push( internalRay, transmittedRay );
      }
      else {
        // back shape is not hit, see https://github.com/phetsims/geometric-optics/issues/124

        // create a semi-infinite ray, starting at the front point, parallel to target point
        const transmittedRay = getTransmittedRay( firstPoint, targetPoint, optic );

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
 * @param initialRay
 * @param firstPoint
 * @param optic
 */
function getIntermediatePoint( initialRay: Ray, firstPoint: Vector2, optic: Optic ): Vector2 {

  // displacement vector from the source to the optic position
  const opticSourceVector = optic.positionProperty.value.minus( initialRay.position );

  // displacement vector from the source to the first point hit by the ray.
  const firstSourceVector = firstPoint.minus( initialRay.position );

  // return a point that will be directed along the initial ray but has an
  // x position that is equal to opticPosition.x
  return initialRay.position.blend( firstPoint, opticSourceVector.x / firstSourceVector.x );
}

/**
 * If ray intersects the projection screen, terminate the ray on the projection screen by setting
 * the ray's final point.
 * @param realRay
 * @param projectionScreen
 */
function terminateOnProjectionScreen( realRay: Ray, projectionScreen: ProjectionScreen ): void {

  const intersection = projectionScreen.getBisectorLineTranslated().intersection( realRay );

  // {Vector2|null}
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
  assert && assert( Array.isArray( intersection ) && _.every( intersection, element => element instanceof RayIntersection ) );

  // all shapes have been defined as line (straight or curved) so there can only be one intersection point at most
  if ( intersection && intersection[ 0 ] && intersection[ 0 ].point ) {
    return intersection[ 0 ].point;
  }
  else {
    return null;
  }
}

/**
 * Returns a semi infinite ray starting at originPoint. The ray is along (or opposite to) the direction of targetPoint.
 */
function getTransmittedRay( originPoint: Vector2, targetPoint: Vector2, optic: Optic ): Ray {

  const direction = originPoint.minus( targetPoint ).normalized();

  // real rays should only propagate to the right for lens and to left for a mirror
  if ( ( optic instanceof Lens && direction.x < 0 ) || ( optic instanceof Mirror && direction.x > 0 ) ) {
    direction.negate();
  }
  return new Ray( originPoint, direction );
}

/**
 * Returns a virtual ray that is opposite to the last real ray.
 * If the virtual ray does not exist or does not line up with the target point, it returns null.
 * @param realRays
 * @param targetPoint
 */
function getVirtualRay( realRays: Ray[], targetPoint: Vector2 ): Ray | null {

  // to have a virtual ray, the initial ray must be deflected
  if ( realRays.length > 1 ) {

    // last real ray
    const lastRay = realRays[ realRays.length - 1 ];

    // virtual ray propagates in the opposite direction to the ray but same initial position
    const virtualRay = new Ray( lastRay.position, lastRay.direction.negated() );

    // ensure that the virtual ray is along the target point
    if ( virtualRay.isPointAlongRay( targetPoint ) ) {

      // set the target point to assign the length of ray
      virtualRay.setFinalPoint( targetPoint );

      return virtualRay;
    }
    else {

      // no virtual ray to return
      return null;
    }
  }
  else {

    // no virtual ray to return
    return null;
  }
}

/**
 * Has the light ray a virtual component (virtual ray)?
 * @param isImageVirtual
 * @param realRays
 */
function hasVirtualComponent( isImageVirtual: boolean, realRays: Ray[] ): boolean {

  // is the image virtual and has the real rays refracted
  return isImageVirtual && realRays.length > 1;
}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;