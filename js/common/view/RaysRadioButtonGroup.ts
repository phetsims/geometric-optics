// Copyright 2021, University of Colorado Boulder

/**
 * RaysRadioButtonGroup is the radio button group labeled 'Rays', for choosing a representation of rays.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import RaysModeEnum from '../model/RaysModeEnum.js';

class RaysRadioButtonGroup extends VerticalAquaRadioButtonGroup<RaysModeEnum> {

  /**
   * @param {Property.<RaysModeEnum>} raysModeProperty
   * @param {Object} [options]
   */
  constructor( raysModeProperty: Property<RaysModeEnum>, options?: any ) { //TYPESCRIPT any

    options = merge( {
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, options );

    // items for ray Mode radio buttons
    const items = [
      createItem( 'marginal', geometricOpticsStrings.marginal ),
      createItem( 'principal', geometricOpticsStrings.principal ),
      createItem( 'many', geometricOpticsStrings.many ),
      createItem( 'none', geometricOpticsStrings.none )
    ];

    super( raysModeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param {RaysModeEnum} value
 * @param {string} text
 * @returns {{value: RaysModeEnum, node: Text, tandemName: string}} item
 */
//TYPESCRIPT needs a return type
function createItem( value: RaysModeEnum, text: string ) {
  return {
    value: value,
    node: new Text( text, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxWidth: 100
    } ),
    tandemName: `${value}RadioButton`
  };
}

geometricOptics.register( 'RaysRadioButtonGroup', RaysRadioButtonGroup );
export default RaysRadioButtonGroup;