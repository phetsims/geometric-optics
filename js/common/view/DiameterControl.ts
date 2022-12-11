// Copyright 2021-2022, University of Colorado Boulder

/**
 * DiameterControl is the control for changing the optic's diameter.
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
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type DiameterControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class DiameterControl extends NumberControl {

  public constructor( diameterProperty: NumberProperty, providedOptions: DiameterControlOptions ) {

    const range = diameterProperty.range;

    const options = optionize4<DiameterControlOptions, SelfOptions, NumberControlOptions>()(
      {}, GOConstants.NUMBER_CONTROL_OPTIONS, {

        // NumberControlOptions
        delta: GOConstants.DIAMETER_SPINNER_STEP,
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.DIAMETER_SLIDER_STEP ),
          keyboardStep: GOConstants.DIAMETER_KEYBOARD_STEP, // used by all alternative-input devices
          shiftKeyboardStep: GOConstants.DIAMETER_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
          pageKeyboardStep: GOConstants.DIAMETER_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
        },
        numberDisplayOptions: {
          decimalPlaces: GOConstants.DIAMETER_DECIMAL_PLACES,
          valuePattern: GeometricOpticsStrings.valueCentimetersPatternStringProperty
        }
      }, providedOptions );

    super( GeometricOpticsStrings.diameterStringProperty, diameterProperty, range, options );

    this.addLinkedElement( diameterProperty, {
      tandem: options.tandem.createTandem( diameterProperty.tandem.name )
    } );
  }
}

geometricOptics.register( 'DiameterControl', DiameterControl );