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
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

class IndexOfRefractionControl extends NumberControl {

  /**
   * @param {NumberProperty} indexOfRefractionProperty
   * @param options
   */
  constructor( indexOfRefractionProperty: NumberProperty, options?: any ) { //TYPESCRIPT any

    options = merge( {}, GeometricOpticsConstants.NUMBER_CONTROL_OPTIONS, {
      delta: GeometricOpticsConstants.INDEX_OF_REFRACTION_SPINNER_INTERVAL,
      sliderOptions: {
        constrainValue: ( value: number ) =>
          Utils.roundToInterval( value, GeometricOpticsConstants.INDEX_OF_REFRACTION_SLIDER_INTERVAL )
      },
      numberDisplayOptions: {
        decimalPlaces: GeometricOpticsConstants.INDEX_OF_REFRACTION_DECIMAL_PLACES
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( indexOfRefractionProperty.range ); // {Range|null}
    const indexOfRefractionRange: Range = indexOfRefractionProperty.range!;

    super( geometricOpticsStrings.indexOfRefraction, indexOfRefractionProperty, indexOfRefractionRange, options );
  }
}

geometricOptics.register( 'IndexOfRefractionControl', IndexOfRefractionControl );
export default IndexOfRefractionControl;