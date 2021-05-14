// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the lens
 * Responsible for the index of refraction, radius of curvature and diameter the lens
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../../common/model/Optic.js';

const RADIUS_OF_CURVATURE_RANGE = GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE;
const DIAMETER_RANGE = GeometricOpticsConstants.MIRROR_DIAMETER_RANGE;
const INITIAL_CURVATURE_TYPE = GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE;
const INITIAL_POSITION = GeometricOpticsConstants.MIRROR_INITIAL_POSITION;

class Mirror extends Optic {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( INITIAL_POSITION, RADIUS_OF_CURVATURE_RANGE, DIAMETER_RANGE,
      INITIAL_CURVATURE_TYPE, Optic.Type.MIRROR, tandem );

    // @public (read-only) {DerivedProperty.<number>} focal length in meters
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.curveProperty ], ( radiusOfCurvature, curve ) => {
        const curveSign = this.isConvex( curve ) ? -1 : 1;
        return curveSign * radiusOfCurvature / 2;
      }
    );

  }

  /**
   * Resets the mirror
   * @public
   */
  reset() {
    super.reset();
  }

  /**
   * Returns the shape of a convex mirror.
   * @param {Vector2} position
   * @param {number} radius
   * @param {number} diameter
   * @returns {Shape}
   * @public
   */
  getConvexShape( position, radius, diameter ) {

    const halfHeight = diameter / 2;
    const halfWidth = 1 / 2 * halfHeight * halfHeight / radius;
    const top = position.plusXY( halfWidth, halfHeight );
    const bottom = position.plusXY( halfWidth, -halfHeight );
    const left = position.plusXY( -halfWidth, 0 );
    const convexShape = new Shape()
      .moveToPoint( top )
      .quadraticCurveToPoint( left, bottom )
      .close();
    convexShape.moveToPoint( top ).lineToPoint( bottom );
    return convexShape;
  }


  /**
   * Returns the shape of a concave mirror.
   * @param {Vector2} position
   * @param {number} radius
   * @param {number} diameter
   * @returns {Shape}
   * @public
   */
  getConcaveShape( position, radius, diameter ) {

    const halfHeight = diameter / 2;
    const halfWidth = 1 / 2 * halfHeight * halfHeight / radius;
    const midWidth = 1 / 2 * halfHeight * halfHeight / radius;
    const topLeft = position.plusXY( -halfWidth, halfHeight );
    const topMid = position.plusXY( 0, halfHeight );
    const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
    const bottomMid = position.plusXY( 0, -halfHeight );
    const midLeft = position.plusXY( midWidth, 0 );

    const concaveShape = new Shape()
      .moveToPoint( topLeft )
      .lineToPoint( topMid )
      .lineToPoint( bottomMid )
      .lineToPoint( bottomLeft )
      .quadraticCurveToPoint( midLeft, topLeft )
      .close();

    return concaveShape;
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;
