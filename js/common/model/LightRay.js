// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Ray
 * A Light Ray is made of several sub rays
 *
 * @author Martin Veillette
 */

import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRayMode from './LightRayMode.js';

const HORIZONTAL_SPEED = GeometricOpticsConstants.HORIZONTAL_SPEED;

class LightRay {

  /**
   * @param {Ray2} initialRay
   * @param {number} time
   * @param {Optic} optic
   * @param {Vector2} targetPoint
   * @param {boolean} isVirtual
   * @param {LightRayMode} lightRayMode
   * @param {Shape} projectorScreenBisectorLine
   * @param {Property.<Representation>} representationProperty
   * @param {Tandem} tandem
   */
  constructor( initialRay,
               time,
               optic,
               targetPoint,
               isVirtual,
               lightRayMode,
               projectorScreenBisectorLine,
               representationProperty,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @private  maximum travel distance for rays
    this.distanceTraveled = HORIZONTAL_SPEED * time;

    // @public (read-only)
    this.realRay = new Shape();

    // @public (read-only)
    this.virtualRay = new Shape();

    // @public (read-only)
    this.isTargetReached = false;

    // @private {Vector2||null} - a null value implies that the initialRay does not intersect the optic
    this.firstPoint = this.getFirstPoint( initialRay, optic, lightRayMode );

    // @private {Ray2[]}
    this.opticRays = this.getOpticRays( initialRay, this.firstPoint, optic, lightRayMode, targetPoint );

    // @public {Vector2||null}
    this.projectorPoint = null;

    // if a projector screen is present, get the point of intersection of the ray and projector screen (if intersecting)
    if ( !representationProperty.value.isObject ) {

      // the projector screen can only intersect with the last ray
      const lastRay = this.opticRays[ this.opticRays.length - 1 ];

      // @public {Vector2||null} a null value implies that the lastRay is unimpeded.
      this.projectorPoint = this.getPointOnProjectorScreen( lastRay, projectorScreenBisectorLine );

    }

    this.distanceArray = this.getDistanceArray( this.opticRays, this.projectorPoint );


    // @public {Vector2||null}
    this.virtualStartingPoint = isVirtual ?
                                this.getVirtualRayStartingPoint( this.opticRays, optic ) : null;

    this.virtualRayNominalDistance = 0;
    if ( this.virtualStartingPoint instanceof Vector2 ) {
      this.virtualRayNominalDistance = this.virtualStartingPoint.distance( targetPoint );
    }

    this.realRayToShape();

  }


  /**
   * get the first intersection Point
   *
   * @private
   * @param {Ray2} initialRay
   * @param {Optic} optic
   * @param {LightRayMode} lightRayMode
   * @returns {Vector2||null}
   */
  getFirstPoint( initialRay,
                 optic,
                 lightRayMode ) {

    const firstIntersection = this.getFirstShape( optic, lightRayMode ).intersection( initialRay );

    return this.getPoint( firstIntersection );
  }

  /**
   * get all the points that intersect with the optic
   *
   * @private
   * @param {Ray2} initialRay
   * @param {Vector2||null} firstPoint
   * @param {Optic} optic
   * @param {LightRayMode} lightRayMode
   * @param {Vector2} targetPoint
   * @returns {Ray2[]} Rays
   */
  getOpticRays( initialRay,
                firstPoint,
                optic,
                lightRayMode,
                targetPoint ) {

    const rays = [];

    rays.push( initialRay );

    if ( firstPoint instanceof Vector2 ) {

      if ( optic.isMirror() || lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

        rays.push( this.getTransmittedRay( firstPoint, targetPoint, optic ) );
      }
      else {

        const frontIntersection = this.getLensFrontShape( optic ).intersection( initialRay );
        const frontPoint = this.getPoint( frontIntersection );

        const transmittedRay = this.getTransmittedRay( firstPoint, targetPoint, optic );

        const backIntersection = this.getLensBackShape( optic ).intersection( transmittedRay );
        const backPoint = this.getPoint( backIntersection );

        if ( frontPoint && backPoint ) {
          const internalRay = new Ray2( frontPoint, backPoint.minus( frontPoint ).normalized() );

          const transmittedRay = this.getTransmittedRay( backPoint, targetPoint, optic );
          rays.push( internalRay, transmittedRay );
        }
      }
    }
    return rays;
  }

  /**
   * @private
   * @param {Optic} optic
   * @returns {Shape}
   */
  getLensFrontShape( optic ) {

    assert && assert( optic.isLens(), 'optic must be Lens' );
    const shapes = optic.outlineAndFillProperty.value;
    return optic.translatedShape( shapes.frontShape );
  }

  /**
   * @private
   * @param {Optic} optic
   * @returns {Shape}
   */
  getLensBackShape( optic ) {
    assert && assert( optic.isLens(), 'optic must be Lens' );
    const shapes = optic.outlineAndFillProperty.value;
    return optic.translatedShape( shapes.backShape );
  }

  /**
   * @private
   * @param {Optic} optic
   * @param {LightRayMode} lightRayMode
   * @returns {Shape}
   */
  getFirstShape( optic,
                 lightRayMode ) {

    if ( lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

      const opticPoint = optic.positionProperty.value;

      // a straight vertical line going through the middle of the optic
      return Shape.lineSegment( opticPoint.x, -5, opticPoint.x, 5 );
    }
    else if ( optic.isLens() ) {
      const staticShape = optic.outlineAndFillProperty.value.middleShape;
      return optic.translatedShape( staticShape );
    }
    else { // isMirror
      const staticShape = optic.outlineAndFillProperty.value.outlineShape;
      return optic.translatedShape( staticShape );
    }
  }

  /**
   * @private
   * @param intersection
   * @returns {Vector2|null}
   */
  getPoint( intersection ) {
    if ( intersection && intersection[ 0 ] && intersection[ 0 ].point ) {
      return intersection[ 0 ].point;
    }
    else {
      return null;
    }
  }

  /**
   * @private
   * @param {Vector2} originPoint
   * @param {Vector2} targetPoint
   * @param {Optic} optic
   * @returns {Ray2}
   */
  getTransmittedRay( originPoint, targetPoint, optic ) {

    const direction = originPoint.minus( targetPoint ).normalized();

    // real rays should only propagate to the right for lens and to left for a mirror
    if ( optic.isLens() && direction.x < 0 || optic.isMirror() && direction.x > 0 ) {
      direction.negate();
    }
    return new Ray2( originPoint, direction );
  }

  /**
   * @private
   * @param {Ray2[]} opticRays
   * @param {Optic} optic
   * @returns {Vector2|null} startingPoint
   */
  getVirtualRayStartingPoint( opticRays, optic ) {

    if ( opticRays.length > 1 ) {
      const lastRay = opticRays[ opticRays.length - 1 ];
      return lastRay.position;
    }
    else {
      return null;
    }
  }

  /**
   * @private
   * @param {Ray2} transmittedRay
   * @param {Shape} projectorScreenBisectorLine
   * @returns {Vector2|null}
   */
  getPointOnProjectorScreen( transmittedRay, projectorScreenBisectorLine ) {
    const intersection = projectorScreenBisectorLine.intersection( transmittedRay );
    return this.getPoint( intersection );
  }

  /**
   * @private
   * @param {number} distance
   * @returns {{point, ray}}
   */
  getFinalPointAndRay( distance ) {

    let totalDistance = 0;
    const numberOfRays = this.opticRays.length;

    let i = 1;

    if ( numberOfRays > 1 ) {
      while ( totalDistance < distance && i < numberOfRays ) {
        const additionalDistance = this.opticRays[ i - 1 ].position.distance( this.opticRays[ i ].position );
        totalDistance = totalDistance + additionalDistance;
        i++;
      }
    }

    const excessDistance = totalDistance - distance;

    if ( excessDistance > 0 ) {

      return {
        finalPoint: this.opticRays[ i - 2 ].pointAtDistance( excessDistance ),
        ray: this.opticRays[ i - 2 ]
      };
    }
    else {
      return {
        finalPoint: this.opticRays[ i - 1 ].pointAtDistance( -excessDistance ),
        ray: this.opticRays[ i - 1 ]
      };

    }

  }

  /**
   * @private
   */
  realRayToShape() {

    let remainingDistance = this.distanceTraveled;
    let i = 0;

    while ( remainingDistance > 0 ) {
      if ( !( this.opticRays[ i ] instanceof Ray2 ) ) {
        // debugger;
      }
      const startingPoint = this.opticRays[ i ].position;
      const direction = this.opticRays[ i ].direction;
      const rayDistance = this.distanceArray[ i ];

      let endPoint;
      if ( remainingDistance - rayDistance > 0 ) {
        endPoint = this.opticRays[ i ].pointAtDistance( rayDistance );
        remainingDistance = remainingDistance - rayDistance;
      }
      else {
        endPoint = this.opticRays[ i ].pointAtDistance( remainingDistance );
        remainingDistance = 0;
      }

      this.realRay.moveToPoint( startingPoint ).lineToPoint( endPoint );

      if ( this.virtualStartingPoint === startingPoint ) {

        const virtualRay = new Ray2( startingPoint, direction.negated() );
        const virtualRayDistance = Math.min( this.virtualRayNominalDistance );
        const virtualEndPoint = virtualRay.pointAtDistance( virtualRayDistance );

        this.virtualRay.moveToPoint( this.virtualStartingPoint ).lineToPoint( virtualEndPoint );
      }
      i++;
    }
  }

  /**
   * @private
   * @param {Ray2[]} opticRays
   * @param {Vector2||null} screenPoint
   * @returns {number[]} distances
   */
  getDistanceArray( opticRays, screenPoint ) {

    // array of distance travelled by rays
    const distanceArray = [];

    // number of rays
    const numberOfRays = this.opticRays.length;

    // loop over the array of rays (excluding the last ray)
    for ( let i = 0; i < numberOfRays - 1; i++ ) {
      // determine the length travelled by ray
      const distance = this.opticRays[ i ].position.distance( this.opticRays[ i + 1 ].position );
      distanceArray.push( distance );
    }

    // address the last ray

    // if screePoint is present, find the distance of last ray
    if ( screenPoint instanceof Vector2 ) {
      const distance = this.opticRays[ numberOfRays - 1 ].position.distance( screenPoint );
      distanceArray.push( distance );
    }
    else {

      // if there is no screen the ray is not bounded
      distanceArray.push( Infinity );
    }
    return distanceArray;
  }
}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;
