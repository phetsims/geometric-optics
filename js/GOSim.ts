// Copyright 2022-2023, University of Colorado Boulder

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
import GOPreferencesNode from './common/view/GOPreferencesNode.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import GOPreferences from './common/model/GOPreferences.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import { Node } from '../../scenery/js/imports.js';
import GOKeyboardHelpContent from './common/view/GOKeyboardHelpContent.js';

type SelfOptions = {

  // Is this 'Geometric Optics: Basics', aka the 'Basics version' of the sim?
  // This flag is propagated to many components of the sim. To identify how the Basics version is customized,
  // search the code base for isBasicsVersion, and inspect geometric-optics-basics-main.ts.
  isBasicsVersion: boolean;
};

export type GOSimOptions = SelfOptions & PickOptional<SimOptions, 'phetioDesigned'>;

export default class GOSim extends Sim {

  public constructor( titleProperty: TReadOnlyProperty<string>, providedOptions: GOSimOptions ) {

    const options = optionize<GOSimOptions, SelfOptions, SimOptions>()( {

      // SimOptions
      credits: GOConstants.CREDITS,
      preferencesModel: new PreferencesModel( {
        simulationOptions: {
          customPreferences: [ {
            createContent: tandem => new GOPreferencesNode( {
              isBasicsVersion: providedOptions.isBasicsVersion,
              tandem: tandem.createTandem( 'simPreferences' )
            } ),
            modelLinkables: [
              { property: GOPreferences.focalLengthModelTypeProperty },
              { property: GOPreferences.add2FPointsCheckboxProperty },
              { property: GOPreferences.cueingArrowsEnabledProperty }
            ]
          } ]
        }
      } )
    }, providedOptions );

    // Since keyboard-help is identical for both screens, save memory by reusing the same instance of keyboardHelpNode
    // for both screens, without creating a memory leak.
    let keyboardHelpNode: null | Node = null;
    const createKeyboardHelpNode = () => {
      if ( !keyboardHelpNode ) {
        keyboardHelpNode = new GOKeyboardHelpContent();
        keyboardHelpNode.disposeEmitter.addListener( function disposeListener() {
          if ( keyboardHelpNode ) {
            if ( keyboardHelpNode.disposeEmitter.hasListener( disposeListener ) ) {
              keyboardHelpNode.disposeEmitter.removeListener( disposeListener );
            }
            keyboardHelpNode = null;
          }
        } );
      }
      return keyboardHelpNode;
    };

    super( titleProperty, [
      new LensScreen( {
        isBasicsVersion: options.isBasicsVersion,
        createKeyboardHelpNode: createKeyboardHelpNode,
        tandem: Tandem.ROOT.createTandem( 'lensScreen' )
      } ),
      new MirrorScreen( {
        isBasicsVersion: options.isBasicsVersion,
        createKeyboardHelpNode: createKeyboardHelpNode,
        tandem: Tandem.ROOT.createTandem( 'mirrorScreen' )
      } )
    ], options );
  }
}

geometricOptics.register( 'GOSim', GOSim );