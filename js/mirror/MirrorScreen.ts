// Copyright 2021-2023, University of Colorado Boulder

/**
 * MirrorScreen is the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import GOColors from '../common/GOColors.js';
import geometricOptics from '../geometricOptics.js';
import GeometricOpticsStrings from '../GeometricOpticsStrings.js';
import MirrorModel from './model/MirrorModel.js';
import MirrorNode from './view/MirrorNode.js';
import MirrorScreenView from './view/MirrorScreenView.js';
import { OpticSurfaceType } from '../common/model/OpticSurfaceType.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import { GOSimOptions } from '../GOSim.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type MirrorScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem' | 'createKeyboardHelpNode'>;

export default class MirrorScreen extends Screen<MirrorModel, MirrorScreenView> {

  public constructor( providedOptions: MirrorScreenOptions ) {

    const options = optionize<MirrorScreenOptions, SelfOptions, ScreenOptions>()( {

      // Screen options
      name: GeometricOpticsStrings.screen.mirrorStringProperty,
      homeScreenIcon: createScreenIcon( providedOptions.isBasicsVersion ? 'flat' : 'concave' ),
      backgroundColorProperty: GOColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new MirrorModel( {
        isBasicsVersion: providedOptions.isBasicsVersion,
        tandem: options.tandem.createTandem( 'model' )
      } ),
      model => new MirrorScreenView( model, {
        isBasicsVersion: providedOptions.isBasicsVersion,
        tandem: options.tandem.createTandem( 'view' )
      } ),
      options
    );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

function createScreenIcon( opticSurfaceType: OpticSurfaceType ): ScreenIcon {
  return new ScreenIcon( MirrorNode.createIconNode( opticSurfaceType ), {
    fill: GOColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'MirrorScreen', MirrorScreen );