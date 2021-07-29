// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Ray
 * A LightRay is made of several contiguous Rays
 * A light Ray can fork to have real and virtual ray components.
 * The lightRay has a flag that determines if it has reached a target
 *
 * The main purpose of this class is to determine the kite-Shape of the real and virtual light-ray
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Ray from './Ray.js';

const LIGHT_SPEED = GeometricOpticsConstants.LIGHT_SPEED;

class LightRay {

  /**
   * @param {Ray} initialRay - ray (position and direction) emerging from source
   * @param {number} time - value of model time in seconds needed for the purpose of the animation
   * @param {Optic} optic - model of the optic
   * @param {Vector2} targetPoint - point of focus of all rays based on thin lens law
   * @param {boolean} isVirtual - is the image virtual
   * @param {boolean} isPrincipalRayMode - is the light ray mode set to Principal rays
   * @param {boolean} isProjectorScreenPresent - is there a projector screen in the play area
   * @param {function} getProjectorScreenBisectorLine - returns a Shape that bisects the middle of projector screen
   * @param {Tandem} tandem
   */
  constructor( initialRay,
               time,
               optic,
               targetPoint,
               isVirtual,
               isPrincipalRayMode,
               isProjectorScreenPresent,
               getProjectorScreenBisectorLine,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public (read-only) - shape of the real rays - will be updated later
    this.realShape = new Shape();

    // @public (read-only) - shape of the virtual rays - will be updated later
    this.virtualShape = new Shape();

    // {number} maximum travel distance if ray is unimpeded
    const distanceTraveled = LIGHT_SPEED * time;

    // {Vector2|null} first intersection point - a null value implies that the initialRay does not intersect the optic
    const firstPoint = this.getFirstPoint( initialRay, optic, isPrincipalRayMode );

    // @private {Ray[]} - a collection of sequential rays
    this.realRays = this.getRealRays( initialRay, firstPoint, optic, isPrincipalRayMode, targetPoint );

    if ( isProjectorScreenPresent ) {

      // if the last ray intercepts the projector screen, its final point will be set on the last ray
      this.setFinalPointProjectorScreen( this.realRays, getProjectorScreenBisectorLine() );
    }

    // @private {boolean} has this light ray a virtual ray attached to it.
    this.hasVirtualRay = this.hasVirtualComponent( isVirtual, this.realRays );

    // is there a virtual image AND has the lightRay a virtual component
    if ( this.hasVirtualRay ) {

      // @private {Ray} - there is a maximum of one virtual ray per lightRay
      this.virtualRay = this.getVirtualRay( this.realRays, targetPoint );
    }

    // @public (read-only) {boolean}
    this.isTargetReached = this.getHasReachedTarget(
      distanceTraveled,
      isProjectorScreenPresent,
      targetPoint );

    // process rays to convert them to virtualShape and realShape
    this.raysToShape( distanceTraveled );

  }

  /**
   * has the rays reached the target (projector screen or target point)
   * @private
   * @param {number} distanceTraveled
   * @param {boolean} isProjectorScreenPresent
   * @param {Vector2} targetPoint
   * @returns {boolean}
   */
  getHasReachedTarget( distanceTraveled,
                       isProjectorScreenPresent,
                       targetPoint ) {

    let distance = 0;

    if ( isProjectorScreenPresent ) {

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
      const targetRay = this.hasVirtualRay ? this.virtualRay :
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
   * get the first intersection Point
   *
   * @private
   * @param {Ray} initialRay
   * @param {Optic} optic
   * @param {boolean} isPrincipalRayMode
   * @returns {Vector2|null}
   */
  getFirstPoint( initialRay,
                 optic,
                 isPrincipalRayMode ) {

    const firstIntersection = this.getFirstShape( optic, isPrincipalRayMode ).intersection( initialRay );

    return this.getPoint( firstIntersection );
  }

  /**
   * get all the real rays that form a light ray
   *
   * The transmitted ray (last ray) is set to be of infinite length by default
   * This can be corrected later if the ray is intercepted by a projector screen
   *
   * @private
   * @param {Ray} initialRay
   * @param {Vector2|null} firstPoint
   * @param {Optic} optic
   * @param {boolean} isPrincipalRayMode
   * @param {Vector2} targetPoint
   * @returns {Ray[]} Rays
   */
  getRealRays( initialRay,
               firstPoint,
               optic,
               isPrincipalRayMode,
               targetPoint ) {

    // array to store all the rays
    const rays = [];

    // add the initial ray
    rays.push( initialRay );

    if ( firstPoint instanceof Vector2 ) {

      if ( optic.isMirror() || isPrincipalRayMode ) {

        // update the final point of the initial ray
        initialRay.setFinalPoint( firstPoint );

        // add the initial and transmitted ray
        rays.push( this.getTransmittedRay( firstPoint, targetPoint, optic ) );
      }
      else {
        // must be lens with light ray mode that is not principal rays

        // determine intersection of initial right with the front shape of the lens
        const frontIntersection = this.getLensFrontShape( optic ).intersection( initialRay );

        // {Vector2|null} front shape point intersecting the initial ray
        const frontPoint = this.getPoint( frontIntersection );

        // create a semi infinite ray starting at firstPoint parallel to the target point
        const transmittedRay = this.getTransmittedRay( firstPoint, targetPoint, optic );

        // determine the intersection of the transmitted ray with the back shape of the optic
        const backIntersection = this.getLensBackShape( optic ).intersection( transmittedRay );

        // {Vector2|null} back shape point intersecting the transmitted ray
        const backPoint = this.getPoint( backIntersection );

        // add additional rays only if the front lens is hit
        if ( frontPoint instanceof Vector2 ) {

          // set initial ray final point to be the front point of the lens
          initialRay.setFinalPoint( frontPoint );

          // if back point is hit add transmitted and internal ray
          if ( backPoint instanceof Vector2 ) {

            // ray that spans the front  the back of the lens
            const internalRay = new Ray( frontPoint, backPoint.minus( frontPoint ).normalized() );

            // set the internal ray back point
            internalRay.setFinalPoint( backPoint );

            // create a semi-infinite ray, starting at the back point, parallel to target point
            const transmittedRay = this.getTransmittedRay( backPoint, targetPoint, optic );

            // add the rays
            rays.push( internalRay, transmittedRay );
          }
          else {
            // back shape is not hit
            // see issue #124

            // create a semi-infinite ray, starting at the front point, parallel to target point
            const transmittedRay = this.getTransmittedRay( frontPoint, targetPoint, optic );

            // add the rays
            rays.push( transmittedRay );
          }
        }
      }
    }
    return rays;
  }

  /**
   * shape of the curved front (left hand side) of the lens
   * @private
   * @param {Optic} optic
   * @returns {Shape}
   */
  getLensFrontShape( optic ) {

    assert && assert( optic.isLens(), 'optic must be Lens' );
    const shapes = optic.shapesProperty.value;
    return optic.translatedShape( shapes.frontShape );
  }

  /**
   * shape of the curved back (right hand side) of the lens
   * @private
   * @param {Optic} optic
   * @returns {Shape}
   */
  getLensBackShape( optic ) {
    assert && assert( optic.isLens(), 'optic must be Lens' );
    const shapes = optic.shapesProperty.value;
    return optic.translatedShape( shapes.backShape );
  }

  /**
   * get the shape that the initial ray will intersect
   * @private
   * @param {Optic} optic
   * @param {boolean} isPrincipalRayMode
   * @returns {Shape}
   */
  getFirstShape( optic,
                 isPrincipalRayMode ) {

    // for principal rays, the rays are refracted at a vertical line
    if ( isPrincipalRayMode ) {

      return optic.getPrincipalLine();
    }
    else if ( optic.isLens() ) {

      // get the vertical (middle) line spanning the lens
      const staticShape = optic.shapesProperty.value.middleShape;

      return optic.translatedShape( staticShape );
    }
    else { // isMirror &&  not principal rays

      // get the first surface of the mirror
      const staticShape = optic.shapesProperty.value.frontShape;
      return optic.translatedShape( staticShape );
    }
  }

  /**
   * process a point from the intersection
   * returns null if the point cannot be found
   *
   * @private
   * @param {Intersection[]} intersection
   * @returns {Vector2|null}
   */
  getPoint( intersection ) {

    // all shapes have been defined as line (straight or curved) so there can only be one intersection point at most
    if ( intersection && intersection[ 0 ] && intersection[ 0 ].point ) {
      return intersection[ 0 ].point;
    }
    else {
      return null;
    }
  }

  /**
   * returns a semi infinite ray starting at originPoint
   * The ray is along (or opposite to) the direction of targetPoint
   * @private
   * @param {Vector2} originPoint
   * @param {Vector2} targetPoint
   * @param {Optic} optic
   * @returns {Ray}
   */
  getTransmittedRay( originPoint, targetPoint, optic ) {

    const direction = originPoint.minus( targetPoint ).normalized();

    // real rays should only propagate to the right for lens and to left for a mirror
    if ( optic.isLens() && direction.x < 0 || optic.isMirror() && direction.x > 0 ) {
      direction.negate();
    }
    return new Ray( originPoint, direction );
  }

  /**
   * returns a virtual ray that is opposite to the last real ray
   * If the virtual ray does not exist or does not line up with the target point, it returns null
   * @private
   * @param {Ray[]} realRays
   * @param {Vector2} targetPoint
   * @returns {Ray|null} virtualRay
   */
  getVirtualRay( realRays, targetPoint ) {

    // to have a virtual ray, the initial ray must be deflected
    if ( realRays.length > 1 ) {

      // last real ray
      const lastRay = realRays[ realRays.length - 1 ];

      // virtual ray propagates in the opposite direction to the ray but same initial position
      const virtualRay = new Ray( lastRay.position, lastRay.direction.negated() );

      // ensure that the virtual ray is along the target point
      if ( virtualRay.isPointAlongRay( targetPoint, 1e-4 ) ) {

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
   * set the final point of the real ray if it intersects with the vertical median of the projector
   * @private
   * @param {Ray[]} realRays
   * @param {Shape} projectorScreenBisectorLine
   */
  setFinalPointProjectorScreen( realRays, projectorScreenBisectorLine ) {

    // ensure that real rays has at least one ray
    if ( realRays.length > 0 ) {

      // the projector screen can only intersect with the last ray
      const lastRay = realRays[ realRays.length - 1 ];

      const intersection = projectorScreenBisectorLine.intersection( lastRay );

      // {Vector2|null}
      const pointOnScreen = this.getPoint( intersection );

      // if intersection is found, set the transmittedRay final point
      if ( pointOnScreen instanceof Vector2 ) {
        lastRay.setFinalPoint( pointOnScreen );
      }
    }
  }

  /**
   * has the light ray a virtual component (virtual ray)
   * @private
   * @returns {boolean}
   */
  hasVirtualComponent( isImageVirtual, realRays ) {

    // is the image virtual and has the real rays refracted
    return isImageVirtual && realRays.length > 1;
  }

  /**
   * process all the rays (virtual and real) into shape lines.
   * @private
   * @param {number} distanceTraveled
   *
   */
  raysToShape( distanceTraveled ) {

    // {number} remaining distance to travel for the ray
    let remainingDistance = distanceTraveled;

    // counter for real rays
    let i = 0;

    // process until we cover the entire distance  or until we ran out of rays
    while ( remainingDistance > 0 && i < this.realRays.length ) {

      // ray being processed
      const currentRay = this.realRays[ i ];

      // determine the distance covered by the line ray
      const realRayDistance = Math.min( remainingDistance, currentRay.getLength() );

      // update the real shape based on the traveling distance of the ray being processed
      this.updateShape( this.realShape, currentRay, realRayDistance );

      // wait to process virtual ray until the virtual starting point matches the starting point of the ray being processed
      if ( this.virtualRay instanceof Ray && this.virtualRay.position === currentRay.position ) {

        // determine the distance of the virtual ray
        const virtualRayDistance = Math.min( remainingDistance, this.virtualRay.getLength() );

        // update the virtual ray shape based on the virtual ray
        this.updateShape( this.virtualShape, this.virtualRay, virtualRayDistance );
      }
      // update the value of the distance remaining
      remainingDistance = remainingDistance - realRayDistance;

      // update the realRay counter
      i++;
    }
  }

  /**
   * update the shape of the lightray (be it virtual or real)  based on a model ray
   * @private
   *
   * @param {Shape} shape
   * @param {Ray} ray
   * @param {number} travelDistance
   */
  updateShape( shape, ray, travelDistance ) {

    // determine the end point based on the travel distance
    const endPoint = ray.pointAtDistance( travelDistance );

    // add line to shape
    shape.moveToPoint( ray.position ).lineToPoint( endPoint );

  }
}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;
