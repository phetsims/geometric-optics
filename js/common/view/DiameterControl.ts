// Copyright 2021-2022, University of Colorado Boulder

/**
 * DiameterControl is the control for changing the optic's diameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {};

type DiameterControlOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DiameterControl extends NumberControl {

  constructor( diameterProperty: NumberProperty, providedOptions: DiameterControlOptions ) {

    assert && assert( diameterProperty.range ); // {Range|null}
    const range = diameterProperty.range!;

    // Assemble the defaults for NumberControl, because optionize doesn't support defaults in multiple objects.
    const numberControlDefaults = optionize<NumberControlOptions, {}, NumberControlOptions>(
      {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
        delta: GOConstants.DIAMETER_SPINNER_STEP,
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.DIAMETER_SLIDER_STEP ),
          keyboardStep: GOConstants.DIAMETER_KEYBOARD_STEP, // used by all alternative-input devices
          shiftKeyboardStep: GOConstants.DIAMETER_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
          pageKeyboardStep: GOConstants.DIAMETER_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
        },
        numberDisplayOptions: {
          decimalPlaces: GOConstants.DIAMETER_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } );

    // Now add providedOptions to the defaults.
    const options = optionize<DiameterControlOptions, SelfOptions, NumberControlOptions>(
      numberControlDefaults, providedOptions );

    super( geometricOpticsStrings.diameter, diameterProperty, range, options );

    this.addLinkedElement( diameterProperty, {
      tandem: options.tandem.createTandem( diameterProperty.tandem.name )
    } );
  }
}

geometricOptics.register( 'DiameterControl', DiameterControl );