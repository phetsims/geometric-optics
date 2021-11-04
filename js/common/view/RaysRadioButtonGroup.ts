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

class RaysRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {Property.<RaysModeEnum>} raysModeProperty
   * @param {Object} [options]
   */
  constructor( raysModeProperty: Property<RaysModeEnum>, options?: any ) { //TS any

    options = merge( {
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, options );

    // items for ray Mode radio buttons
    const items = [
      createItem( 'marginal', geometricOpticsStrings.marginal, 'marginalRadioButton' ),
      createItem( 'principal', geometricOpticsStrings.principal, 'principalRadioButton' ),
      createItem( 'many', geometricOpticsStrings.many, 'manyRadioButton' ),
      createItem( 'none', geometricOpticsStrings.none, 'noneRadioButton' )
    ];

    super( raysModeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param {RaysModeEnum} raysMode
 * @param {string} text
 * @param {string} tandemName
 * @returns {{value: RaysModeEnum, node: Text, tandemName: string}} item
 */
function createItem( raysMode: RaysModeEnum, text: string, tandemName: string ) {
  return {
    value: raysMode,
    node: new Text( text, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxWidth: 100
    } ),
    tandemName: tandemName
  };
}

geometricOptics.register( 'RaysRadioButtonGroup', RaysRadioButtonGroup );
export default RaysRadioButtonGroup;