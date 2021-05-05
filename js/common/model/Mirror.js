// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the lens
 * Responsible for the index of refraction, radius of curvature and diameter the lens
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import CurvatureTypes from './CurvatureTypes.js';
import OpticalElement from './OpticalElement.js';

class Mirror extends OpticalElement {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.curvatureTypeProperty ], ( radiusOfCurvature, type ) => {
        const signRadius = type === CurvatureTypes.CONVERGING ? 1 : -1;
        return signRadius * radiusOfCurvature / ( 2 );
      }
    );

    this.shape = new Shape();

    const multilink = new Multilink( [
      this.positionProperty,
      this.radiusOfCurvatureProperty,
      this.diameterProperty,
      this.curvatureTypeProperty ], ( position, radius, diameter, type ) => {
      const halfHeight = diameter / 2;

      if ( type === CurvatureTypes.CONVERGING ) {
        const halfWidth = 1 / 2 * halfHeight * halfHeight / radius;
        const top = position.plusXY( 0, halfHeight );
        const bottom = position.plusXY( 0, -halfHeight );
        const left = position.plusXY( -2 * halfWidth, 0 );
        const right = position.plusXY( 2 * halfWidth, 0 );
        this.shape = new Shape()
          .moveToPoint( top )
          .quadraticCurveToPoint( left, bottom )
          .close();
        this.shape.moveToPoint( top ).lineToPoint( bottom );
      }
      else {
        const halfWidth = 1 / 2 * halfHeight * halfHeight / radius;
        const midWidth = 1 / 2 * halfHeight * halfHeight / radius * 0.1;
        const topLeft = position.plusXY( -halfWidth, halfHeight );
        const topRight = position.plusXY( halfWidth, halfHeight );
        const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
        const bottomRight = position.plusXY( halfWidth, -halfHeight );
        const midLeft = position.plusXY( -midWidth / 2, 0 );
        const midRight = position.plusXY( midWidth / 2, 0 );

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
    this.super.reset();
  }

}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;
