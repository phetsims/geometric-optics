// Copyright 2021, University of Colorado Boulder

/**
 * FocalPoint is the model for a focal point, which has a position relative to an optic (lens or mirror).
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import geometricOptics from '../../geometricOptics.js';

class FocalPoint {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<number>} focalLengthProperty
   * @param {Object} [options]
   */
  constructor( opticPositionProperty, focalLengthProperty, options ) {

    assert && AssertUtils.assertPropertyOf( opticPositionProperty, Vector2 );
    assert && AssertUtils.assertPropertyOf( focalLengthProperty, 'number' );

    options = merge( {
      multiplicativeFactor: 1
    }, options );

    // @public {DerivedProperty.<Vector2>} Position of the focal point
    this.positionProperty = new DerivedProperty(
      [ opticPositionProperty, focalLengthProperty ],
      ( opticPosition, focalLength ) => opticPosition.plusXY( options.multiplicativeFactor * focalLength, 0 )
    );
  }
}

geometricOptics.register( 'FocalPoint', FocalPoint );
export default FocalPoint;