// Copyright 2021, University of Colorado Boulder

/**
 * MirrorScreen is the 'Mirror' screen.
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
import MirrorModel from './model/MirrorModel.js';
import MirrorScreenView from './view/MirrorScreenView.js';

class MirrorScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: geometricOpticsStrings.screen.mirror,
      homeScreenIcon: createScreenIcon(),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new MirrorModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new MirrorScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
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

/**
 * Creates the icon for this screen.
 * @returns {ScreenIcon}
 */
function createScreenIcon() {

  const concaveMirrorNode = CurveRadioButtonGroup.createIconNode( Optic.Type.MIRROR, Optic.Curve.CONCAVE, {
    radius: 20,
    diameter: 30
  } );

  return new ScreenIcon( concaveMirrorNode, {
    fill: GeometricOpticsColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'MirrorScreen', MirrorScreen );
export default MirrorScreen;