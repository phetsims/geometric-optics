// Copyright 2021, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';

class LensModel extends GeometricOpticsModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const lens = new Lens( {
      tandem: options.tandem.createTandem( 'lens' )
    } );

    super( lens, options );

    // @public top guide associated with the source object or first light source
    this.firstTopGuide = new Guide( this.optic, this.sourceObject.positionProperty, Guide.Location.TOP );

    // @public bottom guide associated with the source object or first light source
    this.firstBottomGuide = new Guide( this.optic, this.sourceObject.positionProperty, Guide.Location.BOTTOM );

    // @public top guide associated with the second point or second light source
    this.secondTopGuide = new Guide( this.optic, this.secondPoint.positionProperty, Guide.Location.TOP );

    // @public bottom guide associated with the second point or second light source
    this.secondBottomGuide = new Guide( this.optic, this.secondPoint.positionProperty, Guide.Location.BOTTOM );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;