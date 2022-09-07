// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthControl is the control for changing the optic's focal length. It actually changes the focal-length
 * magnitude, and indicates the sign by an annotation in the control's label, e.g. 'Focal Length (-)'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';

type SelfOptions = EmptySelfOptions;

type FocalLengthControlOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class FocalLengthControl extends NumberControl {

  /**
   * @param focalLengthMagnitudeProperty - unsigned
   * @param focalLengthProperty - signed
   * @param providedOptions
   */
  public constructor( focalLengthMagnitudeProperty: NumberProperty,
                      focalLengthProperty: TReadOnlyProperty<number>,
                      providedOptions: FocalLengthControlOptions ) {

    assert && assert( focalLengthMagnitudeProperty.range ); // {Range|null}
    const range = focalLengthMagnitudeProperty.range!;

    const titleStringProperty = new DerivedProperty( [
      focalLengthProperty,
      GeometricOpticsStrings.focalLengthPositiveStringProperty,
      GeometricOpticsStrings.focalLengthNegativeStringProperty
    ], ( focalLength: number, focalLengthPositiveString: string, focalLengthNegativeString: string ) =>
      ( focalLength >= 0 ) ? focalLengthPositiveString : focalLengthNegativeString, {
      tandem: providedOptions.tandem.createTandem( 'titleStringProperty' ),
      phetioValueType: StringIO
    } );

    // Assemble the defaults for NumberControl, because optionize doesn't support defaults in multiple objects.
    const numberControlDefaults = combineOptions<NumberControlOptions>( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.FOCAL_LENGTH_SPINNER_STEP,
      titleNodeOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.FOCAL_LENGTH_DECIMAL_PLACES,
        valuePattern: GeometricOpticsStrings.valueCentimetersPatternStringProperty
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

    super( titleStringProperty, focalLengthMagnitudeProperty, range, options );

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