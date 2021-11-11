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
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

class RadiusOfCurvatureControl extends NumberControl {

  /**
   * @param {NumberProperty} radiusOfCurvatureProperty
   * @param options
   */
  constructor( radiusOfCurvatureProperty: NumberProperty, options?: any ) { //TYPESCRIPT any

    options = merge( {}, GeometricOpticsConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GeometricOpticsConstants.RADIUS_OF_CURVATURE_SPINNER_INTERVAL,
      sliderOptions: {
        constrainValue: ( value: number ) =>
          Utils.roundToInterval( value, GeometricOpticsConstants.RADIUS_OF_CURVATURE_SLIDER_INTERVAL )
      },
      numberDisplayOptions: {
        decimalPlaces: GeometricOpticsConstants.RADIUS_OF_CURVATURE_DECIMAL_PLACES,
        valuePattern: geometricOpticsStrings.valueCentimetersPattern
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    } );

    assert && assert( radiusOfCurvatureProperty.range ); // {Range|null}
    const radiusOfCurvatureRange: Range = radiusOfCurvatureProperty.range!;

    super( geometricOpticsStrings.radiusOfCurvature, radiusOfCurvatureProperty, radiusOfCurvatureRange, options );
  }
}

geometricOptics.register( 'RadiusOfCurvatureControl', RadiusOfCurvatureControl );
export default RadiusOfCurvatureControl;