// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the lens
 * Responsible for the index of refraction, radius of curvature, diameter the lens and the shape of the lens.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import CurvatureTypes from './CurvatureTypes.js';
import OpticalElement from './OpticalElement.js';
import Property from '../../../../axon/js/Property.js';

const INDEX_OF_REFRACTION_DEFAULT = GeometricOpticsConstants.INDEX_OF_REFRACTION_RANGE.defaultValue;

class Lens extends OpticalElement {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    // @public {Property.<number>}  index of refraction of the lens
    this.indexOfRefractionProperty = new NumberProperty( INDEX_OF_REFRACTION_DEFAULT, { range: GeometricOpticsConstants.INDEX_OF_REFRACTION_RANGE } );

    // @public {Property.<number>} focal length of the lens - negative indicates the lens is diverging.
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.indexOfRefractionProperty, this.curvatureTypeProperty ], ( radiusOfCurvature, indexOfRefraction, type ) => {
        const signRadius = type === CurvatureTypes.CONVERGING ? 1 : -1;
        return signRadius * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }
    );



    // @public (read-only) Shape of the lens
    this.shape = new Shape();

    // updates the shape of the lens
    Property.multilink( [
      this.positionProperty,
      this.radiusOfCurvatureProperty,
      this.indexOfRefractionProperty,
      this.diameterProperty,
      this.curvatureTypeProperty ], ( position, radius, index, diameter, type ) => {
      const halfHeight = diameter / 2;

      if ( type === CurvatureTypes.CONVERGING ) {
        const halfWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );
        const top = position.plusXY( 0, halfHeight );
        const bottom = position.plusXY( 0, -halfHeight );
        const left = position.plusXY( -2 * halfWidth, 0 );
        const right = position.plusXY( 2 * halfWidth, 0 );
        this.shape = new Shape()
          .moveToPoint( top )
          .quadraticCurveToPoint( left, bottom )
          .quadraticCurveToPoint( right, top )
          .close();
        this.shape.moveToPoint( top ).lineToPoint( bottom );
      }
      else {
        const halfWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );
        const midWidth = 1 / 2 * halfHeight * halfHeight / ( radius + 1 );
        const topLeft = position.plusXY( -halfWidth, halfHeight );
        const topRight = position.plusXY( halfWidth, halfHeight );
        const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
        const bottomRight = position.plusXY( halfWidth, -halfHeight );
        const midLeft = position.plusXY( midWidth / 2, 0 );
        const midRight = position.plusXY( -midWidth / 2, 0 );

        this.shape = new Shape()
          .moveToPoint( topLeft )
          .lineToPoint( topRight )
          .quadraticCurveToPoint( midRight, bottomRight )
          .lineToPoint( bottomLeft )
          .quadraticCurveToPoint( midLeft, topLeft )
          .close();

        this.shape.moveToPoint( topLeft.average( topRight ) )
          .lineToPoint( bottomRight.average( bottomLeft ) );
      }
    } );


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
   * @returns {number}
   */
  getNormalizedValue(index){
    return GeometricOpticsConstants.INDEX_OF_REFRACTION_RANGE.getNormalizedValue( index )
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;
