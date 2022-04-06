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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IProperty from '../../../../axon/js/IProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {};

type FocalLengthControlRadioButtonGroupOptions = SelfOptions & PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

export default class FocalLengthModelTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthModelType> {

  /**
   * @param focalLengthModelTypeProperty
   * @param providedOptions
   */
  constructor( focalLengthModelTypeProperty: IProperty<FocalLengthModelType>,
               providedOptions: FocalLengthControlRadioButtonGroupOptions ) {

    const options = optionize<FocalLengthControlRadioButtonGroupOptions, SelfOptions, VerticalAquaRadioButtonGroupOptions>( {

      // VerticalAquaRadioButtonGroupOptions
      spacing: 8,
      phetioVisiblePropertyInstrumented: false,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      }
    }, providedOptions );

    const items = [
      createItem( 'direct', geometricOpticsStrings.radioButton.direct, options.tandem, 'directRadioButton' ),
      createItem( 'indirect', geometricOpticsStrings.radioButton.indirect, options.tandem, 'indirectRadioButton' )
    ];

    super( focalLengthModelTypeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value
 * @param text
 * @param groupTandem
 * @param itemTandemName
 */
function createItem( value: FocalLengthModelType, text: string, groupTandem: Tandem, itemTandemName: string ):
  AquaRadioButtonGroupItem<FocalLengthModelType> {
  return {
    value: value,
    node: new Text( text, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 300,
      tandem: groupTandem.createTandem( itemTandemName ).createTandem( 'labelText' ),
      phetioVisiblePropertyInstrumented: false
    } ),
    tandemName: itemTandemName
  };
}

geometricOptics.register( 'FocalLengthModelTypeRadioButtonGroup', FocalLengthModelTypeRadioButtonGroup );