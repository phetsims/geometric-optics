// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensShapes is the set of Shapes that describe a lens. All Shapes are in model coordinates.
 *
 * The lens shape is approximated as a parabolic lens. The radius of curvature does not necessarily match the
 * actual radius of curvature, and can instead be Hollywooded. This gives the flexibility to draw lenses with radius
 * of curvature that is larger than diameter/2, a physical impossibility. The origin (0,0) is at the geometric
 * center of the lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import OpticShapeType from '../../common/model/OpticShapeType.js';
import OpticShapes from '../../common/model/OpticShapes.js';
import geometricOptics from '../../geometricOptics.js';

type LensShapesOptions = {

  // true: approximation, false: accurate, matches ROC
  isHollywooded?: boolean,

  //TODO document
  offsetRadius?: number
};

class LensShapes implements OpticShapes {

  // specific to LensShapes
  readonly lensShape: Shape; // the complete lens

  // See OpticShapes
  readonly frontShape: Shape; // the left half of the lens
  readonly backShape: Shape; // the right half of the lens
  readonly activeBoundsShape: Shape; // the entire lens

  /**
   * @param opticShape
   * @param radiusOfCurvature - radius of curvature
   * @param diameter - height of the lens
   * @param providedOptions
   */
  constructor( opticShape: OpticShapeType, radiusOfCurvature: number, diameter: number, providedOptions?: LensShapesOptions ) {

    const options = merge( {
      isHollywooded: true, // true: approximation, false: accurate, matches ROC
      offsetRadius: 100 //TODO document
    }, providedOptions );

    const halfHeight = diameter / 2;

    // the width of the lens changes with the radius
    const halfWidth = options.isHollywooded ?
                      1 / 2 * halfHeight * halfHeight / ( radiusOfCurvature + options.offsetRadius ) :
                      radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // {Shape} shape of lens
    let lensShape; // the outline of the complete lens
    let frontShape; // the front (left facing) part of the lens
    let backShape; // the back (right facing)  part of the lens

    if ( opticShape === 'convex' ) {

      // two extrema points of the lens
      const top = new Vector2( 0, halfHeight );
      const bottom = new Vector2( 0, -halfHeight );

      // two control points on the optical axis. Note that the shape does not go through these points.
      // The shape will go through the two points: ( -halfWidth, 0 )  and ( halfWidth, 0 )
      const left = new Vector2( -2 * halfWidth, 0 );
      const right = new Vector2( 2 * halfWidth, 0 );

      // shape of convex lens
      lensShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( right, top )
        .close();

      // front (left) surface of the lens
      frontShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom );

      // back (right) surface of the lens
      backShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( right, bottom );
    }
    else {
      assert && assert( opticShape === 'concave' );

      const midWidth = halfWidth;

      // four corners of the concave shape
      const topLeft = new Vector2( -halfWidth, halfHeight );
      const topRight = new Vector2( halfWidth, halfHeight );
      const bottomLeft = new Vector2( -halfWidth, -halfHeight );
      const bottomRight = new Vector2( halfWidth, -halfHeight );

      // control points
      const midLeft = new Vector2( midWidth / 2, 0 );
      const midRight = new Vector2( -midWidth / 2, 0 );

      // shape of concave lens
      lensShape = new Shape()
        .moveToPoint( topLeft )
        .lineToPoint( topRight )
        .quadraticCurveToPoint( midRight, bottomRight )
        .lineToPoint( bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft )
        .close();

      // front (left) surface of the lens
      frontShape = new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft );

      // back (right) surface of the lens
      backShape = new Shape()
        .moveToPoint( topRight )
        .quadraticCurveToPoint( midRight, bottomRight );
    }

    this.lensShape = lensShape;
    this.frontShape = frontShape;
    this.backShape = backShape;
    this.activeBoundsShape = lensShape; // Active bounds are defined by the entire lens
  }
}

geometricOptics.register( 'LensShapes', LensShapes );
export default LensShapes;
