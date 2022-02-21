// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthControl is the control for changing the optic's focal length.
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

type FocalLengthControlOptions = {
  visibleProperty: IProperty<boolean>,
  tandem: Tandem
};

class FocalLengthControl extends NumberControl {

  /**
   * @param focalLengthProperty
   * @param providedOptions
   */
  constructor( focalLengthProperty: NumberProperty, providedOptions: FocalLengthControlOptions ) {

    const options = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.FOCAL_LENGTH_SPINNER_STEP,
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.FOCAL_LENGTH_SLIDER_STEP ),
        keyboardStep: GOConstants.FOCAL_LENGTH_KEYBOARD_STEP, // used by all alternative-input devices
        shiftKeyboardStep: GOConstants.FOCAL_LENGTH_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
        pageKeyboardStep: GOConstants.FOCAL_LENGTH_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.FOCAL_LENGTH_DECIMAL_PLACES,
        valuePattern: geometricOpticsStrings.valueCentimetersPattern
      }
    }, providedOptions );

    assert && assert( focalLengthProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = focalLengthProperty.range!;

    super( geometricOpticsStrings.focalLength, focalLengthProperty, radiusOfCurvatureRange, options );

    this.addLinkedElement( focalLengthProperty, {
      tandem: options.tandem.createTandem( 'focalLengthProperty' )
    } );
  }
}

geometricOptics.register( 'FocalLengthControl', FocalLengthControl );
export default FocalLengthControl;