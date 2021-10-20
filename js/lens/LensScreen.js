// Copyright 2021, University of Colorado Boulder

/**
 * LensScreen is the 'Lens' screen.
 *
 * @author Martin Veillette
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import GeometricOpticsColors from '../common/GeometricOpticsColors.js';
import Optic from '../common/model/Optic.js';
import CurveRadioButtonGroup from '../common/view/CurveRadioButtonGroup.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensScreenView from './view/LensScreenView.js';

class LensScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // create convex lens for home screen icon
    const iconNode = CurveRadioButtonGroup.createIconNode( Optic.Type.LENS, Optic.Curve.CONVEX, {
      radius: 20,
      diameter: 30
    } );

    options = merge( {
      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: new ScreenIcon( iconNode, {
        fill: GeometricOpticsColors.screenBackgroundColorProperty
      } ),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new LensModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LensScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LensScreen', LensScreen );
export default LensScreen;