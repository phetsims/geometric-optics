// Copyright 2021-2022, University of Colorado Boulder

/**
 * RadiusOfCurvatureControl is the control for changing the optic's ROC. It actually changes the ROC magnitude, and
 * indicates the sign by an annotation in the control's label, e.g. 'Radius of Curvature (-)'.
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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;

type RadiusOfCurvatureControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

export default class RadiusOfCurvatureControl extends NumberControl {

  /**
   * @param radiusOfCurvatureMagnitudeProperty - unsigned
   * @param radiusOfCurvatureProperty - signed
   * @param providedOptions
   */
  public constructor( radiusOfCurvatureMagnitudeProperty: NumberProperty,
                      radiusOfCurvatureProperty: TReadOnlyProperty<number>,
                      providedOptions: RadiusOfCurvatureControlOptions ) {

    const range = radiusOfCurvatureMagnitudeProperty.range;

    const titleStringProperty = new DerivedProperty( [
      radiusOfCurvatureProperty,
      GeometricOpticsStrings.radiusOfCurvaturePositiveStringProperty,
      GeometricOpticsStrings.radiusOfCurvatureNegativeStringProperty
    ], ( radiusOfCurvature: number, radiusOfCurvaturePositiveString: string, radiusOfCurvatureNegativeString: string ) =>
      ( radiusOfCurvature >= 0 ) ? radiusOfCurvaturePositiveString : radiusOfCurvatureNegativeString, {
      tandem: providedOptions.tandem.createTandem( 'titleStringProperty' ),
      phetioValueType: StringIO
    } );

    const options = optionize4<RadiusOfCurvatureControlOptions, SelfOptions, NumberControlOptions>()(
      {}, GOConstants.NUMBER_CONTROL_OPTIONS, {

        // NumberControlOptions
        delta: GOConstants.RADIUS_OF_CURVATURE_SPINNER_STEP,
        numberDisplayOptions: {
          decimalPlaces: GOConstants.RADIUS_OF_CURVATURE_DECIMAL_PLACES,
          valuePattern: GeometricOpticsStrings.valueCentimetersPatternStringProperty
        },
        sliderOptions: {
          constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.RADIUS_OF_CURVATURE_SLIDER_STEP ),
          keyboardStep: GOConstants.RADIUS_OF_CURVATURE_KEYBOARD_STEP, // used by all alternative-input devices
          shiftKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
          pageKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_PAGE_KEYBOARD_STEP
        }
      }, providedOptions );

    super( titleStringProperty, radiusOfCurvatureMagnitudeProperty, range, options );

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