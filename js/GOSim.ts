// Copyright 2022, University of Colorado Boulder

/**
 * GOSim is the subclass of Sim used by both geometric-optics and geometric-optics-basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import Tandem from '../../tandem/js/Tandem.js';
import geometricOptics from './geometricOptics.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';
import GOConstants from './common/GOConstants.js';
import optionize from '../../phet-core/js/optionize.js';
import GOOptionsNode from './common/view/GOOptionsNode.js';

type SelfOptions = {

  // Is this 'Geometric Optics: Basics', the 'basics version' of the sim?
  // This flag is propagated to many components of the sim. To identify how the Basics version is customized,
  // search the code base for isBasicsVersion, and inspect geometric-optics-basics-main.ts.
  isBasicsVersion: boolean;
}

export type GOSimOptions = SelfOptions;

export default class GOSim extends Sim {

  /**
   * @param title
   * @param providedOptions
   */
  constructor( title: string, providedOptions: GOSimOptions ) {

    const options = optionize<GOSimOptions, SelfOptions, SimOptions>( {

      // Sim options
      credits: GOConstants.CREDITS,
      hasKeyboardHelpContent: true,
      createOptionsDialogContent: ( tandem: Tandem ) => new GOOptionsNode( {
        isBasicsVersion: providedOptions.isBasicsVersion,
        tandem: tandem
      } )

    }, providedOptions );

    super( title, [
      new LensScreen( {
        isBasicsVersion: options.isBasicsVersion,
        tandem: Tandem.ROOT.createTandem( 'lensScreen' )
      } ),
      new MirrorScreen( {
        isBasicsVersion: options.isBasicsVersion,
        tandem: Tandem.ROOT.createTandem( 'mirrorScreen' )
      } )
    ], options );
  }
}

geometricOptics.register( 'GOSim', GOSim );