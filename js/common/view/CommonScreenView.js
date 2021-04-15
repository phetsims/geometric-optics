// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import CommonModel from '../model/CommonModel.js';

class CommonScreenView extends ScreenView {

  /**
   * @param {CommonModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof CommonModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

}

geometricOptics.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;
