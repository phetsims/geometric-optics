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

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // display a checkbox item that allows to toggle the visibility of the guides on the lens screen
  showGuides: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Show the positions of the optic, object, target, projector screen as red dots.
  showDebugPoints: {
    type: 'flag'
  },

  // Show 2f, twice the focal length, as dots that are the same color as the focal points.
  show2fPoints: {
    type: 'flag'
  },

  // Show the model bounds as a green rectangle.
  showModelBounds: {
    type: 'flag'
  },

  // speed of light in cm/sec, for the purpose of the light rays animation
  lightSpeed: {
    type: 'number',
    defaultValue: 400,
    isValidValue: value => ( value >= 100 )
  }
} );

geometricOptics.register( 'GeometricOpticsQueryParameters', GeometricOpticsQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GeometricOpticsQueryParameters' );

export default GeometricOpticsQueryParameters;