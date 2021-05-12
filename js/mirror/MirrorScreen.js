// Copyright 2021, University of Colorado Boulder

/**
 * @author veillette
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import GeometricOpticsColorProfile from '../common/GeometricOpticsColorProfile.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import MirrorModel from './model/MirrorModel.js';
import MirrorScreenView from './view/MirrorScreenView.js';

class MirrorScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: geometricOpticsStrings.screen.mirror,
      homeScreenIcon: new ScreenIcon( new Circle( 4, { fill: 'green' } ) ),
      backgroundColorProperty: GeometricOpticsColorProfile.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new MirrorModel( tandem.createTandem( 'model' ) ),
      model => new MirrorScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

geometricOptics.register( 'MirrorScreen', MirrorScreen );
export default MirrorScreen;
