// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';
import Lens from './Lens.js';

class LensModel extends GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    // @public {Lens}
    this.optic = new Lens( tandem );

    this.createCommonComponents( this.optic, tandem );

    this.firstTopGuide = new Guide( this.sourceObject.positionProperty, this.optic );
    this.firstBottomGuide = new Guide( this.sourceObject.positionProperty, this.optic, { location: Guide.Location.BOTTOM } );

    this.secondTopGuide = new Guide( this.sourceObject.movablePositionProperty, this.optic );
    this.secondBottomGuide = new Guide( this.sourceObject.movablePositionProperty, this.optic, { location: Guide.Location.BOTTOM } );


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


geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
