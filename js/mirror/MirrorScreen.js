// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import GeometricOpticsColors from '../common/GeometricOpticsColors.js';
import Optic from '../common/model/Optic.js';
import CurveControl from '../common/view/CurveControl.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import MirrorModel from './model/MirrorModel.js';
import MirrorScreenView from './view/MirrorScreenView.js';

class MirrorScreen extends Screen {

  constructor() {

    // create concave mirror for home screen icon
    const iconNode = CurveControl.createIconNode( Optic.Type.MIRROR, Optic.Curve.CONCAVE, {
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
}

geometricOptics.register( 'MirrorScreen', MirrorScreen );
export default MirrorScreen;