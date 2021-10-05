// Copyright 2021, University of Colorado Boulder

/**
 * MirrorScreen is the 'Mirror' screen.
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
import MirrorModel from './model/MirrorModel.js';
import MirrorScreenView from './view/MirrorScreenView.js';

class MirrorScreen extends Screen {

  constructor() {

    // create concave mirror for home screen icon
    const iconNode = CurveRadioButtonGroup.createIconNode( Optic.Type.MIRROR, Optic.Curve.CONCAVE, {
      radius: 20,
      diameter: 30,
      outline: { stroke: 'black' }
    } );

    const options = {
      name: geometricOpticsStrings.screen.mirror,
      homeScreenIcon: new ScreenIcon( iconNode ),
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty
    };

    super(
      () => new MirrorModel(),
      model => new MirrorScreenView( model ),
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

geometricOptics.register( 'MirrorScreen', MirrorScreen );
export default MirrorScreen;