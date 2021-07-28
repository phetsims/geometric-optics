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
import LensModel from './model/LensModel.js';
import LensScreenView from './view/LensScreenView.js';

class LensScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // create icon for lens
    const iconNode = CurveControl.createIconNode(
      20,
      30,
      Optic.Curve.CONVEX,
      Optic.Type.LENS,
      { outline: { stroke: 'black' } } );

    const options = {

      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: new ScreenIcon( iconNode ),
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,
      tandem: tandem
    };


    super(
      () => new LensModel( tandem.createTandem( 'model' ) ),
      model => new LensScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

geometricOptics.register( 'LensScreen', LensScreen );
export default LensScreen;
