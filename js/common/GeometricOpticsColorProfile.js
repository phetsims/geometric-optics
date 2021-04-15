// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsColorProfile defines the color profile for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ColorProfile from '../../../scenery-phet/js/ColorProfile.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsColorProfile = new ColorProfile( [ 'default' ], {

  // Background color that for screens in this sim
  screenBackgroundColor: {
    default: 'white'
  }
} );

geometricOptics.register( 'GeometricOpticsColorProfile', GeometricOpticsColorProfile );
export default GeometricOpticsColorProfile;