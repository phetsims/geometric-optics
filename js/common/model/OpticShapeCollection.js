// Copyright 2021, University of Colorado Boulder

/**
 * A class of the shapes of optical element. It determines the various shapes of the optic:
 *
 * The outline shape, represents the reflecting coating of a mirror, or the external surface of the lens
 * The fill shape represents the entire shape of the lens, or in the case of mirror, the backing of the mirror
 * The front shape is the left facing contour of the optic. This can be used for ray hit testing
 * The back shape is the right facing contour of the optic. Used for ray hit testing.  Back shape is null for mirror
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';

class OpticShapeCollection {

  /**
   * @param {number} radius - radius of curvature at the center of the optic
   * @param {number} diameter - vertical height of the optic
   * @param {Optic.Curve} curve
   * @param {Optic.Type} type
   * @param {Object} [options]
   */
  constructor( radius, diameter, curve, type, options ) {

    // @public (read-only) {Shape|null} these are initialized by setLensShapes or setMirrorShapes
    this.frontShape = null;
    this.backShape = null;
    this.outlineShape = null;
    this.fillShape = null;

    if ( type === Optic.Type.LENS ) {
      this.setLensShapes( radius, diameter, curve, options );
    }
    else {
      this.setMirrorShapes( radius, diameter, curve, options );
    }
  }

  /**
   * Sets the shapes of a lens. In the case of a lens, the outline and fills shape are identical.
   * The lens shape is approximated as a parabolic lens.
   * The radius of curvature of the lens does necessarily match the value of radius and can be instead "hollywooded".
   * This gives the flexibility to draw lenses with radius of curvature that is larger than diameter/2, a physical
   * impossibility. The center point of the lens is '0,0'
   * @private
   * @param {number} radius - radius of curvature
   * @param {number} diameter - height of the lens
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   */
  setLensShapes( radius, diameter, curve, options ) {

    options = merge( {
      isHollywood: true, // is the radius of curvature parameter matching the shape of the lens
      offsetRadius: 100
    }, options );

    const halfHeight = diameter / 2;

    // the width of the lens changes with the radius
    const halfWidth = options.isHollywood ?
                      1 / 2 * halfHeight * halfHeight / ( radius + options.offsetRadius ) :
                      radius - Math.sqrt( radius ** 2 - halfHeight ** 2 );

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
   * @param {number} radius - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   */
  setMirrorShapes( radius, diameter, curve, options ) {

    assert && assert( radius > diameter / 2,
      'the radius of curvature is too small when compared to the diameter' );

    options = merge( {
      thickness: 5 // horizontal separation between the two edges of the surfaces at the middle part
    }, options );

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radius - Math.sqrt( radius ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radius );

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
    this.backShape = null; //TODO document why this is null for a mirror
    this.outlineShape = frontShape; // same as frontShape for a mirror
    this.fillShape = fillShape;
  }
}

geometricOptics.register( 'OpticShapeCollection', OpticShapeCollection );
export default OpticShapeCollection;