// Copyright 2021, University of Colorado Boulder

/**
 * FocalLengthControlRadioButtonGroup is the radio button group that allows the user to select the method of
 * controlling focal length. It appears in the PhET > Options dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import FocalLengthControlEnum from '../model/FocalLengthControlEnum.js';

type Options = {
  tandem: Tandem
};

class FocalLengthControlRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthControlEnum> {

  /**
   * @param options
   */
  constructor( options: Options ) {

    const items = [
      createItem( 'indirect', geometricOpticsStrings.indirect ),
      createItem( 'direct', geometricOpticsStrings.direct )
    ];

    super( GOGlobalOptions.focalLengthControlProperty, items, merge( {
      spacing: 8
    }, options ) );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value
 * @param text
 */
function createItem( value: FocalLengthControlEnum, text: string ): AquaRadioButtonGroupItem<FocalLengthControlEnum> {
  return {
    value: value,
    node: new Text( text, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 300
    } ),
    tandemName: `${value}RadioButton`
  };
}

geometricOptics.register( 'FocalLengthControlRadioButtonGroup', FocalLengthControlRadioButtonGroup );
export default FocalLengthControlRadioButtonGroup;