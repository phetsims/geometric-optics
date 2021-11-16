// Copyright 2021, University of Colorado Boulder

/**
 * MirrorShapes is the set of Shapes that describe a mirror. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import OpticShapeEnum from '../../common/model/OpticShapeEnum.js';
import OpticShapes from '../../common/model/OpticShapes.js';
import geometricOptics from '../../geometricOptics.js';

class MirrorShapes implements OpticShapes {

  // OpticShapes interface
  readonly frontShape: Shape;
  readonly backShape: Shape | null;
  readonly outlineShape: Shape;
  readonly fillShape: Shape;

  /**
   * Sets the Shapes for a parabolic mirror, designed as a "first surface mirror".
   * A first surface mirror (or front surface mirror) is a mirror with the reflective surface being above a backing,
   * as opposed to the conventional, second surface mirror with the reflective surface behind a transparent substrate
   * such as glass or acrylic. The Shapes are drawn using quadratic Bezier curves.
   * @param {OpticShapeEnum} opticShape
   * @param {number} radiusOfCurvature - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {Object} [options]
   */
  constructor( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number, options?: any ) { //TYPESCRIPT any
    assert && assert( radiusOfCurvature > diameter / 2 );

    options = merge( {
      thickness: 5 // thickness of the backing of the mirror, in cm
    }, options );

    // convenience variable
    const thickness = options.thickness;

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radiusOfCurvature );

    // curveSign is +1 for convex and -1 for concave
    const curveSign = ( opticShape === 'convex' ) ? 1 : -1;

    // vector offset between the two top corners and bottom corners of the shape with a magnitude of thickness
    const offsetTopVector = Vector2.createPolar( thickness, -curveSign * angle );
    const offsetBottomVector = Vector2.createPolar( thickness, curveSign * angle );

    // four corners of the mirror shape
    const topLeft = new Vector2( curveSign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = new Vector2( curveSign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: (0,0) and ( thickness, 0 )
    const midLeft = new Vector2( -curveSign * halfWidth, 0 );
    const midRight = midLeft.plusXY( thickness, 0 );

    // shapes drawn from top to bottom in counterclockwise fashion.

    // front shape of mirror front - with zero area.
    const frontShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .quadraticCurveToPoint( midLeft, topLeft )
      .close();

    // shape of entire mirror, including mirror backing
    const fillShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .lineToPoint( bottomRight )
      .quadraticCurveToPoint( midRight, topRight )
      .close();

    this.frontShape = frontShape;
    this.backShape = null;
    this.outlineShape = frontShape; // same as frontShape for a mirror
    this.fillShape = fillShape;
  }
}

geometricOptics.register( 'MirrorShapes', MirrorShapes );
export default MirrorShapes;
