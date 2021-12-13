// Copyright 2021, University of Colorado Boulder

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

type Options = {
  tandem: Tandem
};

class RadiusOfCurvatureControl extends NumberControl {

  /**
   * @param radiusOfCurvatureProperty
   * @param options
   */
  constructor( radiusOfCurvatureProperty: NumberProperty, options: Options ) {

    assert && assert( radiusOfCurvatureProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = radiusOfCurvatureProperty.range!;

    super( geometricOpticsStrings.radiusOfCurvature, radiusOfCurvatureProperty, radiusOfCurvatureRange,
      merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
        delta: GOConstants.RADIUS_OF_CURVATURE_SPINNER_INTERVAL,
        sliderOptions: {
          constrainValue: ( value: number ) =>
            Utils.roundToInterval( value, GOConstants.RADIUS_OF_CURVATURE_SLIDER_INTERVAL )
        },
        numberDisplayOptions: {
          decimalPlaces: GOConstants.RADIUS_OF_CURVATURE_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      }, options ) );
  }
}

geometricOptics.register( 'RadiusOfCurvatureControl', RadiusOfCurvatureControl );
export default RadiusOfCurvatureControl;