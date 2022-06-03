// Copyright 2021-2022, University of Colorado Boulder

/**
 * RadiusOfCurvatureControl is the control for changing the optic's ROC. It actually changes the ROC magnitude, and
 * indicates the sign by an annotation in the control's label, e.g. 'Radius of Curvature (-)'.
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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = {};

type RadiusOfCurvatureControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class RadiusOfCurvatureControl extends NumberControl {

  /**
   * @param radiusOfCurvatureMagnitudeProperty - unsigned
   * @param radiusOfCurvatureProperty - signed
   * @param providedOptions
   */
  public constructor( radiusOfCurvatureMagnitudeProperty: NumberProperty,
                      radiusOfCurvatureProperty: IReadOnlyProperty<number>,
                      providedOptions: RadiusOfCurvatureControlOptions ) {

    assert && assert( radiusOfCurvatureMagnitudeProperty.range ); // {Range|null}
    const range = radiusOfCurvatureMagnitudeProperty.range!;

    // Preferable to derive from radiusOfCurvatureProperty, but scenery.Text requires textProperty to be settable.
    const textProperty = new StringProperty( '', {
      tandem: providedOptions.tandem.createTandem( 'textProperty' ),
      phetioReadOnly: true
    } );
    radiusOfCurvatureProperty.link( ( radiusOfCurvature: number ) => {
      textProperty.value = ( radiusOfCurvature >= 0 ) ? geometricOpticsStrings.radiusOfCurvaturePositive
                                                      : geometricOpticsStrings.radiusOfCurvatureNegative;
    } );

    // Assemble the defaults for NumberControl, because optionize doesn't support defaults in multiple objects.
    const numberControlDefaults = combineOptions<NumberControlOptions>( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.RADIUS_OF_CURVATURE_SPINNER_STEP,
      titleNodeOptions: {
        textProperty: textProperty
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.RADIUS_OF_CURVATURE_DECIMAL_PLACES,
        valuePattern: geometricOpticsStrings.valueCentimetersPattern
      },
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.RADIUS_OF_CURVATURE_SLIDER_STEP ),
        keyboardStep: GOConstants.RADIUS_OF_CURVATURE_KEYBOARD_STEP, // used by all alternative-input devices
        shiftKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
        pageKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_PAGE_KEYBOARD_STEP
      }
    } );

    // Now add providedOptions to the defaults.
    const options = optionize<RadiusOfCurvatureControlOptions, SelfOptions, NumberControlOptions>()(
      numberControlDefaults, providedOptions );

    super( textProperty.value, radiusOfCurvatureMagnitudeProperty, range, options );

    this.addLinkedElement( radiusOfCurvatureMagnitudeProperty, {
      tandem: options.tandem.createTandem( radiusOfCurvatureMagnitudeProperty.tandem.name )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'RadiusOfCurvatureControl', RadiusOfCurvatureControl );