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
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Optic from '../../common/model/Optic.js';

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

    // @public {DerivedProperty.<number>} focal length of the lens - negative indicates the lens is concave.
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.indexOfRefractionProperty, this.curveProperty ],
      ( radiusOfCurvature, indexOfRefraction, curve ) => {
        const signRadius = this.isConvex( curve ) ? 1 : -1;
        return signRadius * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
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
   * Returns the shape of a symmetric convex lens.
   * The center of the lens is at the point 'position'
   * @param {Vector2} position
   * @param {number} radius
   * @param {number} diameter
   * @returns {Shape}
   * @public
   */
  getConvexShape( position, radius, diameter ) {
    const halfHeight = diameter / 2;
    const halfWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );
    const top = position.plusXY( 0, halfHeight );
    const bottom = position.plusXY( 0, -halfHeight );
    const left = position.plusXY( -2 * halfWidth, 0 );
    const right = position.plusXY( 2 * halfWidth, 0 );
    const convexShape = new Shape()
      .moveToPoint( top )
      .quadraticCurveToPoint( left, bottom )
      .quadraticCurveToPoint( right, top )
      .close();
    convexShape.moveToPoint( top ).lineToPoint( bottom );
    return convexShape;
  }

  /**
   * Returns the shape of a symmetric concave lens.
   * The center of the lens is at the point 'position'
   * @param {Vector2} position
   * @param {number} radius
   * @param {number} diameter
   * @returns {Shape}
   * @public
   */
  getConcaveShape( position, radius, diameter ) {
    const halfHeight = diameter / 2;
    const halfWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );
    const midWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );
    const topLeft = position.plusXY( -halfWidth, halfHeight );
    const topRight = position.plusXY( halfWidth, halfHeight );
    const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
    const bottomRight = position.plusXY( halfWidth, -halfHeight );
    const midLeft = position.plusXY( midWidth / 2, 0 );
    const midRight = position.plusXY( -midWidth / 2, 0 );

    const concaveShape = new Shape()
      .moveToPoint( topLeft )
      .lineToPoint( topRight )
      .quadraticCurveToPoint( midRight, bottomRight )
      .lineToPoint( bottomLeft )
      .quadraticCurveToPoint( midLeft, topLeft )
      .close();

    concaveShape.moveToPoint( topLeft.average( topRight ) )
      .lineToPoint( bottomRight.average( bottomLeft ) );
    return concaveShape;
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;
