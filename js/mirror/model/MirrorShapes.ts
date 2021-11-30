// Copyright 2021, University of Colorado Boulder

/**
 * MirrorShapes is the set of Shapes that describe a mirror. All Shapes are in model coordinates.
 *
 * Designed as a first surface mirror (or front surface mirror), which is a mirror with the reflective surface being
 * above a backing. This is as opposed to a conventional, second surface mirror, with the reflective surface behind
 * a transparent substrate such as glass or acrylic.
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

  // See OpticShapes
  readonly fillShape: Shape; // the mirror's backing
  readonly strokeShape: Shape; // the mirror's reflective coating
  readonly frontShape: Shape; // the mirror's reflective coating
  readonly backShape: null; // rays do not pass through a mirror, so there is no hit testing on its back
  readonly activeBoundsShape: Shape; // the mirror's reflective coating

  /**
   *
   * @param opticShape
   * @param radiusOfCurvature - radius of curvature at the center of the mirror
   * @param diameter - vertical height of the mirror
   * @param options
   */
  constructor( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number, options?: any ) {
    assert && assert( radiusOfCurvature > diameter / 2 );

    options = merge( {
      backingThickness: 5 // thickness of the backing of the mirror, in cm
    }, options );

    // convenience variable
    const backingThickness = options.backingThickness;

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radiusOfCurvature );

    // curveSign is +1 for convex and -1 for concave
    const curveSign = ( opticShape === 'convex' ) ? 1 : -1;

    // vector offset between the two top corners and bottom corners of the shape with a magnitude of backingThickness
    const offsetTopVector = Vector2.createPolar( backingThickness, -curveSign * angle );
    const offsetBottomVector = Vector2.createPolar( backingThickness, curveSign * angle );

    // four corners of the mirror shape
    const topLeft = new Vector2( curveSign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = new Vector2( curveSign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: (0,0) and ( backingThickness, 0 )
    const midLeft = new Vector2( -curveSign * halfWidth, 0 );
    const midRight = midLeft.plusXY( backingThickness, 0 );

    // shapes drawn from top to bottom in counterclockwise fashion.

    // reflective coating on the front (left-facing) surface of the mirror, with zero area.
    const reflectiveCoatingShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .quadraticCurveToPoint( midLeft, topLeft )
      .close();

    // the mirror's backing
    const backingShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .lineToPoint( bottomRight )
      .quadraticCurveToPoint( midRight, topRight )
      .close();

    this.fillShape = backingShape;
    this.strokeShape = reflectiveCoatingShape;
    this.frontShape = reflectiveCoatingShape;
    this.backShape = null; // because there is no ray hit testing on the back of a mirror
    this.activeBoundsShape = reflectiveCoatingShape;
  }
}

geometricOptics.register( 'MirrorShapes', MirrorShapes );
export default MirrorShapes;
