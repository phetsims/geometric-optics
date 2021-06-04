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
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

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

    // @public (read-only) {Property.<number>} focal length in meters
    // positive indicates the mirror is concave (converging).
    // negative indicate the lens is convex (diverging)
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.curveProperty ], ( radiusOfCurvature, curve ) => {

        // curveSign is +1 for convex and -1 for concave
        const curveSign = this.getCurveSign( curve );
        return -curveSign * radiusOfCurvature / 2;
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
   * Returns the shape of a mirror.
   * The center point of the mirror is 'position'
   * @param {Vector2} position
   * @param {number} radius
   * @param {number} diameter
   * @param {Optic.Curve} curve
   * @returns {fillShape: <Shape>,outlineShape: <Shape>};
   * @public
   */
  getFillAndOutlineShapes( position, radius, diameter, curve ) {

    // convenience variables
    const halfHeight = diameter / 2;
    const halfWidth = radius - Math.sqrt( radius * radius - halfHeight * halfHeight );
    const thickness = 0.05;
    const verticalOffset = 2 * thickness * halfWidth / halfHeight;

    const shapes = {};

    if ( this.isConvex( curve ) ) {

      const top = position.plusXY( halfWidth, halfHeight );
      const bottom = position.plusXY( halfWidth, -halfHeight );
      const left = position.plusXY( -halfWidth, 0 );

      shapes.fillShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .lineToPoint( bottom.plusXY( thickness, verticalOffset ) )
        .quadraticCurveToPoint( left.plusXY( thickness, 0 ), top.plusXY( thickness, -verticalOffset ) )
        .close();

      shapes.outlineShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( left, top );

    }
    else {

      const topLeft = position.plusXY( -halfWidth, halfHeight );
      const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
      const midLeft = position.plusXY( halfWidth, 0 );

      shapes.fillShape = new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .lineToPoint( bottomLeft.plusXY( thickness, -verticalOffset ) )
        .quadraticCurveToPoint( midLeft.plusXY( thickness, 0 ), topLeft.plusXY( thickness, verticalOffset ) )
        .close();

      shapes.outlineShape = new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft );
    }

    return shapes;
  }


}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;
