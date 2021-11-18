// Copyright 2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GeometricOpticsGlobalOptionsNode from './common/view/GeometricOpticsGlobalOptionsNode.js';
import geometricOpticsStrings from './geometricOpticsStrings.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';

const simOptions = {

  credits: {
    leadDesign: 'Amy Rouinfar, Michael Dubson',
    softwareDevelopment: 'Sarah Chang, Chris Malley (PixelZoom, Inc.), Martin Veillette',
    team: 'Chris Klusendorf, Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Megan Lai'
  },

  // Creates content for the Options dialog, accessible via the PhET menu
  createOptionsDialogContent: ( tandem: Tandem ) => new GeometricOpticsGlobalOptionsNode( {
    tandem: tandem
  } )
};

simLauncher.launch( () => {
  const sim = new Sim( geometricOpticsStrings[ 'geometric-optics' ].title, [
    new LensScreen( { tandem: Tandem.ROOT.createTandem( 'lensScreen' ) } ),
    new MirrorScreen( { tandem: Tandem.ROOT.createTandem( 'mirrorScreen' ) } )
  ], simOptions );
  sim.start();
} );
