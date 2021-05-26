// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class LensModel extends GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    this.optic = new Lens( tandem );

    this.createCommonComponents( this.optic, tandem );

    this.screenPositionProperty = new Vector2Property( new Vector2( 1, 1 ) );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
    this.optic.reset();
    this.targetImage.reset();
    this.lightRays.reset();
  }

}


geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
