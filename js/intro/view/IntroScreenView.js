// Copyright 2014-2021, University of Colorado Boulder

/**
 * IntroScreenView is the view for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';
import IntroModel from '.././model/IntroModel.js';

class IntroScreenView extends ScreenView {

  /**
   * @param {IntroModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof IntroModel );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // convenience variable for laying out scenery Nodes
    const erodedLayoutBounds = this.layoutBounds.erodedXY(
      GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN, GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      rightBottom: erodedLayoutBounds.rightBottom,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

geometricOptics.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;