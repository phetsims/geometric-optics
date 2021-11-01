// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes is the set of Shapes used to render a specific optic. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';
import OpticTypeEnum from './OpticTypeEnum.js';
import OpticShapeEnum from './OpticShapeEnum.js';

type OpticShapesOptions = {

  // Lens
  isHollywooded: boolean, // does the radius of curvature parameter match the shape of the lens?
  offsetRadius: number, //TODO document

  // Mirror
  mirrorThickness: number // thickness of the backing of the mirror, in cm
};

class OpticShapes {

  // @public (read-only)
  public frontShape: Shape; // the left facing contour of the optic. This can be used for ray hit testing
  public backShape: Shape | null; // the right facing contour of the lens, used for ray hit testing. null for mirror.
  public outlineShape: Shape; // the external surface of the lens, or the reflecting coating of the mirror
  public fillShape: Shape; // the entire shape of the lens, or the backing of the mirror

  /**
   * @param {OpticTypeEnum} opticType
   * @param {OpticShapeEnum} opticShape
   * @param {number} radiusOfCurvature - radius of curvature at the center of the optic
   * @param {number} diameter - vertical height of the optic
   * @param {OpticShapesOptions} [providedOptions]
   */
  constructor( opticType: OpticTypeEnum, opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number,
               providedOptions?: Partial<OpticShapesOptions> ) {

    assert && assert( isFinite( radiusOfCurvature ) && radiusOfCurvature > 0 );
    assert && assert( isFinite( diameter ) && diameter > 0 );

    //TODO initializers were added to appease TypeScript
    this.frontShape = new Shape();
    this.backShape = null;
    this.outlineShape = new Shape();
    this.fillShape = new Shape();

    if ( opticType === 'lens' ) {
      this.setLensShapes( opticShape, radiusOfCurvature, diameter, providedOptions );
    }
    else {
      this.setMirrorShapes( opticShape, radiusOfCurvature, diameter, providedOptions );
    }
  }

  /**
   * Sets the Shapes for a lens. In the case of a lens, the outline and fills shape are identical.
   * The lens shape is approximated as a parabolic lens. The radius of curvature does not necessarily match the
   * actual radius of curvature, and can instead be Hollywooded. This gives the flexibility to draw lenses with radius
   * of curvature that is larger than diameter/2, a physical impossibility. The origin (0,0) is at the geometric
   * center of the lens.
   * @private
   * @param {OpticShapeEnum} opticShape
   * @param {number} radiusOfCurvature - radius of curvature
   * @param {number} diameter - height of the lens
   * @param {OpticShapesOptions} [providedOptions]
   */
  setLensShapes( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number, providedOptions?: Partial<OpticShapesOptions> ) {

    const options = merge( {
      isHollywooded: true,
      offsetRadius: 100
    }, providedOptions ) as OpticShapesOptions;

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
    this.outlineShape = outlineShape;
    this.fillShape = outlineShape; // same as outlineShape for a lens
    this.backShape = backShape;
  }

  /**
   * Sets the Shapes for a parabolic mirror, designed as a "first surface mirror".
   * A first surface mirror (or front surface mirror) is a mirror with the reflective surface being above a backing,
   * as opposed to the conventional, second surface mirror with the reflective surface behind a transparent substrate
   * such as glass or acrylic. The Shapes are drawn using quadratic Bezier curves.
   * @private
   * @param {OpticShapeEnum} opticShape
   * @param {number} radiusOfCurvature - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {OpticShapesOptions} [providedOptions]
   */
  setMirrorShapes( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number, providedOptions?: Partial<OpticShapesOptions> ) {
    assert && assert( radiusOfCurvature > diameter / 2 );

    const options = merge( {
      mirrorThickness: 5
    }, providedOptions ) as OpticShapesOptions;

    // convenience variable
    const mirrorThickness = options.mirrorThickness;

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radiusOfCurvature );

    // curveSign is +1 for convex and -1 for concave
    const curveSign = ( opticShape === 'convex' ) ? 1 : -1;

    // vector offset between the two top corners and bottom corners of the shape with a magnitude of mirrorThickness
    const offsetTopVector = Vector2.createPolar( mirrorThickness, -curveSign * angle );
    const offsetBottomVector = Vector2.createPolar( mirrorThickness, curveSign * angle );

    // four corners of the mirror shape
    const topLeft = new Vector2( curveSign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = new Vector2( curveSign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: (0,0) and ( mirrorThickness, 0 )
    const midLeft = new Vector2( -curveSign * halfWidth, 0 );
    const midRight = midLeft.plusXY( mirrorThickness, 0 );

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

geometricOptics.register( 'OpticShapes', OpticShapes );

export default OpticShapes;
export { OpticShapesOptions };
