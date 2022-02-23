// Copyright 2022, University of Colorado Boulder

/**
 * GOSim is the subclass of Sim used by both the 'full' and 'basics' versions of Geometric Optics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import merge from '../../phet-core/js/merge.js';
import Tandem from '../../tandem/js/Tandem.js';
import geometricOptics from './geometricOptics.js';
import LensScreen from './lens/LensScreen.js';
import MirrorScreen from './mirror/MirrorScreen.js';
import GOConstants from './common/GOConstants.js';
import { Node } from '../../scenery/js/imports.js';

type GOSimOptions = {
  isBasicsVersion?: boolean,
  createOptionsDialogContent?: ( tandem: Tandem ) => Node
};

class GOSim extends Sim {

  /**
   * @param title
   * @param providedOptions
   */
  constructor( title: string, providedOptions?: GOSimOptions ) {

    const options = merge( {
      credits: GOConstants.CREDITS,

      // pdom options
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