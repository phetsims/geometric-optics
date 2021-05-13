// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the lens
 * Responsible for the index of refraction, radius of curvature and diameter the lens
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import TransmissionTypes from '../../common/model/TransmissionTypes.js';
import geometricOptics from '../../geometricOptics.js';
import CurvatureTypes from '../../common/model/CurvatureTypes.js';
import OpticalElement from '../../common/model/OpticalElement.js';
import Property from '../../../../axon/js/Property.js';

const RADIUS_OF_CURVATURE_RANGE = GeometricOpticsConstants.MIRROR_RADIUS_OF_CURVATURE_RANGE;
const DIAMETER_RANGE = GeometricOpticsConstants.MIRROR_DIAMETER_RANGE;
const INITIAL_CURVATURE_TYPE = GeometricOpticsConstants.MIRROR_INITIAL_CURVATURE_TYPE;
const INITIAL_POSITION = GeometricOpticsConstants.MIRROR_INITIAL_POSITION;

class Mirror extends OpticalElement {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    /**
     * @param {Vector2} position
     * @param {RangeWithValue} radiusOfCurvatureRange
     * @param {RangeWithValue} diameterRange
     * @param {CurvatureTypes} curvatureType
     * @param {TransmissionTypes} transmissionType
     * @param {Tandem} tandem
     */

    super( INITIAL_POSITION, RADIUS_OF_CURVATURE_RANGE, DIAMETER_RANGE,
      INITIAL_CURVATURE_TYPE, TransmissionTypes.REFLECTED, tandem );

      this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.curvatureTypeProperty ], ( radiusOfCurvature, type ) => {
        const signRadius = type === CurvatureTypes.CONVEX ? -1 : 1;
        return signRadius * radiusOfCurvature / ( 2 );
      }
    );

    this.shape = new Shape();

    Property.multilink( [
      this.positionProperty,
      this.radiusOfCurvatureProperty,
      this.diameterProperty,
      this.curvatureTypeProperty ], ( position, radius, diameter, type ) => {
      const halfHeight = diameter / 2;

      if ( type === CurvatureTypes.CONVEX ) {
        const halfWidth = 1 / 2 * halfHeight * halfHeight / radius;
        const top = position.plusXY( halfWidth, halfHeight );
        const bottom = position.plusXY( halfWidth, -halfHeight );
        const left = position.plusXY( -halfWidth, 0 );
        this.shape = new Shape()
          .moveToPoint( top )
          .quadraticCurveToPoint( left, bottom )
          .close();
        this.shape.moveToPoint( top ).lineToPoint( bottom );
      }
      else {
        const halfWidth = 1 / 2 * halfHeight * halfHeight / radius;
        const midWidth = 1 / 2 * halfHeight * halfHeight / radius;
        const topLeft = position.plusXY( -halfWidth, halfHeight );
        const topMid = position.plusXY( 0, halfHeight );
        const bottomLeft = position.plusXY( -halfWidth, -halfHeight );
        const bottomMid = position.plusXY( 0, -halfHeight );
        const midLeft = position.plusXY( midWidth, 0 );

        this.shape = new Shape()
          .moveToPoint( topLeft )
          .lineToPoint( topMid )
          .lineToPoint( bottomMid )
          .lineToPoint( bottomLeft )
          .quadraticCurveToPoint( midLeft, topLeft )
          .close();
      }
    } );


  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
  }

}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;
