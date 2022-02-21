// Copyright 2021-2022, University of Colorado Boulder

/**
 * RadiusOfCurvatureControl is the control for changing the optic's radius of curvature.
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

type RadiusOfCurvatureControlOptions = {
  visibleProperty: IProperty<boolean>,
  tandem: Tandem
};

class RadiusOfCurvatureControl extends NumberControl {

  /**
   * @param radiusOfCurvatureProperty
   * @param providedOptions
   */
  constructor( radiusOfCurvatureProperty: NumberProperty, providedOptions: RadiusOfCurvatureControlOptions ) {

    const options = merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GOConstants.RADIUS_OF_CURVATURE_SPINNER_STEP,
      sliderOptions: {
        constrainValue: ( value: number ) => Utils.roundToInterval( value, GOConstants.RADIUS_OF_CURVATURE_SLIDER_STEP ),
        keyboardStep: GOConstants.RADIUS_OF_CURVATURE_KEYBOARD_STEP, // used by all alternative-input devices
        shiftKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
        pageKeyboardStep: GOConstants.RADIUS_OF_CURVATURE_PAGE_KEYBOARD_STEP // coarser grain, used by keyboard only
      },
      numberDisplayOptions: {
        decimalPlaces: GOConstants.RADIUS_OF_CURVATURE_DECIMAL_PLACES,
        valuePattern: geometricOpticsStrings.valueCentimetersPattern
      }
    }, providedOptions );

    assert && assert( radiusOfCurvatureProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = radiusOfCurvatureProperty.range!;

    super( geometricOpticsStrings.radiusOfCurvature, radiusOfCurvatureProperty, radiusOfCurvatureRange, options );

    this.addLinkedElement( radiusOfCurvatureProperty, {
      tandem: options.tandem.createTandem( 'radiusOfCurvatureProperty' )
    } );
  }
}

geometricOptics.register( 'RadiusOfCurvatureControl', RadiusOfCurvatureControl );
export default RadiusOfCurvatureControl;