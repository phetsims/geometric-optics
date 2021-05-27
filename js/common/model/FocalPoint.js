// Copyright 2021, University of Colorado Boulder

/**
 * Model for a focal point
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class FocalPoint {

  /**
   *
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<number>} focalLengthProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( opticPositionProperty, focalLengthProperty, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      multiplicativeFactor: 1
    }, options );

    // @public (read-only) {DerivedProperty.<Vector2>} Position of the focal point
    this.positionProperty = new DerivedProperty( [ opticPositionProperty, focalLengthProperty ], ( opticPosition, focalLength ) => {
      return opticPosition.plusXY( options.multiplicativeFactor * focalLength, 0 );
    } );
  }
}

geometricOptics.register( 'FocalPoint', FocalPoint );
export default FocalPoint;
