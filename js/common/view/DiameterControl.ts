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
import { PickRequired } from '../GOTypes.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';

//TODO https://github.com/phetsims/geometric-optics/issues/326 should be NumberControlOptions
type DiameterControlOptions = PickRequired<NodeOptions, 'tandem'>;

class DiameterControl extends NumberControl {

  /**
   * @param diameterProperty
   * @param providedOptions
   */
  constructor( diameterProperty: NumberProperty, providedOptions: DiameterControlOptions ) {

    const options = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
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
    }, providedOptions );

    assert && assert( diameterProperty.range ); // {Range|null}

    super( geometricOpticsStrings.diameter, diameterProperty, diameterProperty.range!, options );

    this.addLinkedElement( diameterProperty, {
      tandem: options.tandem.createTandem( 'diameterProperty' )
    } );
  }
}

geometricOptics.register( 'DiameterControl', DiameterControl );
export default DiameterControl;