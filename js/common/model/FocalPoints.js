// Copyright 2021, University of Colorado Boulder

/**
 * Class for the focalPoints
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class FocalPoints {

  /**
   *
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<number>} focalLengthProperty
   * @param {Tandem} tandem
   */
  constructor( opticPositionProperty, focalLengthProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {DerivedProperty.<Vector2>} Position of the first focal point
    this.firstPositionProperty = new DerivedProperty( [ opticPositionProperty, focalLengthProperty ], ( opticPosition, focalLength ) => {
      return opticPosition.plusXY( focalLength, 0 );
    } );

    // @public {DerivedProperty.<Vector2>} Position of the second focal point
    this.secondPositionProperty = new DerivedProperty( [ opticPositionProperty, focalLengthProperty ], ( opticPosition, focalLength ) => {
      return opticPosition.minusXY( focalLength, 0 );
    } );

  }
}

geometricOptics.register( 'FocalPoints', FocalPoints );
export default FocalPoints;
