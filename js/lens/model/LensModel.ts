// Copyright 2021, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';
import { OpticConfig } from '../../common/model/Optic.js';

class LensModel extends GeometricOpticsModel {

  // top guide associated with the source object or first light source
  readonly firstTopGuide: Guide;

  // bottom guide associated with the source object or first light source
  readonly firstBottomGuide: Guide;

  // top guide associated with the second point or second light source
  readonly secondTopGuide: Guide;

  // bottom guide associated with the second point or second light source
  readonly secondBottomGuide: Guide;

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TODO any

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const lens = new Lens( {
      tandem: options.tandem.createTandem( 'lens' )
    } as OpticConfig );

    super( lens, options );

    this.firstTopGuide = new Guide( this.optic, this.sourceObject.positionProperty, 'top' );
    this.firstBottomGuide = new Guide( this.optic, this.sourceObject.positionProperty, 'bottom' );
    this.secondTopGuide = new Guide( this.optic, this.secondPoint.positionProperty, 'top' );
    this.secondBottomGuide = new Guide( this.optic, this.secondPoint.positionProperty, 'bottom' );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;