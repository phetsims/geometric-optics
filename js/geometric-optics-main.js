// Copyright 2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Martin Veillette
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GeometricOpticsGlobalOptionsNode from './common/view/GeometricOpticsGlobalOptionsNode.js';
import geometricOpticsStrings from './geometricOpticsStrings.js';
import IntroScreen from './intro/IntroScreen.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';

const simOptions = {

  //TODO https://github.com/phetsims/geometric-optics/issues/146 complete the credits
  credits: {
    leadDesign: 'Amy Rouinfar, Michael Dubson',
    softwareDevelopment: 'Sarah Chang, Chris Malley (PixelZoom, Inc.), Martin Veillette',
    team: 'Chris Klusendorf, Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Megan Lai'
  },

  // Creates content for the Options dialog, accessible via the PhET menu
  createOptionsDialogContent: tandem => new GeometricOpticsGlobalOptionsNode( {
    tandem: tandem
  } )
};

simLauncher.launch( () => {
  const sim = new Sim( geometricOpticsStrings[ 'geometric-optics' ].title, [
    new IntroScreen( { tandem: Tandem.ROOT.createTandem( 'introScreen' ) } ),
    new LensScreen( { tandem: Tandem.ROOT.createTandem( 'lensScreen' ) } ),
    new MirrorScreen( { tandem: Tandem.ROOT.createTandem( 'mirrorScreen' ) } )
  ], simOptions );
  sim.start();
} );
