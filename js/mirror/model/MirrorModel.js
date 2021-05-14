// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import CommonModel from '../../common/model/CommonModel.js';
import Mirror from './Mirror.js';
import geometricOptics from '../../geometricOptics.js';

class MirrorModel extends CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    this.optic = new Mirror( tandem );

    this.createCommonComponents( this.optic, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
    this.optic.reset();
  }

}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;
