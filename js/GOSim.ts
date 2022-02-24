// Copyright 2022, University of Colorado Boulder

/**
 * GOSim is the subclass of Sim used by both geometric-optics and geometric-optics-basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import Tandem from '../../tandem/js/Tandem.js';
import geometricOptics from './geometricOptics.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';
import GOConstants from './common/GOConstants.js';
import { Node } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';

//TODO https://github.com/phetsims/geometric-optics/issues/326 replace with Sim.SimOptions when it exists
type SimOptions = {
  credits?: object,
  hasKeyboardHelpContent?: boolean,
  createOptionsDialogContent?: ( tandem: Tandem ) => Node
}

type SelfOptions = {
  // Determines whether this is the Basics version of the sim. This flag is propagated to many components of the sim.
  isBasicsVersion?: boolean,
}

type GOSimOptions = SelfOptions & Pick<SimOptions, 'createOptionsDialogContent'>;

class GOSim extends Sim {

  /**
   * @param title
   * @param providedOptions
   */
  constructor( title: string, providedOptions?: GOSimOptions ) {

    const options = optionize<GOSimOptions, SelfOptions, SimOptions>( {

      isBasicsVersion: false,

      // Sim options
      credits: GOConstants.CREDITS,
      hasKeyboardHelpContent: true
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
export default GOSim;