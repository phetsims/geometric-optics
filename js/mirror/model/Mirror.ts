// Copyright 2021, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic, { OpticConfig } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

class Mirror extends Optic {

  /**
   * @param {OpticConfig} [config]
   */
  constructor( config: OpticConfig ) {
    super( merge( {
      opticType: 'mirror',
      opticShape: 'concave',
      radiusOfCurvatureRange: new RangeWithValue( 150, 300, 200 ), // in cm

      // Although a mirror does not have an index of refraction, its focal length is equivalent to a lens
      // with an index of refraction of 2.
      indexOfRefractionRange: new RangeWithValue( 2, 2, 2 ), // unitless
      diameterRange: new RangeWithValue( 30, 130, 80 ), // in cm

      // phet-io options
      tandem: Tandem.REQUIRED
    } as OpticConfig, config ) as OpticConfig );
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;