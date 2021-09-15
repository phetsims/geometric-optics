// Copyright 2021, University of Colorado Boulder

/**
 * Query parameters supported by the geometric-optics simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Martin Veillette
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsQueryParameters = QueryStringMachine.getAll( {

  // show the positions of the object, target and optic.
  showDebugPoints: {
    type: 'flag'
  },

  // show the position of points at a distance 2f from the optic.
  show2fPoints: {
    type: 'flag'
  },

  // display a checkbox item that allows to toggle the visibility of the guides on the lens screen
  showGuides: {
    type: 'boolean',
    defaultValue: true,
    public: true
  }
} );

geometricOptics.register( 'GeometricOpticsQueryParameters', GeometricOpticsQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GeometricOpticsQueryParameters' );

export default GeometricOpticsQueryParameters;