// Copyright 2021, University of Colorado Boulder

/**
 * LensShapes is the set of Shapes that describe a lens. All Shapes are in model coordinates.
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

class LensShapes implements OpticShapes {

  // OpticShapes interface
  readonly frontShape: Shape;
  readonly backShape: Shape | null;
  readonly outlineShape: Shape;
  readonly fillShape: Shape;

  /**
   * Sets the Shapes for a lens. In the case of a lens, the outline and fills shape are identical.
   * The lens shape is approximated as a parabolic lens. The radius of curvature does not necessarily match the
   * actual radius of curvature, and can instead be Hollywooded. This gives the flexibility to draw lenses with radius
   * of curvature that is larger than diameter/2, a physical impossibility. The origin (0,0) is at the geometric
   * center of the lens.
   * @param {OpticShapeEnum} opticShape
   * @param {number} radiusOfCurvature - radius of curvature
   * @param {number} diameter - height of the lens
   * @param {Object} [options]
   */
  constructor( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number, options?: any ) { //TYPESCRIPT any

    options = merge( {
      isHollywooded: true, // does the radius of curvature parameter match the shape of the lens?
      offsetRadius: 100 //TODO document
    }, options );

    const halfHeight = diameter / 2;

    // the width of the lens changes with the radius
    const halfWidth = options.isHollywooded ?
                      1 / 2 * halfHeight * halfHeight / ( radiusOfCurvature + options.offsetRadius ) :
                      radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // {Shape} shape of lens
    let outlineShape; // the outline of the lens (including top and bottom)
    let frontShape; // the left facing portion of the lens
    let backShape; // the right facing  portion of the lens

    if ( opticShape === 'convex' ) {

      // two extrema points of the lens
      const top = new Vector2( 0, halfHeight );
      const bottom = new Vector2( 0, -halfHeight );

      // two control points on the optical axis. Note that the shape does not go through these points.
      // The shape will go through the two points: ( -halfWidth, 0 )  and ( halfWidth, 0 )
      const left = new Vector2( -2 * halfWidth, 0 );
      const right = new Vector2( 2 * halfWidth, 0 );

      // shape of convex lens
      outlineShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( right, top )
        .close();

      frontShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( left, top )
        .close();

      backShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( right, bottom )
        .quadraticCurveToPoint( right, top )
        .close();
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
      outlineShape = new Shape()
        .moveToPoint( topLeft )
        .lineToPoint( topRight )
        .quadraticCurveToPoint( midRight, bottomRight )
        .lineToPoint( bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft )
        .close();

      frontShape = new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft )
        .close();

      backShape = new Shape()
        .moveToPoint( topRight )
        .quadraticCurveToPoint( midRight, bottomRight )
        .quadraticCurveToPoint( midRight, topRight )
        .close();
    }

    this.frontShape = frontShape;
    this.backShape = backShape;
    this.outlineShape = outlineShape;
    this.fillShape = outlineShape; // same as outlineShape for a lens
  }
}

geometricOptics.register( 'LensShapes', LensShapes );
export default LensShapes;
