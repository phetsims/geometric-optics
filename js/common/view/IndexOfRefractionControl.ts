// Copyright 2021-2022, University of Colorado Boulder

/**
 * IndexOfRefractionControl is the control for changing the lens' index of refraction.
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
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';

type IndexOfRefractionControlOptions = {
  visibleProperty: IProperty<boolean>,
  tandem: Tandem
};

class IndexOfRefractionControl extends NumberControl {

  /**
   * @param indexOfRefractionProperty
   * @param providedOptions
   */
  constructor( indexOfRefractionProperty: NumberProperty, providedOptions: IndexOfRefractionControlOptions ) {

    assert && assert( indexOfRefractionProperty.range ); // {Range|null}
    const indexOfRefractionRange: Range = indexOfRefractionProperty.range!;

    super( geometricOpticsStrings.indexOfRefraction, indexOfRefractionProperty, indexOfRefractionRange,
      merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
        delta: GOConstants.INDEX_OF_REFRACTION_SPINNER_STEP,
        sliderOptions: {
          constrainValue: ( value: number ) =>
            Utils.roundToInterval( value, GOConstants.INDEX_OF_REFRACTION_SLIDER_STEP ),
          keyboardStep: GOConstants.INDEX_OF_REFRACTION_KEYBOARD_STEP, // used by all alternative-input devices
          shiftKeyboardStep: GOConstants.INDEX_OF_REFRACTION_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
          pageKeyboardStep: GOConstants.INDEX_OF_REFRACTION_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
        },
        numberDisplayOptions: {
          decimalPlaces: GOConstants.INDEX_OF_REFRACTION_DECIMAL_PLACES
        }
      }, providedOptions ) );
  }
}

geometricOptics.register( 'IndexOfRefractionControl', IndexOfRefractionControl );
export default IndexOfRefractionControl;