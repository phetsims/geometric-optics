// Copyright 2021-2022, University of Colorado Boulder

/**
 * DiameterControl is the control for changing the optic's diameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { NumberControlOptions } from '../GOCommonOptions.js';
import optionize, { Defaults } from '../../../../phet-core/js/optionize.js';

type DiameterControlOptions = PickRequired<NodeOptions, 'tandem'>;

class DiameterControl extends NumberControl {

  /**
   * @param diameterProperty
   * @param providedOptions
   */
  constructor( diameterProperty: NumberProperty, providedOptions: DiameterControlOptions ) {

    // Assemble the defaults for NumberControl, because optionize doesn't currently support defaults in multiple objects.
    const numberControlDefaults: Defaults<{}, NumberControlOptions> = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
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

    const options = optionize<DiameterControlOptions, {}, NumberControlOptions>( numberControlDefaults, providedOptions );

    assert && assert( diameterProperty.range ); // {Range|null}

    super( geometricOpticsStrings.diameter, diameterProperty, diameterProperty.range!, options );

    this.addLinkedElement( diameterProperty, {
      tandem: options.tandem.createTandem( 'diameterProperty' )
    } );
  }
}

geometricOptics.register( 'DiameterControl', DiameterControl );
export default DiameterControl;