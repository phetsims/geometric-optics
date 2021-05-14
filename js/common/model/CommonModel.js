// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import SourceObject from './SourceObject.js';

class CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    this.sourceObject = new SourceObject( tandem );
  }

}

geometricOptics.register( 'CommonModel', CommonModel );
export default CommonModel;
