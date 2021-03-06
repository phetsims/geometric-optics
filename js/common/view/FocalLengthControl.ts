// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthControl is the control for changing the optic's focal length. It actually changes the focal-length
 * magnitude, and indicates the sign by an annotation in the control's label, e.g. 'Focal Length (-)'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type FocalLengthControlOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class FocalLengthControl extends NumberControl {

  /**
   * @param focalLengthMagnitudeProperty - unsigned
   * @param focalLengthProperty - signed
   * @param providedOptions
   */
  public constructor( focalLengthMagnitudeProperty: NumberProperty,
                      focalLengthProperty: IReadOnlyProperty<number>,
                      providedOptions: FocalLengthControlOptions ) {

    assert && assert( focalLengthMagnitudeProperty.range ); // {Range|null}
    const range = focalLengthMagnitudeProperty.range!;

    // Preferable to derive from focalLengthProperty, but scenery.Text requires textProperty to be settable.
    const textProperty = new StringProperty( '', {
      tandem: providedOptions.tandem.createTandem( 'textProperty' ),
      phetioReadOnly: true
    } );
    focalLengthProperty.link( ( focalLength: number ) => {
      textProperty.value = ( focalLength >= 0 ) ? geometricOpticsStrings.focalLengthPositive
                                                : geometricOpticsStrings.focalLengthNegative;
    } );

    // Assemble the defaults for NumberControl, because optionize doesn't support defaults in multiple objects.
    const numberControlDefaults = combineOptions<NumberControlOptions>( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.FOCAL_LENGTH_SPINNER_STEP,
      titleNodeOptions: {
        textProperty: textProperty
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.FOCAL_LENGTH_DECIMAL_PLACES,
        valuePattern: geometricOpticsStrings.valueCentimetersPattern
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.FOCAL_LENGTH_SLIDER_STEP ),
        keyboardStep: GOConstants.FOCAL_LENGTH_KEYBOARD_STEP, // used by all alternative-input devices
        shiftKeyboardStep: GOConstants.FOCAL_LENGTH_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
        pageKeyboardStep: GOConstants.FOCAL_LENGTH_PAGE_KEYBOARD_STEP
      }
    } );

    // Now add providedOptions to the defaults.
    const options = optionize<FocalLengthControlOptions, SelfOptions, NumberControlOptions>()(
      numberControlDefaults, providedOptions );

    super( textProperty.value, focalLengthMagnitudeProperty, range, options );

    this.addLinkedElement( focalLengthMagnitudeProperty, {
      tandem: options.tandem.createTandem( focalLengthMagnitudeProperty.tandem.name )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'FocalLengthControl', FocalLengthControl );