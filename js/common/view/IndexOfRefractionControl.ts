// Copyright 2021, University of Colorado Boulder

/**
 * IndexOfRefractionControl is the control for changing the lens' index of refraction.
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

class IndexOfRefractionControl extends NumberControl {

  /**
   * @param indexOfRefractionProperty
   * @param options
   */
  constructor( indexOfRefractionProperty: NumberProperty, options: Options ) {

    assert && assert( indexOfRefractionProperty.range ); // {Range|null}
    const indexOfRefractionRange: Range = indexOfRefractionProperty.range!;

    super( geometricOpticsStrings.indexOfRefraction, indexOfRefractionProperty, indexOfRefractionRange,
      merge( {}, GOConstants.NUMBER_CONTROL_OPTIONS, {
        delta: GOConstants.INDEX_OF_REFRACTION_SPINNER_INTERVAL,
        sliderOptions: {
          constrainValue: ( value: number ) =>
            Utils.roundToInterval( value, GOConstants.INDEX_OF_REFRACTION_SLIDER_INTERVAL )
        },
        numberDisplayOptions: {
          decimalPlaces: GOConstants.INDEX_OF_REFRACTION_DECIMAL_PLACES
        }
      }, options ) );
  }
}

geometricOptics.register( 'IndexOfRefractionControl', IndexOfRefractionControl );
export default IndexOfRefractionControl;