// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import CommonScreenView from '../../common/view/CommonScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';


class LensScreenView extends CommonScreenView {

  /**
   * @param {LensModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof LensModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, tandem );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        super.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    super.reset();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;
