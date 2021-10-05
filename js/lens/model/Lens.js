// Copyright 2021, University of Colorado Boulder

/**
 * Lens is the model of a lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Optic from '../../common/model/Optic.js';

class Lens extends Optic {
  constructor() {
    super( {
      opticType: Optic.Type.LENS,
      curve: GeometricOpticsConstants.LENS_INITIAL_CURVATURE_TYPE,
      initialPosition: GeometricOpticsConstants.LENS_INITIAL_POSITION,
      radiusOfCurvatureRange: GeometricOpticsConstants.LENS_RADIUS_OF_CURVATURE_RANGE,
      indexOfRefractionRange: GeometricOpticsConstants.LENS_INDEX_OF_REFRACTION_RANGE,
      diameterRange: GeometricOpticsConstants.LENS_DIAMETER_RANGE
    } );
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;