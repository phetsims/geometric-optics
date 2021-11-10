// Copyright 2021, University of Colorado Boulder

/**
 * Lens is the model of a lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic, { OpticConfig } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

class Lens extends Optic {

  /**
   * @param {OpticConfig} [config]
   */
  constructor( config: OpticConfig ) {
    super( merge( {
      opticType: 'lens',
      opticShape: 'convex',
      opticShapes: [ 'convex', 'concave' ],
      radiusOfCurvatureRange: new RangeWithValue( 30, 130, 80 ), // in cm
      indexOfRefractionRange: new RangeWithValue( 1.2, 1.9, 1.5 ), // unitless
      diameterRange: new RangeWithValue( 30, 130, 80 ), // in cm

      // phet-io options
      tandem: Tandem.REQUIRED
    } as OpticConfig, config ) as OpticConfig );
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;