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

  // show the positions of the object, target and optic.
  showDebugPoints: {
    type: 'flag'
  },

  // show the position of points at a distance 2f from the optic.
  show2fPoints: {
    type: 'flag'
  },

  // shows the drag bounds
  showDragBounds: {
    type: 'flag'
  },

  // speed of light in centimeters per second, for the purpose of the light rays animation
  lightSpeed: {
    type: 'number',
    defaultValue: 400,
    isValidValue: value => ( value >= 100 )
  },

  // Shows the mask that corresponds to the area where light can be seen on the projector screen.
  // This is used to adjust GeometricOptics.PROJECTOR_SCREEN_MASK_CORNERS to match the PNG file.
  showProjectorScreenMask: {
    type: 'flag'
  }
} );

geometricOptics.register( 'GeometricOpticsQueryParameters', GeometricOpticsQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GeometricOpticsQueryParameters' );

export default GeometricOpticsQueryParameters;