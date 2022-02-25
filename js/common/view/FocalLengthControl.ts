// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthControl is the control for changing the optic's focal length. It actually changes the focal-length
 * magnitude, and indicates the sign by an annotation in the control's label, e.g. 'Focal Length (-)'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import Range from '../../../../dot/js/Range.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { Defaults } from '../../../../phet-core/js/optionize.js';
import { NumberControlOptions } from '../GOCommonOptions.js';

type FocalLengthControlOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>;

class FocalLengthControl extends NumberControl {

  /**
   * @param focalLengthMagnitudeProperty
   * @param focalLengthProperty
   * @param providedOptions
   */
  constructor( focalLengthMagnitudeProperty: NumberProperty,
               focalLengthProperty: IReadOnlyProperty<number>,
               providedOptions: FocalLengthControlOptions ) {

    // Preferable to derive from focalLengthProperty, but scenery.Text requires textProperty to be settable.
    const textProperty = new StringProperty( '', {
      tandem: providedOptions.tandem.createTandem( 'textProperty' ),
      phetioReadOnly: true
    } );
    focalLengthProperty.link( ( focalLength: number ) => {
      textProperty.value = ( focalLength >= 0 ) ? geometricOpticsStrings.focalLengthPositive
                                                : geometricOpticsStrings.focalLengthNegative;
    } );

    // Assemble the defaults for NumberControl, because optionize doesn't currently support defaults in multiple objects.
    const numberControlDefaults: Defaults<{}, NumberControlOptions> = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
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
        pageKeyboardStep: GOConstants.FOCAL_LENGTH_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
      }
    } );

    const options = optionize<FocalLengthControlOptions, {}, NumberControlOptions>( {}, numberControlDefaults, providedOptions );

    assert && assert( focalLengthMagnitudeProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = focalLengthMagnitudeProperty.range!;

    super( textProperty!.value, focalLengthMagnitudeProperty, radiusOfCurvatureRange, options );

    this.addLinkedElement( focalLengthMagnitudeProperty, {
      tandem: options.tandem.createTandem( 'focalLengthMagnitudeProperty' )
    } );
  }
}

geometricOptics.register( 'FocalLengthControl', FocalLengthControl );
export default FocalLengthControl;