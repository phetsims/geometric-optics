// Copyright 2021, University of Colorado Boulder

/**
 * Model element of screen. A target screen has a position and two spotlights.
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Spotlight from './Spotlight.js';

class Screen {

  /**
   * @param {Optic} optic
   * @param {Property.<Vector2>} targetImagePositionProperty
   * @param {Property.<Vector2>} movableImagePositionProperty
   * @param {Tandem} tandem
   */
  constructor( optic, targetImagePositionProperty, movableImagePositionProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public
    this.positionProperty = new Vector2Property( new Vector2( 2, 0 ) );

    //@ public (read-only) {Property.<Vector2>} position of the optic
    this.opticPositionProperty = optic.positionProperty;

    // @public (read-only)
    this.spotlightOne = new Spotlight(
      this.positionProperty,
      optic,
      targetImagePositionProperty,
      tandem
    );

    // @public (read-only)
    this.spotlightTwo = new Spotlight(
      this.positionProperty,
      optic,
      movableImagePositionProperty,
      tandem
    );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }


}

geometricOptics.register( 'Screen', Screen );
export default Screen;
