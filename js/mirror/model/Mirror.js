// Copyright 2021, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

class Mirror extends Optic {
  constructor() {
    super( {
      opticType: Optic.Type.MIRROR,
      curve: Optic.Curve.CONCAVE,
      initialPosition: new Vector2( 100, 0 ),
      radiusOfCurvatureRange: new RangeWithValue( 150, 250, 200 ),

      // Although a mirror does not have an index of refraction, its focal length is equivalent to a lens
      // with an index of refraction of 2.
      indexOfRefractionRange: new RangeWithValue( 2, 2, 2 ),
      diameterRange: new RangeWithValue( 30, 150, 80 )
    } );
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;