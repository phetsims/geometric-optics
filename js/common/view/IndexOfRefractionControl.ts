// Copyright 2021-2023, University of Colorado Boulder

/**
 * IndexOfRefractionControl is the control for changing the lens' index of refraction (IOR).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type IndexOfRefractionControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class IndexOfRefractionControl extends NumberControl {

  public constructor( indexOfRefractionProperty: NumberProperty, providedOptions: IndexOfRefractionControlOptions ) {

    const range = indexOfRefractionProperty.range;

    // Assemble the defaults for NumberControl, because optionize doesn't support defaults in multiple objects.
    const numberControlDefaults = combineOptions<StrictOmit<NumberControlOptions, 'tandem'>>( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.INDEX_OF_REFRACTION_SPINNER_STEP,
      sliderOptions: {
        constrainValue: ( value: number ) =>
          Utils.roundToInterval( value, GOConstants.INDEX_OF_REFRACTION_SLIDER_STEP ),
        keyboardStep: GOConstants.INDEX_OF_REFRACTION_KEYBOARD_STEP, // used by all alternative-input devices
        shiftKeyboardStep: GOConstants.INDEX_OF_REFRACTION_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
        pageKeyboardStep: GOConstants.INDEX_OF_REFRACTION_PAGE_KEYBOARD_STEP
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.INDEX_OF_REFRACTION_DECIMAL_PLACES
      }
    } );

    // Now add providedOptions to the defaults.
    const options = optionize<IndexOfRefractionControlOptions, SelfOptions, NumberControlOptions>()(
      numberControlDefaults, providedOptions );

    super( GeometricOpticsStrings.indexOfRefractionStringProperty, indexOfRefractionProperty, range, options );

    this.addLinkedElement( indexOfRefractionProperty, {
      tandem: options.tandem.createTandem( indexOfRefractionProperty.tandem.name )
    } );
  }
}

geometricOptics.register( 'IndexOfRefractionControl', IndexOfRefractionControl );