// Copyright 2021, University of Colorado Boulder

/**
 * Query parameters supported by the geometric-optics simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import geometricOptics from '../geometricOptics.js';
import { FocalLengthControlValues } from './model/FocalLengthControlEnum.js';

const SCHEMA = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Add the 'Guides' feature to the Lens screen. This is a representation that was invented by PhET.
  // A checkbox will be added to the control panel, for controlling the visibility of the Guides.
  enableGuides: {
    type: 'flag',
    public: true
  },

  // Determines how focal length is controlled in the Lens and Mirror screens.
  // direct: provides a control labeled 'Focal Length'
  // indirect: provides controls for optic parameters, from which focal length is derived
  focalLengthControl: {
    type: 'string',
    validValues: FocalLengthControlValues,
    defaultValue: 'indirect',
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Show the positions of various things as red dots.
  showPositions: {
    type: 'flag'
  },

  // Enable the feature that lets you show points at 2F.
  enable2F: {
    type: 'boolean',
    defaultValue: false
  },

  // Show the model bounds as a green rectangle.
  showModelBounds: {
    type: 'flag'
  },

  // speed of light in cm/sec, for the purpose of the light rays animation
  lightSpeed: {
    type: 'number',
    defaultValue: 400,
    isValidValue: ( value: number ) => ( value >= 100 )
  }
};

const GOQueryParameters = QueryStringMachine.getAll( SCHEMA );
GOQueryParameters.SCHEMA = SCHEMA;

geometricOptics.register( 'GOQueryParameters', GOQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GOQueryParameters' );

export default GOQueryParameters;