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
import RayIntersection from '../../../../kite/js/util/RayIntersection.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from '../../lens/model/Lens.js';
import ProjectionScreen from '../../common/model/ProjectionScreen.js';
import Mirror from '../../mirror/model/Mirror.js';
import GOQueryParameters from '../GOQueryParameters.js';
import Optic from './Optic.js';
import GORay from './GORay.js';
import { RaysType } from './RaysType.js';

type LightRaySegment = {
  startPoint: Vector2,
  endPoint: Vector2
};

class LightRay {

  // segments for the real rays
  readonly realSegments: Array<LightRaySegment>;

  // segments for the virtual rays
  readonly virtualSegments: Array<LightRaySegment>;

  //TODO document
  readonly isTargetReached: boolean;

  // a collection of sequential rays
  private readonly realRays: Array<GORay>;

  // Does this light ray have a virtual ray attached to it?
  private readonly hasVirtualRay: boolean;

  // there is a maximum of one virtual ray per LightRay
  private readonly virtualRay: GORay | null;

  /**
   * @param opticalObjectPosition - where this LightRay originated
   * @param direction - initial direction of this LightRay
   * @param lightRaysTime - elapsed time of light rays animation
   * @param optic - model of the optic
   * @param opticalImagePosition - point of focus of all rays based on thin lens law
   * @param isImageVirtual - is the optical image virtual?
   * @param raysType
   * @param projectionScreen - optional projection screen that can block the rays
   */
  constructor( opticalObjectPosition: Vector2, direction: Vector2, lightRaysTime: number, optic: Optic, opticalImagePosition: Vector2,
               isImageVirtual: boolean, raysType: RaysType, projectionScreen: ProjectionScreen | null ) {

    assert && AssertUtils.assertNonNegativeNumber( lightRaysTime );

    this.realSegments = [];
    this.virtualSegments = [];

    // {number} maximum travel distance if ray is unimpeded
    const distanceTraveled = GOQueryParameters.lightSpeed * lightRaysTime;

    // ray (position and direction) emerging from optical object
    const initialRay = new GORay( opticalObjectPosition, direction );

    // {Vector2|null} first intersection point - a null value implies that the initialRay does not intersect the optic
    const firstPoint = getFirstPoint( initialRay, optic, raysType );

    this.realRays = getRealRays( initialRay, firstPoint, optic, raysType, opticalImagePosition );

    // If we have a projection screen, check whether the last ray terminates on the projection screen.
    if ( projectionScreen ) {
      const lastRay = this.realRays[ this.realRays.length - 1 ];
      terminateOnProjectionScreen( lastRay, projectionScreen );
    }

    this.hasVirtualRay = hasVirtualRay( isImageVirtual, this.realRays );

    this.virtualRay = this.hasVirtualRay ?
                      getVirtualRay( this.realRays, opticalImagePosition ) :
                      null;

    this.isTargetReached = this.getHasReachedTarget( distanceTraveled, !!projectionScreen, opticalImagePosition );

    // Process rays to convert them to line segments.
    this.raysToSegments( distanceTraveled );
  }

  /**
   * Have the rays reached the target (projection screen or target point)?
   * @param distanceTraveled
   * @param hasProjectionScreen
   * @param opticalImagePosition
   */
  private getHasReachedTarget( distanceTraveled: number, hasProjectionScreen: boolean, opticalImagePosition: Vector2 ): boolean {

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

      // if the Image is virtual, the target point is along the virtual ray,
      // otherwise, the target point probably lies along the last real ray
      const targetRay = this.hasVirtualRay ?
                        this.virtualRay :
                        this.realRays[ this.realRays.length - 1 ];

      // add the last bit of distance to the target
      if ( targetRay ) {
        distance = distance + targetRay.getDistanceTo( opticalImagePosition );
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
 * @param initialRay
 * @param optic
 * @param raysType
 */
function getFirstPoint( initialRay: GORay, optic: Optic, raysType: RaysType ): Vector2 | null {
  const firstIntersection = optic.getFrontShapeTranslated( raysType ).intersection( initialRay );
  return getPoint( firstIntersection );
}

/**
 * Gets all the real rays that form a light ray. The transmitted ray (last ray) is set to be of infinite length by
 * default This can be corrected later if the ray is intercepted by a projectionScreen
 * @param initialRay
 * @param firstPoint
 * @param optic
 * @param raysType
 * @param opticalImagePosition
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
      assert && assert( optic instanceof Lens );

      // {Vector2} find bisecting point of the lens, used to determine outgoing ray
      const intermediatePoint = getIntermediatePoint( initialRay, firstPoint, optic );

      // create a semi-infinite ray starting at intermediate point to the target point
      const transmittedRay = getTransmittedRay( intermediatePoint, opticalImagePosition, optic );

      // determine the intersection of the transmitted ray with the back shape of the optic
      const backIntersection = optic.getBackShapeTranslated().intersection( transmittedRay );

      // back shape point intersecting the transmitted ray
      const backPoint = getPoint( backIntersection );

      // if back point exists, add transmitted and internal ray
      if ( backPoint ) {

        // ray that spans the front to the back of the lens
        const internalRay = new GORay( firstPoint, backPoint.minus( firstPoint ).normalized() );

        // set the internal ray back point
        internalRay.setFinalPoint( backPoint );

        // create a semi-infinite ray, starting at the back point, parallel to target point
        const transmittedRay = getTransmittedRay( backPoint, opticalImagePosition, optic );

        // add the rays
        rays.push( internalRay, transmittedRay );
      }
      else {
        // back shape is not hit, see https://github.com/phetsims/geometric-optics/issues/124

        // create a semi-infinite ray, starting at the front point, parallel to target point
        const transmittedRay = getTransmittedRay( firstPoint, opticalImagePosition, optic );

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
 * @param realRay
 * @param projectionScreen
 */
function terminateOnProjectionScreen( realRay: GORay, projectionScreen: ProjectionScreen ): void {

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
 * Returns null if the rays does not intersect the target point.
 * @param realRays
 * @param opticalImagePosition
 */
function getVirtualRay( realRays: GORay[], opticalImagePosition: Vector2 ): GORay | null {
  assert && assert( realRays.length > 1 );

  const lastRealRay = realRays[ realRays.length - 1 ];

  // Virtual ray has the same position as the real ray, but propagates in the opposite direction.
  const virtualRay = new GORay( lastRealRay.position, lastRealRay.direction.negated() );

  // If the ray intersects the target point, terminate at the target point.
  if ( virtualRay.isPointAlongRay( opticalImagePosition ) ) {
    virtualRay.setFinalPoint( opticalImagePosition );
    return virtualRay;
  }
  else {
    return null;
  }
}

/**
 * Does this LightRay have a virtual ray?
 * @param isImageVirtual
 * @param realRays
 */
function hasVirtualRay( isImageVirtual: boolean, realRays: GORay[] ): boolean {

  // Is the Image virtual and have the real rays refracted?
  return isImageVirtual && realRays.length > 1;
}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;
export type { LightRaySegment };