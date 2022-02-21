// Copyright 2021-2022, University of Colorado Boulder

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
import { FocalLengthControlType } from '../model/FocalLengthControlType.js';

type FocalLengthControlRadioButtonGroupOptions = {
  tandem: Tandem
};

class FocalLengthControlRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthControlType> {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: FocalLengthControlRadioButtonGroupOptions ) {

    const items = [
      createItem( 'direct', geometricOpticsStrings.direct ),
      createItem( 'indirect', geometricOpticsStrings.indirect )
    ];

    super( GOGlobalOptions.focalLengthControlTypeProperty, items, merge( {
      spacing: 8
    }, providedOptions ) );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value
 * @param text
 */
function createItem( value: FocalLengthControlType, text: string ): AquaRadioButtonGroupItem<FocalLengthControlType> {
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