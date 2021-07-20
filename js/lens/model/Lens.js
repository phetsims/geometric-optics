// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the lens
 * Responsible for the index of refraction, radius of curvature, diameter the lens
 * and the shape of the lens.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

const INDEX_OF_REFRACTION_RANGE = GeometricOpticsConstants.LENS_INDEX_OF_REFRACTION_RANGE;
const RADIUS_OF_CURVATURE_RANGE = GeometricOpticsConstants.LENS_RADIUS_OF_CURVATURE_RANGE;
const DIAMETER_RANGE = GeometricOpticsConstants.LENS_DIAMETER_RANGE;
const INITIAL_CURVATURE_TYPE = GeometricOpticsConstants.LENS_INITIAL_CURVATURE_TYPE;
const INITIAL_POSITION = GeometricOpticsConstants.LENS_INITIAL_POSITION;

class Lens extends Optic {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( INITIAL_POSITION, RADIUS_OF_CURVATURE_RANGE, DIAMETER_RANGE,
      INITIAL_CURVATURE_TYPE, Optic.Type.LENS, tandem );

    // @public {Property.<number>}  index of refraction of the lens
    this.indexOfRefractionProperty = new NumberProperty( INDEX_OF_REFRACTION_RANGE.defaultValue,
      { range: INDEX_OF_REFRACTION_RANGE } );

    // @public {Property.<number>} focal length of the lens
    // positive indicate the lens is convex (converging)
    // negative indicates the lens is concave (diverging).
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.indexOfRefractionProperty, this.curveProperty ],
      ( radiusOfCurvature, indexOfRefraction, curve ) => {
        const curveSign = this.getCurveSign( curve );
        return curveSign * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }
    );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.indexOfRefractionProperty.reset();
    super.reset();
  }

  /**
   * Returns a normalized value (between 0 and 1) for the index of refraction
   * @param {number} index - index of refraction
   * @public
   * @returns {number}
   */
  getNormalizedIndex( index ) {
    return this.indexOfRefractionProperty.range.getNormalizedValue( index );
  }

  /**
   * Returns the shapes of a lens. In the case of a lens, the outline and fills shape are identical.
   *
   * The lens shape is approximated as a parabolic lens.
   * The radius of curvature of the lens does not match the value of radius but is instead "hollywooded".
   * This gives the flexibility to draw lenses with radius of curvature that is larger than diameter/2, a physical impossibility.
   * The center point of the lens is '0,0'
   *
   * @param {number} radius - radius of curvature
   * @param {number} diameter - height of the lens
   * @param {Optic.Curve} curve
   * @returns {{fillShape: <Shape>,outlineShape: <Shape>}}
   * @public
   */
  getFillAndOutlineShapes( radius, diameter, curve ) {

    const halfHeight = diameter / 2;

    // the width of the lens changes with the radius of curvature: hollywood
    // physically correct:   halfWidth = radius - Math.sqrt( radius^2 - halfHeight^2)
    const halfWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );

    // {Shape} shape of lens
    let shape; // the outline of the lens (including top and bottom)
    let frontShape; // the left facing portion of the lens
    let backShape; // the right facing  portion of the lens

    if ( this.isConvex( curve ) ) {

      // two extrema points of the lens
      const top = new Vector2( 0, halfHeight );
      const bottom = new Vector2( 0, -halfHeight );

      // two control points on the optical axis, note that the shape does not go through these points
      // The shape will go through the two points: position.plusXY(  -halfWidth, 0 )  and position.plusXY(  halfWidth, 0 )
      const left = new Vector2( -2 * halfWidth, 0 );
      const right = new Vector2( 2 * halfWidth, 0 );

      // shape of convex lens
      shape = new Shape()
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
      const midWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );

      // four corners of the concave shape
      const topLeft = new Vector2( -halfWidth, halfHeight );
      const topRight = new Vector2( halfWidth, halfHeight );
      const bottomLeft = new Vector2( -halfWidth, -halfHeight );
      const bottomRight = new Vector2( halfWidth, -halfHeight );

      // control points
      const midLeft = new Vector2( midWidth / 2, 0 );
      const midRight = new Vector2( -midWidth / 2, 0 );

      // shape of concave lens
      shape = new Shape()
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

    // two extrema points of the lens
    const top = new Vector2( 0, halfHeight );
    const bottom = new Vector2( 0, -halfHeight );
    const middleShape = new Shape().moveToPoint( top ).lineToPoint( bottom );

    // the outline shape is the same as the fill shape for a lens
    return {
      fillShape: shape,
      outlineShape: shape,
      frontShape: frontShape,
      backShape: backShape,
      middleShape: middleShape
    };
  }

}

geometricOptics.register( 'Lens', Lens );
export default Lens;
