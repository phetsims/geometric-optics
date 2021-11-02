// Copyright 2021, University of Colorado Boulder

/**
 * IntroModel is the model for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class IntroModel {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TODO-TS any

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    //TODO
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt: number ) {
    //TODO
  }
}

geometricOptics.register( 'IntroModel', IntroModel );
export default IntroModel;