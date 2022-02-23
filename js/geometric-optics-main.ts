// Copyright 2021-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GOGlobalOptionsNode from './common/view/GOGlobalOptionsNode.js';
import geometricOpticsStrings from './geometricOpticsStrings.js';
import GOSim from './GOSim.js';

simLauncher.launch( () => {
  const sim = new GOSim( geometricOpticsStrings[ 'geometric-optics' ].title, {

    // Creates content for the Options dialog, accessible via the PhET menu
    createOptionsDialogContent: ( tandem: Tandem ) => new GOGlobalOptionsNode( {
      tandem: tandem
    } )
  } );
  sim.start();
} );
