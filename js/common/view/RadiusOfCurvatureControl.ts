// Copyright 2021-2022, University of Colorado Boulder

/**
 * RadiusOfCurvatureControl is the control for changing the optic's ROC. It actually changes the ROC magnitude, and
 * indicates the sign by an annotation in the control's label, e.g. 'Radius of Curvature (-)'.
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
import { NumberControlOptions } from '../GOCommonOptions.js';
import optionize, { OptionizeDefaults } from '../../../../phet-core/js/optionize.js';

type RadiusOfCurvatureControlOptions = PickRequired<NodeOptions, 'tandem'>;

class RadiusOfCurvatureControl extends NumberControl {

  /**
   * @param radiusOfCurvatureMagnitudeProperty
   * @param radiusOfCurvatureProperty
   * @param providedOptions
   */
  constructor( radiusOfCurvatureMagnitudeProperty: NumberProperty,
               radiusOfCurvatureProperty: IReadOnlyProperty<number>,
               providedOptions: RadiusOfCurvatureControlOptions ) {

    // Preferable to derive from radiusOfCurvatureProperty, but scenery.Text requires textProperty to be settable.
    const textProperty = new StringProperty( '', {
      tandem: providedOptions.tandem.createTandem( 'textProperty' ),
      phetioReadOnly: true
    } );
    radiusOfCurvatureProperty.link( ( radiusOfCurvature: number ) => {
      textProperty.value = ( radiusOfCurvature >= 0 ) ? geometricOpticsStrings.radiusOfCurvaturePositive
                                                      : geometricOpticsStrings.radiusOfCurvatureNegative;
    } );

    // Assemble the defaults for NumberControl, because optionize doesn't currently support defaults in multiple objects.
    const numberControlDefaults: OptionizeDefaults<{}, NumberControlOptions> = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
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
        pageKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
      }
    } );

    const options = optionize<RadiusOfCurvatureControlOptions, {}, NumberControlOptions>( numberControlDefaults, providedOptions );

    assert && assert( radiusOfCurvatureMagnitudeProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = radiusOfCurvatureMagnitudeProperty.range!;

    super( textProperty.value, radiusOfCurvatureMagnitudeProperty, radiusOfCurvatureRange, options );

    this.addLinkedElement( radiusOfCurvatureMagnitudeProperty, {
      tandem: options.tandem.createTandem( 'radiusOfCurvatureMagnitudeProperty' )
    } );
  }
}

geometricOptics.register( 'RadiusOfCurvatureControl', RadiusOfCurvatureControl );
export default RadiusOfCurvatureControl;