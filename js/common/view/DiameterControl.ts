// Copyright 2021, University of Colorado Boulder

/**
 * DiameterControl is the control for changing the optic's diameter.
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

class DiameterControl extends NumberControl {

  /**
   * @param {NumberProperty} diameterProperty
   * @param options
   */
  constructor( diameterProperty: NumberProperty, options?: any ) { //TYPESCRIPT any

    options = merge( {}, GeometricOpticsConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GeometricOpticsConstants.DIAMETER_SPINNER_INTERVAL,
      sliderOptions: {
        constrainValue: ( value: number ) =>
          Utils.roundToInterval( value, GeometricOpticsConstants.DIAMETER_SLIDER_INTERVAL )
      },
      numberDisplayOptions: {
        decimalPlaces: GeometricOpticsConstants.DIAMETER_DECIMAL_PLACES,
        valuePattern: geometricOpticsStrings.valueCentimetersPattern
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( diameterProperty.range ); // {Range|null}
    const diameterRange: Range = diameterProperty.range!;

    super( geometricOpticsStrings.diameter, diameterProperty, diameterRange, options );
  }
}

geometricOptics.register( 'DiameterControl', DiameterControl );
export default DiameterControl;