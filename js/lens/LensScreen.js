// Copyright 2021, University of Colorado Boulder

/**
 * LensScreen is the 'Lens' screen.
 *
 * @author Martin Veillette
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import GeometricOpticsColors from '../common/GeometricOpticsColors.js';
import Optic from '../common/model/Optic.js';
import CurveRadioButtonGroup from '../common/view/CurveRadioButtonGroup.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensScreenView from './view/LensScreenView.js';

class LensScreen extends Screen {

  constructor() {

    // create convex lens for home screen icon
    const iconNode = CurveRadioButtonGroup.createIconNode( Optic.Type.LENS, Optic.Curve.CONVEX, {
      radius: 20,
      diameter: 30,
      outline: { stroke: 'black' }
    } );

    const options = {
      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: new ScreenIcon( iconNode ),
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty
    };

    super(
      () => new LensModel(),
      model => new LensScreenView( model ),
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