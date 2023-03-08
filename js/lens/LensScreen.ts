// Copyright 2021-2023, University of Colorado Boulder

/**
 * LensScreen is the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import GOColors from '../common/GOColors.js';
import geometricOptics from '../geometricOptics.js';
import GeometricOpticsStrings from '../GeometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensNode from './view/LensNode.js';
import LensScreenView from './view/LensScreenView.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import { GOSimOptions } from '../GOSim.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type LensScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem' | 'createKeyboardHelpNode'>;

export default class LensScreen extends Screen<LensModel, LensScreenView> {

  public constructor( providedOptions: LensScreenOptions ) {

    const options = optionize<LensScreenOptions, SelfOptions, ScreenOptions>()( {

      // Screen options
      name: GeometricOpticsStrings.screen.lensStringProperty,
      homeScreenIcon: createScreenIcon(),
      backgroundColorProperty: GOColors.screenBackgroundColorProperty
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

  public override dispose(): void {
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