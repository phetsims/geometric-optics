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

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // create icon for mirror
    const iconNode = CurveControl.createIconNode(
      20,
      30,
      Optic.Curve.CONCAVE,
      Optic.Type.MIRROR,
      { outline: { stroke: 'black' } } );

    const options = {
      name: geometricOpticsStrings.screen.mirror,
      homeScreenIcon: new ScreenIcon( iconNode ),
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,
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
