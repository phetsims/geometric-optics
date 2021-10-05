// Copyright 2021, University of Colorado Boulder

/**
 * Lens is the model of a lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

class Lens extends Optic {
  constructor() {
    super( {
      opticType: Optic.Type.LENS,
      curve: Optic.Curve.CONVEX,
      initialPosition: Vector2.ZERO,
      radiusOfCurvatureRange: new RangeWithValue( 30, 130, 80 ),
      indexOfRefractionRange: new RangeWithValue( 1.20, 1.87, 1.53 ),
      diameterRange: new RangeWithValue( 30, 130, 80 )
    } );
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;