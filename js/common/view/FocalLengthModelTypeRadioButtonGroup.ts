// Copyright 2021-2022, University of Colorado Boulder

/**
 * FocalLengthModelTypeRadioButtonGroup is the radio button group that allows the user to select the method of
 * controlling focal length. It appears in the Options dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text } from '../../../../scenery/js/imports.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import { FocalLengthModelType } from '../model/FocalLengthModelType.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type FocalLengthControlRadioButtonGroupOptions = PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

class FocalLengthModelTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthModelType> {

  /**
   * @param focalLengthModelTypeProperty
   * @param providedOptions
   */
  constructor( focalLengthModelTypeProperty: Property<FocalLengthModelType>,
               providedOptions: FocalLengthControlRadioButtonGroupOptions ) {

    const options = optionize<FocalLengthControlRadioButtonGroupOptions, {}, VerticalAquaRadioButtonGroupOptions>( {

      // VerticalAquaRadioButtonGroupOptions
      spacing: 8
    }, providedOptions );

    const items = [
      createItem( 'direct', geometricOpticsStrings.radioButton.direct ),
      createItem( 'indirect', geometricOpticsStrings.radioButton.indirect )
    ];

    super( focalLengthModelTypeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value
 * @param text
 */
function createItem( value: FocalLengthModelType, text: string ): AquaRadioButtonGroupItem<FocalLengthModelType> {
  return {
    value: value,
    node: new Text( text, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 300
    } ),
    tandemName: `${value}RadioButton`
  };
}

geometricOptics.register( 'FocalLengthModelTypeRadioButtonGroup', FocalLengthModelTypeRadioButtonGroup );
export default FocalLengthModelTypeRadioButtonGroup;