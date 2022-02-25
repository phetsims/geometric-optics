// Copyright 2021-2022, University of Colorado Boulder

/**
 * RadiusOfCurvatureControl is the control for changing the optic's radius of curvature. It actually changes the
 * radius-of-curvature magnitude, and indicates the sign by an annotation in the control's label, e.g.
 * 'Radius of Curvature (-)'.
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
import { PickRequired } from '../PickRequired.js';

type RadiusOfCurvatureControlOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>;

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

    const options = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
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
    }, providedOptions );

    assert && assert( radiusOfCurvatureMagnitudeProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = radiusOfCurvatureMagnitudeProperty.range!;

    super( options.titleNodeOptions.textProperty.value, radiusOfCurvatureMagnitudeProperty, radiusOfCurvatureRange, options );

    this.addLinkedElement( radiusOfCurvatureMagnitudeProperty, {
      tandem: options.tandem.createTandem( 'radiusOfCurvatureMagnitudeProperty' )
    } );
  }
}

geometricOptics.register( 'RadiusOfCurvatureControl', RadiusOfCurvatureControl );
export default RadiusOfCurvatureControl;