// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Ray
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRayMode from './LightRayMode.js';


const HORIZONTAL_SPEED = GeometricOpticsConstants.HORIZONTAL_SPEED;

class LightRay {

  /**
   * @param {Vector2} sourcePoint - the ray's point of origin
   * @param {Vector2} direction - the ray's unit direction vector
   * @param {number} time
   * @param {Optic} optic
   * @param {Vector2} targetPoint
   * @param {boolean} isVirtual
   * @param {LightRayMode} lightRayMode
   * @param {Shape} projectorScreenBisectorLine
   * @param {Property.<Representation>} representationProperty
   * @param {Tandem} tandem
   * @param {Object} config
   */
  constructor( sourcePoint,
               direction,
               time,
               optic,
               targetPoint,
               isVirtual,
               lightRayMode,
               projectorScreenBisectorLine,
               representationProperty,
               tandem,
               config ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    config = merge( {}, config );


    const distanceTraveled = HORIZONTAL_SPEED * time;

    // @public (read-only)
    this.realRay = new Shape();

    // @public (read-only)
    this.virtualRay = new Shape();

    // @public (read-only)
    this.isTargetReachedProperty = new BooleanProperty( false );


    this.setFirstPoint( sourcePoint, direction, optic, lightRayMode );

    this.opticIntersectionPoints = this.getOpticIntersectionPoints( sourcePoint,
      direction,
      optic,
      targetPoint,
      lightRayMode );

    const virtualStartingPoint = isVirtual ? this.getVirtualRayStartingPoint( this.opticIntersectionPoints, optic ) : null;

    let projectorPoint = null;
    if ( representationProperty.value !== representationProperty.value.isObject ) {

      const emergingRay = ( this.firstPoint ) ?
                          this.getTransmittedRay( this.firstPoint, targetPoint, optic ) :
                          new Ray2( sourcePoint, direction );
      projectorPoint = this.getPointOnProjectorScreen( emergingRay, projectorScreenBisectorLine );

    }
    if ( projectorPoint ) {
      this.points = this.opticIntersectionPoints.push( projectorPoint );
    }


  }


  /**
   * set the first intersection Point
   *
   * @private
   * @param {Vector2} sourcePoint
   * @param {Vector2} direction
   * @param {Optic} optic
   * @param {LightRayMode} lightRayMode
   */
  setFirstPoint( sourcePoint,
                 direction,
                 optic,
                 lightRayMode ) {


    const initialRay = new Ray2( sourcePoint, direction );
    const firstIntersection = this.getFirstShape( optic, lightRayMode ).intersection( initialRay );

    // @public {Vector2|null}
    this.firstPoint = this.getPoint( firstIntersection );
  }

  /**
   * get all the points that intersect with the optic
   *
   * @private
   * @param {Vector2} sourcePoint
   * @param {Vector2} direction
   * @param {Optic} optic
   * @param {Vector2} targetPoint
   * @param {LightRayMode} lightRayMode
   * @returns {Vector2[]} intersectionPoints
   */
  getOpticIntersectionPoints( sourcePoint,
                              direction,
                              optic,
                              targetPoint,
                              lightRayMode ) {

    const intersectionPoints = [];

    if ( this.firstPoint ) {

      if ( optic.isMirror() || lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

        intersectionPoints.push( this.firstPoint );
      }
      else {

        const initialRay = new Ray2( sourcePoint, direction );
        const frontIntersection = this.getLensFrontShape( optic ).intersection( initialRay );
        const frontPoint = this.getPoint( frontIntersection );

        const transmittedRay = this.getTransmittedRay( this.firstPoint, targetPoint, optic );
        const backIntersection = this.getLensBackShape( optic ).intersection( transmittedRay );
        const backPoint = this.getPoint( backIntersection );

        if ( frontPoint && backPoint ) {
          intersectionPoints.push( frontPoint, backPoint );
        }
      }
    }
    return intersectionPoints;
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

    if ( lightRayMode === LightRayMode.PRINCIPAL ) {

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
   * @param {Vector2[]} opticIntersectionPoints
   * @param {Optic} optic
   * @returns {Vector2|null} startingPoint
   */
  getVirtualRayStartingPoint( opticIntersectionPoints, optic ) {

    if ( opticIntersectionPoints.length > 0 ) {
      return opticIntersectionPoints[ opticIntersectionPoints.length - 1 ];
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
   * @param  {number} distance
   */
  getFinalRealPoint( sourcePoint, distance ) {

    const intersectionPoints = Array.from( this.opticIntersectionPoints );
    let lightDistance = 0;
    let firstPoint = sourcePoint;
    while ( lightDistance < distance ) {
      const point = intersectionPoints.shift();
      lightDistance = lightDistance + firstPoint.distance( point );
      firstPoint = point;
    }

  }
}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;
