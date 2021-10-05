// Copyright 2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Martin Veillette
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import geometricOpticsStrings from './geometricOpticsStrings.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';

const simOptions = {

  //TODO https://github.com/phetsims/geometric-optics/issues/146 complete the credits
  credits: {
    leadDesign: 'Amy Rouinfar, Michael Dubson',
    softwareDevelopment: 'Sarah Chang, Chris Malley (PixelZoom, Inc.), Martin Veillette',
    team: 'Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Megan Lai'
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  const sim = new Sim( geometricOpticsStrings[ 'geometric-optics' ].title, [
    new LensScreen( Tandem.ROOT.createTandem( 'lensScreen' ) ),
    new MirrorScreen( Tandem.ROOT.createTandem( 'mirrorScreen' ) )
  ], simOptions );
  sim.start();
} );
