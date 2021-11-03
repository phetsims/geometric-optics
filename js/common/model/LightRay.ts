// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Ray
 * A LightRay is made of several contiguous Rays
 * A light Ray can fork to have real and virtual ray components.
 * The lightRay has a flag that determines if it has reached a target
 * This class is responsible for the line segments that describe one ray.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
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

  // there is a maximum of one virtual ray per lightRay
  private readonly virtualRay: Ray | null;

  /**
   * @param {Ray} initialRay - ray (position and direction) emerging from source
   * @param {number} time - value of model time in seconds needed for the purpose of the animation
   * @param {Optic} optic - model of the optic
   * @param {Vector2} targetPoint - point of focus of all rays based on thin lens law
   * @param {boolean} isVirtual - is the image virtual
   * @param {boolean} isPrincipalRayMode - is the light ray mode set to Principal rays
   * @param {boolean} isProjectionScreenPresent - is there a projection screen in the experiment area
   * @param {function():Shape} getProjectionScreenBisectorLine - returns a Shape that bisects the middle of projection screen
   */
  constructor( initialRay: Ray, time: number, optic: Optic, targetPoint: Vector2, isVirtual: boolean,
               isPrincipalRayMode: boolean, isProjectionScreenPresent: boolean,
               getProjectionScreenBisectorLine: () => Shape ) {

    assert && AssertUtils.assertNonNegativeNumber( time );

    this.realSegments = [];
    this.virtualSegments = [];

    // {number} maximum travel distance if ray is unimpeded
    const distanceTraveled = GeometricOpticsQueryParameters.lightSpeed * time;

    // {Vector2|null} first intersection point - a null value implies that the initialRay does not intersect the optic
    const firstPoint = this.getFirstPoint( initialRay, optic, isPrincipalRayMode );

    this.realRays = this.getRealRays( initialRay, firstPoint, optic, isPrincipalRayMode, targetPoint );

    // if the last ray intercepts the projection screen, its final point will be set on the last ray
    if ( isProjectionScreenPresent ) {
      this.setFinalPointProjectionScreen( this.realRays, getProjectionScreenBisectorLine() );
    }

    this.hasVirtualRay = this.hasVirtualComponent( isVirtual, this.realRays );

    this.virtualRay = this.hasVirtualRay ?
                      this.getVirtualRay( this.realRays, targetPoint ) :
                      null;

    this.isTargetReached = this.getHasReachedTarget( distanceTraveled, isProjectionScreenPresent, targetPoint );

    // process rays to convert them to line segments
    this.raysToSegments( distanceTraveled );
  }

  /**
   * Has the rays reached the target (projection screen or target point)?
   * @private
   * @param {number} distanceTraveled
   * @param {boolean} isProjectionScreenPresent
   * @param {Vector2} targetPoint
   * @returns {boolean}
   */
  getHasReachedTarget( distanceTraveled: number, isProjectionScreenPresent: boolean, targetPoint: Vector2 ) {

    let distance = 0;

    if ( isProjectionScreenPresent ) {

      // distance to screen
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

      if ( targetRay instanceof Ray ) {

        // add the last bit of distance to the target
        distance = distance + targetRay.getDistanceTo( targetPoint );
      }
    }

    // only rays that have been refracted (or reflected) that have traveled long enough can reach the target.
    return this.realRays.length > 1 && distanceTraveled > distance;
  }

  /**
   * Gets the first intersection Ppoint.
   * @private
   * @param {Ray} initialRay
   * @param {Optic} optic
   * @param {boolean} isPrincipalRayMode
   * @returns {Vector2|null}
   */
  getFirstPoint( initialRay: Ray, optic: Optic, isPrincipalRayMode: boolean ) {
    const firstIntersection = this.getFirstShape( optic, isPrincipalRayMode ).intersection( initialRay );
    return this.getPoint( firstIntersection );
  }

  /**
   * Gets all the real rays that form a light ray. The transmitted ray (last ray) is set to be of infinite length by
   * default This can be corrected later if the ray is intercepted by a projection screen
   * @private
   * @param {Ray} initialRay
   * @param {Vector2|null} firstPoint
   * @param {Optic} optic
   * @param {boolean} isPrincipalRayMode
   * @param {Vector2} targetPoint
   * @returns {Ray[]} Rays
   */
  getRealRays( initialRay: Ray, firstPoint: Vector2 | null, optic: Optic, isPrincipalRayMode: boolean, targetPoint: Vector2 ) {

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
      if ( optic.isMirror() || isPrincipalRayMode ) {

        // add the semi infinite transmitted transmitted ray
        rays.push( this.getTransmittedRay( firstPoint, targetPoint, optic ) );
      }
      else {
        // must be lens with light ray mode that is not principal rays

        // {Vector2} find bisecting point of the lens, used to determine outgoin ray
        const intermediatePoint = this.getIntermediatePoint( initialRay, firstPoint, optic );

        // create a semi infinite ray starting at intermediate point to the target point
        const transmittedRay = this.getTransmittedRay( intermediatePoint, targetPoint, optic );

        // determine the intersection of the transmitted ray with the back shape of the optic
        const backIntersection = this.getLensBackShape( optic ).intersection( transmittedRay );

        // {Vector2|null} back shape point intersecting the transmitted ray
        const backPoint = this.getPoint( backIntersection );

        // if back point exists, add transmitted and internal ray
        if ( backPoint instanceof Vector2 ) {

          // ray that spans the front to the back of the lens
          const internalRay = new Ray( firstPoint, backPoint.minus( firstPoint ).normalized() );

          // set the internal ray back point
          internalRay.setFinalPoint( backPoint );

          // create a semi-infinite ray, starting at the back point, parallel to target point
          const transmittedRay = this.getTransmittedRay( backPoint, targetPoint, optic );

          // add the rays
          rays.push( internalRay, transmittedRay );
        }
        else {
          // back shape is not hit, see https://github.com/phetsims/geometric-optics/issues/124

          // create a semi-infinite ray, starting at the front point, parallel to target point
          const transmittedRay = this.getTransmittedRay( firstPoint, targetPoint, optic );

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
   * @private
   * @param {Ray} initialRay
   * @param {Vector2} firstPoint
   * @param {Optic} optic
   * @returns {Vector2}
   */
  getIntermediatePoint( initialRay: Ray, firstPoint: Vector2, optic: Optic ) {

    // displacement vector from the source to the optic position
    const opticSourceVector = optic.positionProperty.value.minus( initialRay.position );

    // displacement vector from the source to the first point hit by the ray.
    const firstSourceVector = firstPoint.minus( initialRay.position );

    // return a point that will be directed along the initial ray but has an
    // x position that is equal to opticPosition.x
    return initialRay.position.blend( firstPoint, opticSourceVector.x / firstSourceVector.x );
  }

  /**
   * Gets the shape of the curved front (left hand side) of the lens.
   * @private
   * @param {Optic} optic
   * @returns {Shape}
   */
  getLensFrontShape( optic: Optic ) {
    assert && assert( optic.isLens(), 'optic must be Lens' );
    const shapes = optic.shapesProperty.value;
    return optic.translatedShape( shapes.frontShape );
  }

  /**
   * Gets the shape of the curved back (right hand side) of the lens.
   * @private
   * @param {Optic} optic
   * @returns {Shape}
   */
  getLensBackShape( optic: Optic ) {
    assert && assert( optic.isLens(), 'optic must be Lens' );
    const backShape = optic.shapesProperty.value.backShape; // {Shape|null}
    assert && assert( backShape );
    return optic.translatedShape( backShape! );
  }

  /**
   * Gets the shape that the initial ray will intersect.
   * @private
   * @param {Optic} optic
   * @param {boolean} isPrincipalRayMode
   * @returns {Shape}
   */
  getFirstShape( optic: Optic, isPrincipalRayMode: boolean ) {

    // for principal rays, the rays are refracted at a vertical line
    if ( isPrincipalRayMode ) {

      return optic.getVerticalAxis();
    }
    else {

      // get the first surface of the optic
      const staticShape = optic.shapesProperty.value.frontShape;
      return optic.translatedShape( staticShape );
    }
  }

  /**
   * Processes a point from the intersection. Returns null if the point cannot be found.
   * @private
   * @param {Array.<Intersection>} intersection
   * @returns {Vector2|null}
   */
  getPoint( intersection: any ) { //TODO any - see https://github.com/phetsims/kite/issues/93

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
   * @private
   * @param {Vector2} originPoint
   * @param {Vector2} targetPoint
   * @param {Optic} optic
   * @returns {Ray}
   */
  getTransmittedRay( originPoint: Vector2, targetPoint: Vector2, optic: Optic ) {

    const direction = originPoint.minus( targetPoint ).normalized();

    // real rays should only propagate to the right for lens and to left for a mirror
    if ( optic.isLens() && direction.x < 0 || optic.isMirror() && direction.x > 0 ) {
      direction.negate();
    }
    return new Ray( originPoint, direction );
  }

  /**
   * Returns a virtual ray that is opposite to the last real ray.
   * If the virtual ray does not exist or does not line up with the target point, it returns null.
   * @private
   * @param {Ray[]} realRays
   * @param {Vector2} targetPoint
   * @returns {Ray|null} virtualRay
   */
  getVirtualRay( realRays: Ray[], targetPoint: Vector2 ) {

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
   * Sets the final point of the real ray if it intersects with the vertical median of the projection screen.
   * @private
   * @param {Ray[]} realRays
   * @param {Shape} projectionScreenBisectorLine
   */
  setFinalPointProjectionScreen( realRays: Ray[], projectionScreenBisectorLine: Shape ) {

    // ensure that real rays has at least one ray
    if ( realRays.length > 0 ) {

      // the projection screen can only intersect with the last ray
      const lastRay = realRays[ realRays.length - 1 ];

      const intersection = projectionScreenBisectorLine.intersection( lastRay );

      // {Vector2|null}
      const pointOnScreen = this.getPoint( intersection );

      // if intersection is found, set the transmittedRay final point
      if ( pointOnScreen instanceof Vector2 ) {
        lastRay.setFinalPoint( pointOnScreen );
      }
    }
  }

  /**
   * Has the light ray a virtual component (virtual ray)?
   * @private
   * @param {boolean} isImageVirtual
   * @param {Ray[]} realRays
   * @returns {boolean}
   */
  hasVirtualComponent( isImageVirtual: boolean, realRays: Ray[] ) {

    // is the image virtual and has the real rays refracted
    return isImageVirtual && realRays.length > 1;
  }

  /**
   * Processes all the rays (virtual and real) into line segments.
   * @private
   * @param {number} distanceTraveled
   */
  raysToSegments( distanceTraveled: number ) {

    // {number} remaining distance to travel for the ray
    let remainingDistance = distanceTraveled;

    // counter for real rays
    let i = 0;

    // Process until we cover the entire distance, or until we ran out of rays.
    while ( remainingDistance > 0 && i < this.realRays.length ) {

      // Real ray being processed
      const realRay = this.realRays[ i ];

      // Determine the distance covered by the line ray.
      const realRayDistance = Math.min( remainingDistance, realRay.getLength() );
      const realEndPoint = realRay.pointAtDistance( realRayDistance );

      // Add a line segment based on the traveling distance of the ray being processed
      this.realSegments.push( new LightRaySegment( realRay.position, realEndPoint ) );

      // Wait to process virtual ray until the virtual starting point matches the starting point of the ray being processed.
      if ( this.virtualRay instanceof Ray && this.virtualRay.position === realRay.position ) {

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

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;