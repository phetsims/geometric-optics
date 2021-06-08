// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the lens
 * Responsible for the index of refraction, radius of curvature and diameter the lens
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
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
   *
   * @param {Vector2} position
   * @param {number} radius
   * @param {number} diameter
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   * @returns {fillShape: <Shape>,outlineShape: <Shape>};
   * @public
   */
  getFillAndOutlineShapes( position, radius, diameter, curve, options ) {

    options = merge( {
      thickness: 0.05 // horizontal separation between the two edges of the surfaces at the middle part
    }, options );

    //TODO: abstract some of the shapes

    // convenience variables
    const halfHeight = diameter / 2;

    // half of the width of the shape along the x -axis
    const halfWidth = radius - Math.sqrt( radius * radius - halfHeight * halfHeight );

    // vector offset between the two corners of the shape
    const angle = Math.atan( halfHeight / radius );
    const sign = ( curve === Optic.Curve.CONCAVE ) ? +1 : -1;
    const offsetTopVector = Vector2.createPolar( options.thickness, angle * sign );
    const offsetBottomVector = Vector2.createPolar( options.thickness, -angle * sign );

    const shapes = {};

    if ( this.isConvex( curve ) ) {

      // top left of the shape
      const top = position.plusXY( halfWidth, halfHeight );

      // bottom left of the shape
      const bottom = position.plusXY( halfWidth, -halfHeight );

      // control point - the shape will not go through this point
      const left = position.plusXY( -halfWidth, 0 );

      shapes.fillShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom ) //
        .lineToPoint( bottom.plus( offsetBottomVector ) )
        .quadraticCurveToPoint( left.plusXY( options.thickness, 0 ), top.plus( offsetTopVector ) )
        .close();

      shapes.outlineShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( left, top );

    }
    else {
      // concave shape

      // position of the shape
      const topLeft = position.plusXY( -halfWidth, halfHeight );
      const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
      const bottomRight = bottomLeft.plus( offsetBottomVector );
      const topRight = topLeft.plus( offsetTopVector );

      // control points
      const midLeft = position.plusXY( halfWidth, 0 );
      const midRight = midLeft.plusXY( options.thickness, 0 );

      shapes.fillShape = new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .lineToPoint( bottomRight )
        .quadraticCurveToPoint( midRight, topRight )
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
