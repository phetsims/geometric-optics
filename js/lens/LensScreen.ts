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
import OpticShapeRadioButtonGroup from '../common/view/OpticShapeRadioButtonGroup.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensScreenView from './view/LensScreenView.js';

//TODO-TS replace with ScreenOptions
type LensScreenOptions = {
  tandem: Tandem,
};

class LensScreen extends Screen {

  /**
   * @param {Object} [providedOptions]
   */
  constructor( providedOptions?: Partial<LensScreenOptions> ) {

    const options = merge( {
      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: createScreenIcon(),
      showUnselectedHomeScreenIconFrame: true,
      backgroundColorProperty: GeometricOpticsColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions ) as LensScreenOptions;

    super(
      () => new LensModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      ( model: LensModel ) => new LensScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
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

  const convexLensNode = OpticShapeRadioButtonGroup.createIconNode( 'lens', 'convex', {
    radius: 20,
    diameter: 30
  } );

  return new ScreenIcon( convexLensNode, {
    fill: GeometricOpticsColors.screenBackgroundColorProperty
  } );
}

geometricOptics.register( 'LensScreen', LensScreen );
export default LensScreen;