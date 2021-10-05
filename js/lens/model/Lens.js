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

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super(
      Optic.Type.LENS,
      GeometricOpticsConstants.LENS_INITIAL_CURVATURE_TYPE,
      GeometricOpticsConstants.LENS_INITIAL_POSITION,
      GeometricOpticsConstants.LENS_RADIUS_OF_CURVATURE_RANGE,
      GeometricOpticsConstants.LENS_DIAMETER_RANGE,
      GeometricOpticsConstants.LENS_INDEX_OF_REFRACTION_RANGE
    );
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;