// Copyright 2021-2022, University of Colorado Boulder

/**
 * DiameterControl is the control for changing the optic's diameter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

type DiameterControlOptions = {
  tandem: Tandem
};

class DiameterControl extends NumberControl {

  /**
   * @param diameterProperty
   * @param providedOptions
   */
  constructor( diameterProperty: NumberProperty, providedOptions: DiameterControlOptions ) {

    assert && assert( diameterProperty.range ); // {Range|null}

    super( geometricOpticsStrings.diameter, diameterProperty, diameterProperty.range!,
      merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
        delta: GOConstants.DIAMETER_SPINNER_INTERVAL,
        sliderOptions: {
          constrainValue: ( value: number ) =>
            Utils.roundToInterval( value, GOConstants.DIAMETER_SLIDER_INTERVAL )
        },
        numberDisplayOptions: {
          decimalPlaces: GOConstants.DIAMETER_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      }, providedOptions ) );
  }
}

geometricOptics.register( 'DiameterControl', DiameterControl );
export default DiameterControl;