// Copyright 2021, University of Colorado Boulder

/**
 * RaysRadioButtonGroup is the radio button group labeled 'Rays', for choosing a representation of rays.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import RaysModeEnum from '../model/RaysModeEnum.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';

type Options = {
  tandem: Tandem
};

class RaysRadioButtonGroup extends VerticalAquaRadioButtonGroup<RaysModeEnum> {

  /**
   * @param raysModeProperty
   * @param options
   */
  constructor( raysModeProperty: Property<RaysModeEnum>, options: Options ) {

    // items for ray Mode radio buttons
    const items = [
      createItem( 'marginal', geometricOpticsStrings.marginal ),
      createItem( 'principal', geometricOpticsStrings.principal ),
      createItem( 'many', geometricOpticsStrings.many ),
      createItem( 'none', geometricOpticsStrings.none )
    ];

    super( raysModeProperty, items, merge( {
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, options ) );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value
 * @param text
 */
function createItem( value: RaysModeEnum, text: string ): AquaRadioButtonGroupItem<RaysModeEnum> {
  return {
    value: value,
    node: new Text( text, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 100
    } ),
    tandemName: `${value}RadioButton`
  };
}

geometricOptics.register( 'RaysRadioButtonGroup', RaysRadioButtonGroup );
export default RaysRadioButtonGroup;