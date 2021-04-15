// Copyright 2021, University of Colorado Boulder

/**
 * @author veillette
 */

import Screen from '../../../joist/js/Screen.js';
import GeometricOpticsColorProfile from '../common/GeometricOpticsColorProfile.js';
import geometricOptics from '../geometricOptics.js';
import GeometricOpticsModel from './model/GeometricOpticsModel.js';
import GeometricOpticsScreenView from './view/GeometricOpticsScreenView.js';

class GeometricOpticsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: GeometricOpticsColorProfile.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new GeometricOpticsModel( tandem.createTandem( 'model' ) ),
      model => new GeometricOpticsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

geometricOptics.register( 'GeometricOpticsScreen', GeometricOpticsScreen );
export default GeometricOpticsScreen;