// Copyright 2021, University of Colorado Boulder

/**
 * FocalLengthControlRadioButtonGroup is the radio button group that allows the user to select the method of
 * controlling focal length. It appears in the PhET > Options dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsGlobalOptions from '../GeometricOpticsGlobalOptions.js';
import FocalLengthControlEnum from '../model/FocalLengthControlEnum.js';

class FocalLengthControlRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthControlEnum> {
  constructor( options?: any ) { //TYPESCRIPT any

    options = merge( {
      spacing: 8,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const items = [
      createItem( 'direct', geometricOpticsStrings.direct ),
      createItem( 'indirect', geometricOpticsStrings.indirect )
    ];

    super( GeometricOpticsGlobalOptions.focalLengthControlProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param {FocalLengthControlEnum} value
 * @param {string} text
 * @returns {{value: FocalLengthControlEnum, node: Text, tandemName: string}} item
 */
function createItem( value: FocalLengthControlEnum, text: string ) {
  return {
    value: value,
    node: new Text( text, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxWidth: 300
    } ),
    tandemName: `${value}RadioButton`
  };
}

geometricOptics.register( 'FocalLengthControlRadioButtonGroup', FocalLengthControlRadioButtonGroup );
export default FocalLengthControlRadioButtonGroup;