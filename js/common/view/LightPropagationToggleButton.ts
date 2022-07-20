// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightPropagationToggleButton is a toggle button used to turn light propagation on and off.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import { Image } from '../../../../scenery/js/imports.js';
import BooleanRoundToggleButton, { BooleanRoundToggleButtonOptions } from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import lightPropagationOffIcon_png from '../../../images/lightPropagationOffIcon_png.js';
import lightPropagationOnIcon_png from '../../../images/lightPropagationOnIcon_png.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

type LightPropagationToggleButtonOptions = SelfOptions & PickRequired<BooleanRoundToggleButtonOptions, 'tandem'>;

export default class LightPropagationToggleButton extends BooleanRoundToggleButton {

  public constructor( booleanProperty: Property<boolean>, providedOptions: LightPropagationToggleButtonOptions ) {

    const options = optionize<LightPropagationToggleButtonOptions, SelfOptions, BooleanRoundToggleButtonOptions>()( {

      // BooleanRoundToggleButtonOptions
      radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS, // so that this button will be the same size as ResetAllButton
      xMargin: 4,
      yMargin: 4,
      touchAreaDilation: 5.2, // same as ResetAllButton
      baseColor: GOColors.lightPropagationToggleButtonFillProperty
    }, providedOptions );

    // create nodes for open and closed eye icons
    const onNode = new Image( lightPropagationOnIcon_png );
    const offNode = new Image( lightPropagationOffIcon_png );

    super( booleanProperty, onNode, offNode, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LightPropagationToggleButton', LightPropagationToggleButton );