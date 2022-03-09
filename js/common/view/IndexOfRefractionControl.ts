// Copyright 2021-2022, University of Colorado Boulder

/**
 * IndexOfRefractionControl is the control for changing the lens' index of refraction (IOR).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { OptionizeDefaults } from '../../../../phet-core/js/optionize.js';

type IndexOfRefractionControlOptions = PickRequired<NumberControlOptions, 'tandem'>;

class IndexOfRefractionControl extends NumberControl {

  /**
   * @param indexOfRefractionProperty
   * @param providedOptions
   */
  constructor( indexOfRefractionProperty: NumberProperty, providedOptions: IndexOfRefractionControlOptions ) {

    assert && assert( indexOfRefractionProperty.range ); // {Range|null}
    const range = indexOfRefractionProperty.range!;

    // function to constrain the allowed values
    const constrainValues = ( value: number ) =>
      Utils.roundToInterval( value, GOConstants.INDEX_OF_REFRACTION_SLIDER_STEP );

    // Assemble the defaults for NumberControl, because optionize doesn't currently support defaults in multiple objects.
    const numberControlDefaults: OptionizeDefaults<{}, NumberControlOptions> = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.INDEX_OF_REFRACTION_SPINNER_STEP,
      sliderOptions: {
        constrainValue: constrainValues,
        keyboardStep: GOConstants.INDEX_OF_REFRACTION_KEYBOARD_STEP, // used by all alternative-input devices
        shiftKeyboardStep: GOConstants.INDEX_OF_REFRACTION_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
        pageKeyboardStep: GOConstants.INDEX_OF_REFRACTION_PAGE_KEYBOARD_STEP, // coarser grain, used by keyboard only

        // generate a sound for each slider step
        soundGeneratorOptions: {
          numberOfMiddleThresholds: Utils.roundSymmetric( range.getLength() / GOConstants.INDEX_OF_REFRACTION_SLIDER_STEP ) - 1,
          constrainThresholds: constrainValues
        }
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.INDEX_OF_REFRACTION_DECIMAL_PLACES
      }
    } );

    const options = optionize<IndexOfRefractionControlOptions, {}, NumberControlOptions>( numberControlDefaults, providedOptions );

    super( geometricOpticsStrings.indexOfRefraction, indexOfRefractionProperty, range, options );

    this.addLinkedElement( indexOfRefractionProperty, {
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' )
    } );
  }
}

geometricOptics.register( 'IndexOfRefractionControl', IndexOfRefractionControl );
export default IndexOfRefractionControl;