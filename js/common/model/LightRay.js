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

    if ( optic.isMirror() || lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {
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
    else {

      const shapes = optic.outlineAndFillProperty.value;
      const frontShape = optic.translatedShape( shapes.frontShape );
      const backShape = optic.translatedShape( shapes.backShape );
      const middleShape = optic.translatedShape( shapes.middleShape );

      const ray = new Ray2( sourcePoint, direction );
      const middleIntersections = middleShape.intersection( ray );
      const frontIntersections = frontShape.intersection( ray );

      if ( middleIntersections && middleIntersections[ 0 ] && middleIntersections[ 0 ].point ) {
        const midPoint = middleIntersections[ 0 ].point;

        const direction = midPoint.minus( targetPoint ).normalized();
        if ( direction.x < 0 ) {
          direction.negate();
        }
        if ( targetPoint.x - opticPoint.x > 0 ) {
          if ( direction.x > 0 ) {
            direction.negate();
          }
        }

        const ray2 = new Ray2( targetPoint, direction );

        const backIntersections = backShape.intersection( ray2 );

        if ( backIntersections && backIntersections[ 0 ] && backIntersections[ 0 ].point ) {
          const backPoint = backIntersections[ 0 ].point;

          if ( frontIntersections && frontIntersections[ 0 ] && frontIntersections[ 0 ].point ) {

            const frontPoint = frontIntersections[ 0 ].point;

            const objectOpticDistance = frontPoint.distance( sourcePoint );

            const ratio = Math.min( distanceTraveled / objectOpticDistance, 1 );

            const rayBeyondOptic = ( distanceTraveled > objectOpticDistance );

            this.realRay.moveToPoint( sourcePoint )
              .lineToPoint( sourcePoint.blend( frontPoint, ratio ) );

            if ( rayBeyondOptic ) {

              const objectBackDistance = frontPoint.distance( backPoint );

              const ratio = Math.min( ( distanceTraveled - objectOpticDistance ) / objectBackDistance, 1 );
              this.realRay.lineToPoint( frontPoint.blend( backPoint, ratio ) );


              const rayBeyondOptic2 = ( distanceTraveled > objectOpticDistance + objectBackDistance );

              if ( rayBeyondOptic2 ) {

                const ratio = Math.min( ( distanceTraveled - objectOpticDistance ) / objectBackDistance, 1 );
                this.realRay.lineToPoint( frontPoint.blend( backPoint, ratio ) );

                const m2 = ( targetPoint.y - backPoint.y ) / ( targetPoint.x - backPoint.x );
                const x = ( endX - backPoint.x ) * optic.getTypeSign();

                this.realRay.lineToRelative( x, m2 * x );

                if ( isVirtual ) {
                  this.virtualRay.moveToPoint( backPoint );

                  const ratio = Math.min( Math.abs( ( endX - backPoint.x ) /
                                                    ( targetPoint.x - backPoint.x ) ), 1 );

                  this.virtualRay.lineToPoint( backPoint.blend( targetPoint, ratio ) );
                }
              }
            }
          }
        }
      }
    }
  }
}

geometricOptics
  .register(
    'LightRay',
    LightRay
  );
export default LightRay;
