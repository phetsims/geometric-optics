// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Ray
 *
 * @author Martin Veillette
 */

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
               tandem,
               config ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    config = merge( {
      finalX: null // {number|null}
    }, config );


    const opticPoint = optic.getPosition();

    const distanceTraveled = HORIZONTAL_SPEED * time;

    // final x position of the reals rays
    const endX = sourcePoint.x + distanceTraveled;

    // @public (read-only)
    this.realRay = new Shape();

    // @public (read-only)
    this.virtualRay = new Shape();

    // {Shape} shape that intersects rays
    let intersectionShape;

    if ( lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

      // a straight vertical line going through the middle of the optic
      intersectionShape = Shape.lineSegment( opticPoint.x, -5, opticPoint.x, 5 );
    }
    else {
      const staticShape = optic.outlineAndFillProperty.value.outlineShape;
      intersectionShape = optic.translatedShape( staticShape );
    }

    const ray = new Ray2( sourcePoint, direction );
    const intersections = intersectionShape.intersection( ray );

    if ( intersections && intersections[ 0 ] && intersections[ 0 ].point ) {

      this.realRay.moveToPoint( sourcePoint );

      const intersectionPoint = intersections[ 0 ].point;
      const objectOpticDistance = intersectionPoint.distance( sourcePoint );
      const rayBeyondOptic = ( distanceTraveled > objectOpticDistance );

      const ratio = Math.min( distanceTraveled / objectOpticDistance, 1 );

      this.realRay.lineToPoint( sourcePoint.blend( intersectionPoint, ratio ) );

      if ( rayBeyondOptic ) {

        const m2 = ( targetPoint.y - intersectionPoint.y ) / ( targetPoint.x - intersectionPoint.x );
        const x = ( endX - intersectionPoint.x ) * optic.getTypeSign();

        this.realRay.lineToRelative( x, m2 * x );

        if ( isVirtual ) {
          this.virtualRay.moveToPoint( intersectionPoint );

          const ratio = Math.min( Math.abs( ( endX - intersectionPoint.x ) /
                                            ( targetPoint.x - intersectionPoint.x ) ), 1 );

          this.virtualRay.lineToPoint( intersectionPoint.blend( targetPoint, ratio ) );
        }
      }
    }
    else {
      this.realRay.moveToPoint( sourcePoint );

      this.realRay.lineToPointRelative( direction.multiply( distanceTraveled ) );

    }


  }

  /**
   *
   * @param sourcePoint
   * @param direction
   * @param optic
   * @param targetPoint
   * @param frontShape
   * @param backShape
   * @param middleShape
   * @param topShape
   * @param bottomShape
   */
  findIntersectionsPoint( sourcePoint,
                          direction,
                          optic,
                          targetPoint,
                          frontShape,
                          backShape,
                          middleShape,
                          topShape,
                          bottomShape ) {

    const ray = new Ray2( sourcePoint, direction );
    const frontIntersections = frontShape.intersection( ray );
    const backIntersections = backShape.intersection( ray );
    const topIntersections = frontShape.intersection( ray );
    const middleIntersections = middleShape.intersection( ray );

  }

  /**
   * Find the nearest intersection between a light ray and the set of prisms in the play area
   * @private
   * @param {Ray2} incidentRay - model of the ray
   * @param {Ob} prisms
   * @returns {Intersection|null} - returns the intersection if one was found or null if no intersections
   */
  getIntersection( incidentRay, prisms ) {
    let allIntersections = [];
    prisms.forEach( prism => {
      prism.getIntersections( incidentRay ).forEach( intersection => allIntersections.push( intersection ) );
    } );

    // Get the closest one (which would be hit first)
    allIntersections = _.sortBy( allIntersections, allIntersection => allIntersection.point.distance( incidentRay.tail ) );
    return allIntersections.length === 0 ? null : allIntersections[ 0 ];
  }

}

geometricOptics.register( 'LightRay', LightRay );
export default LightRay;
