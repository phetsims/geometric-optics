// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes is the set of Shapes used to render a specific optic.
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';

class OpticShapes {

  /**
   * @param {Optic.Type} opticType
   * @param {Optic.Curve} curve
   * @param {number} radiusOfCurvature - radius of curvature at the center of the optic
   * @param {number} diameter - vertical height of the optic
   * @param {Object} [options]
   */
  constructor( opticType, curve, radiusOfCurvature, diameter, options ) {

    assert && assert( Optic.Type.includes( opticType ) );
    assert && assert( Optic.Curve.includes( curve ) );
    assert && assert( typeof radiusOfCurvature === 'number' && isFinite( radiusOfCurvature ) && radiusOfCurvature > 0 );
    assert && assert( typeof diameter === 'number' && isFinite( diameter ) && diameter > 0 );

    // @public (read-only) {Shape|null} these are initialized by setLensShapes or setMirrorShapes
    this.frontShape = null; // the left facing contour of the optic. This can be used for ray hit testing
    this.backShape = null; // the right facing contour of the optic. Used for ray hit testing. null for mirror.
    this.outlineShape = null; // the reflecting coating of a mirror, or the external surface of the lens
    this.fillShape = null; // the entire shape of the lens, or the backing of the mirror

    if ( opticType === Optic.Type.LENS ) {
      this.setLensShapes( curve, radiusOfCurvature, diameter, options );
    }
    else {
      this.setMirrorShapes( curve, radiusOfCurvature, diameter, options );
    }
  }

  /**
   * Sets the shapes of a lens. In the case of a lens, the outline and fills shape are identical.
   * The lens shape is approximated as a parabolic lens.
   * The radius of curvature of the lens does necessarily match the value of radius and can be instead "hollywooded".
   * This gives the flexibility to draw lenses with radius of curvature that is larger than diameter/2, a physical
   * impossibility. The center point of the lens is '0,0'
   * @private
   * @param {Optic.Curve} curve
   * @param {number} radiusOfCurvature - radius of curvature
   * @param {number} diameter - height of the lens
   * @param {Object} [options]
   */
  setLensShapes( curve, radiusOfCurvature, diameter, options ) {

    options = merge( {
      isHollywood: true, // is the radius of curvature parameter matching the shape of the lens
      offsetRadius: 100
    }, options );

    const halfHeight = diameter / 2;

    // the width of the lens changes with the radius
    const halfWidth = options.isHollywood ?
                      1 / 2 * halfHeight * halfHeight / ( radiusOfCurvature + options.offsetRadius ) :
                      radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // {Shape} shape of lens
    let outlineShape; // the outline of the lens (including top and bottom)
    let frontShape; // the left facing portion of the lens
    let backShape; // the right facing  portion of the lens

    if ( curve === Optic.Curve.CONVEX ) {

      // two extrema points of the lens
      const top = new Vector2( 0, halfHeight );
      const bottom = new Vector2( 0, -halfHeight );

      // two control points on the optical axis, note that the shape does not go through these points
      // The shape will go through the two points: (  -halfWidth, 0 )  and (  halfWidth, 0 )
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
      assert && assert( curve === Optic.Curve.CONCAVE );

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
   * Sets the shape of a parabolic mirror.
   * The shape is designed as a "first surface mirror".
   * The returned object contains an outline shape, representing the reflecting coating,
   * and a fill shape representing the base backing of the mirror.
   * The shapes are drawn using quadratic Bezier curves.
   * @private
   * @param {Optic.Curve} curve
   * @param {number} radiusOfCurvature - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {Object} [options]
   */
  setMirrorShapes( curve, radiusOfCurvature, diameter, options ) {
    assert && assert( radiusOfCurvature > diameter / 2 );

    options = merge( {
      thickness: 5 // horizontal separation between the two edges of the surfaces at the middle part
    }, options );

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radiusOfCurvature - Math.sqrt( radiusOfCurvature ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radiusOfCurvature );

    // curveSign is +1 for convex and -1 for concave
    const curveSign = ( curve === Optic.Curve.CONVEX ) ? 1 : -1;

    // vector offset between the two top corners and bottom corners of the shape
    // with a magnitude of option.thickness
    const offsetTopVector = Vector2.createPolar( options.thickness, -curveSign * angle );
    const offsetBottomVector = Vector2.createPolar( options.thickness, curveSign * angle );

    // four corners of the mirror shape
    const topLeft = new Vector2( curveSign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = new Vector2( curveSign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: (0,0) and ( options.thickness, 0 )
    const midLeft = new Vector2( -curveSign * halfWidth, 0 );
    const midRight = midLeft.plusXY( options.thickness, 0 );

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