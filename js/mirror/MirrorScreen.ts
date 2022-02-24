// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorScreen is the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import GOColors from '../common/GOColors.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import MirrorModel from './model/MirrorModel.js';
import MirrorNode from './view/MirrorNode.js';
import MirrorScreenView from './view/MirrorScreenView.js';
import GOKeyboardHelpContent from '../common/view/GOKeyboardHelpContent.js';
import { OpticShape } from '../common/model/OpticShape.js';
import { PickRequired } from '../common/GOTypes.js';

type MirrorScreenOptions = {
  isBasicsVersion?: boolean
} & PickRequired<ScreenOptions, 'tandem'>;

class MirrorScreen extends Screen<MirrorModel, MirrorScreenView> {

  constructor( providedOptions: MirrorScreenOptions ) {

    const isBasicsVersion = ( providedOptions.isBasicsVersion || false );

    const options = merge( {
      name: geometricOpticsStrings.screen.mirror,
      homeScreenIcon: createScreenIcon( isBasicsVersion ? 'flat' : 'concave' ),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GOColors.screenBackgroundColorProperty,
      keyboardHelpNode: new GOKeyboardHelpContent( false /* isLens */ )
    }, providedOptions );

    super(
      () => new MirrorModel( {
        isBasicsVersion: isBasicsVersion,
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new MirrorScreenView( model, {
        isBasicsVersion: isBasicsVersion,
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

function createScreenIcon( opticShape: OpticShape ): ScreenIcon {
  return new ScreenIcon( MirrorNode.createIconNode( opticShape ), {
    fill: GOColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'MirrorScreen', MirrorScreen );
export default MirrorScreen;