// Copyright 2021, University of Colorado Boulder

/**
 * LensScreen is the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GOColors from '../common/GOColors.js';
import GOKeyboardHelpContent from '../common/view/GOKeyboardHelpContent.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensNode from './view/LensNode.js';
import LensScreenView from './view/LensScreenView.js';

type Options = {
  tandem: Tandem
};

class LensScreen extends Screen {

  constructor( options: Options ) {

    super(
      () => new LensModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: LensModel ) => new LensScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      merge( {
        name: geometricOpticsStrings.screen.lens,
        homeScreenIcon: createScreenIcon(),
        showUnselectedHomeScreenIconFrame: true,
        backgroundColorProperty: GOColors.screenBackgroundColorProperty,
        keyboardHelpNode: new GOKeyboardHelpContent( true /* isLens */ )
      }, options )
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