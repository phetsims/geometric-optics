// Copyright 2021, University of Colorado Boulder

/**
 * IntroScreen is the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GeometricOpticsColors from '../common/GeometricOpticsColors.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TS any

    options = merge( {

      // Screen options
      name: geometricOpticsStrings.screen.intro,
      homeScreenIcon: createScreenIcon(),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new IntroModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: IntroModel ) => new IntroScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 * @returns {ScreenIcon}
 */
function createScreenIcon() {

  //TODO https://github.com/phetsims/geometric-optics/issues/253 screen icon
  const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
  const rectangle = new Rectangle( 0, 0, width, height );

  return new ScreenIcon( rectangle, {
    fill: GeometricOpticsColors.screenBackgroundColorProperty
  } );
}


geometricOptics.register( 'IntroScreen', IntroScreen );
export default IntroScreen;