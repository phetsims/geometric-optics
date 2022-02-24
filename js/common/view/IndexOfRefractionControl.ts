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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { PickRequired } from '../GOTypes.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';

type IndexOfRefractionControlOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>;

class IndexOfRefractionControl extends NumberControl {

  /**
   * @param indexOfRefractionProperty
   * @param providedOptions
   */
  constructor( indexOfRefractionProperty: NumberProperty, providedOptions: IndexOfRefractionControlOptions ) {

    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when NumberControlOptions exists
    const options = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
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
    }, providedOptions );

    assert && assert( indexOfRefractionProperty.range ); // {Range|null}
    const indexOfRefractionRange: Range = indexOfRefractionProperty.range!;

    super( geometricOpticsStrings.indexOfRefraction, indexOfRefractionProperty, indexOfRefractionRange, options );

    this.addLinkedElement( indexOfRefractionProperty, {
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' )
    } );
  }
}

geometricOptics.register( 'IndexOfRefractionControl', IndexOfRefractionControl );
export default IndexOfRefractionControl;