// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import CommonModel from '../../common/model/CommonModel.js';
import geometricOptics from '../../geometricOptics.js';

class LensModel extends CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
  }

}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
