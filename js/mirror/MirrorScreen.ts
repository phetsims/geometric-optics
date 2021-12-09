// Copyright 2021, University of Colorado Boulder

/**
 * MirrorScreen is the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GeometricOpticsColors from '../common/GeometricOpticsColors.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import MirrorModel from './model/MirrorModel.js';
import MirrorNode from './view/MirrorNode.js';
import MirrorScreenView from './view/MirrorScreenView.js';

type Options = {
  tandem: Tandem
};

class MirrorScreen extends Screen {

  constructor( options: Options ) {

    super(
      () => new MirrorModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: MirrorModel ) => new MirrorScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      merge( {
        name: geometricOpticsStrings.screen.mirror,
        homeScreenIcon: createScreenIcon(),
        showUnselectedHomeScreenIconFrame: true,
        backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty
      }, options )
    );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( MirrorNode.createIconNode( 'concave' ), {
    fill: GeometricOpticsColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'MirrorScreen', MirrorScreen );
export default MirrorScreen;