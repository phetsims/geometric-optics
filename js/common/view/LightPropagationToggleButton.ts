// Copyright 2021-2025, University of Colorado Boulder

/**
 * LightPropagationToggleButton is a toggle button used to turn light propagation on and off.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import BooleanRoundToggleButton, { BooleanRoundToggleButtonOptions } from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import lightPropagationOffIcon_png from '../../../images/lightPropagationOffIcon_png.js';
import lightPropagationOnIcon_png from '../../../images/lightPropagationOnIcon_png.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';

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
      baseColor: GOColors.lightPropagationToggleButtonFillProperty,
      isDisposable: false
    }, providedOptions );

    // create nodes for open and closed eye icons
    const onNode = new Image( lightPropagationOnIcon_png );
    const offNode = new Image( lightPropagationOffIcon_png );

    super( booleanProperty, onNode, offNode, options );
  }
}

geometricOptics.register( 'LightPropagationToggleButton', LightPropagationToggleButton );