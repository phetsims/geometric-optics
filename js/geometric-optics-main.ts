// Copyright 2021-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import simLauncher from '../../joist/js/simLauncher.js';
import GeometricOpticsStrings from './GeometricOpticsStrings.js';
import GOSim from './GOSim.js';

simLauncher.launch( () => {
  const sim = new GOSim( GeometricOpticsStrings[ 'geometric-optics' ].titleStringProperty, {
    isBasicsVersion: false,
    phetioDesigned: true
  } );
  sim.start();
} );
