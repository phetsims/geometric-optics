// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensScreen is the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import GOColors from '../common/GOColors.js';
import GOKeyboardHelpContent from '../common/view/GOKeyboardHelpContent.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensNode from './view/LensNode.js';
import LensScreenView from './view/LensScreenView.js';
import optionize from '../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  isBasicsVersion?: boolean
};

type LensScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

class LensScreen extends Screen<LensModel, LensScreenView> {

  constructor( providedOptions: LensScreenOptions ) {

    const options = optionize<LensScreenOptions, SelfOptions, ScreenOptions>( {

      // LensScreen options
      isBasicsVersion: false,

      // Screen options
      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: createScreenIcon(),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GOColors.screenBackgroundColorProperty,
      keyboardHelpNode: new GOKeyboardHelpContent( true /* isLens */ )
    }, providedOptions );

    super(
      () => new LensModel( {
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new LensScreenView( model, {
        isBasicsVersion: options.isBasicsVersion,
        tandem: options.tandem.createTandem( 'view' )
      } ),
      options
    );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( LensNode.createIconNode( 'convex' ), {
    fill: GOColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'LensScreen', LensScreen );
export default LensScreen;