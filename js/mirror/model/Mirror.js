// Copyright 2021, University of Colorado Boulder

/**
 * Model element of a movable parabolic mirror with radius of curvature and diameter.
 * Its focal length and shape are determined
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

const INITIAL_POSITION = GeometricOpticsConstants.MIRROR_INITIAL_POSITION;
const RADIUS_OF_CURVATURE_RANGE = GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE;
const DIAMETER_RANGE = GeometricOpticsConstants.MIRROR_DIAMETER_RANGE;
const INITIAL_CURVATURE_TYPE = GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE;

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
      } );
  }

  /**
   * Resets the mirror
   * @public
   */
  reset() {
    super.reset();
  }

  /**
   * Returns the shape of a parabolic mirror.
   * The shape is designed as a "first surface mirror".
   * The returned object contains an outline shape, representing the reflecting coating,
   * and a fill shape representing the base backing of the mirror.
   * The center point of the mirror is 'position'
   * The shapes are drawn using quadratic Bezier curves.
   *
   * @param {Vector2} position
   * @param {number} radius - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   * @returns {{fillShape: <Shape>,outlineShape: <Shape>}}
   * @public
   */
  getFillAndOutlineShapes( position, radius, diameter, curve, options ) {

    assert && assert( radius > diameter / 2, 'the radius of curvature is too small when compared to the diameter' );

    options = merge( {
      thickness: 0.50 // horizontal separation between the two edges of the surfaces at the middle part
    }, options );

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radius - Math.sqrt( radius * radius - halfHeight * halfHeight );

    // top and bottom surfaces must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radius );

    // curveSign is +1 for convex and -1 for concave
    const curveSign = this.getCurveSign( curve );

    // vector offset between the two top corners and bottom corners of the shape
    // with a magnitude of option.thickness
    const offsetTopVector = Vector2.createPolar( options.thickness, -curveSign * angle );
    const offsetBottomVector = Vector2.createPolar( options.thickness, curveSign * angle );

    // four corners of the mirror shape
    const topLeft = position.plusXY( curveSign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = position.plusXY( curveSign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: position and position.plusXY( options.thickness, 0 )
    const midLeft = position.plusXY( -curveSign * halfWidth, 0 );
    const midRight = midLeft.plusXY( options.thickness, 0 );

    // shapes drawn from top to bottom in counterclockwise fashion.
    const shapes = {
      fillShape: new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .lineToPoint( bottomRight )
        .quadraticCurveToPoint( midRight, topRight )
        .close(),
      outlineShape: new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft )
    };

    return shapes;
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;
