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
import GeometricOpticsColors from '../common/GeometricOpticsColors.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensNode from './view/LensNode.js';
import LensScreenView from './view/LensScreenView.js';

class LensScreen extends Screen {

  constructor( options?: any ) {

    options = merge( {
      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: createScreenIcon(),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new LensModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: LensModel ) => new LensScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
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
    fill: GeometricOpticsColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'LensScreen', LensScreen );
export default LensScreen;