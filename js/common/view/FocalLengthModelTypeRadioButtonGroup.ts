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
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import { FocalLengthModelType } from '../model/FocalLengthModelType.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';

type SelfOptions = EmptySelfOptions;

type FocalLengthControlRadioButtonGroupOptions = SelfOptions & PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

export default class FocalLengthModelTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthModelType> {

  /**
   * @param focalLengthModelTypeProperty - whether to set focal length directly or indirectl
   * @param providedOptions
   */
  public constructor( focalLengthModelTypeProperty: Property<FocalLengthModelType>,
                      providedOptions: FocalLengthControlRadioButtonGroupOptions ) {

    const options = optionize<FocalLengthControlRadioButtonGroupOptions, SelfOptions, VerticalAquaRadioButtonGroupOptions>()( {

      // VerticalAquaRadioButtonGroupOptions
      spacing: 8,
      phetioVisiblePropertyInstrumented: false,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      }
    }, providedOptions );

    const items = [
      createItem( 'direct', GeometricOpticsStrings.radioButton.directStringProperty, options.tandem, 'directRadioButton' ),
      createItem( 'indirect', GeometricOpticsStrings.radioButton.indirectStringProperty, options.tandem, 'indirectRadioButton' )
    ];

    super( focalLengthModelTypeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value - value associated with the radio button
 * @param labelStringProperty - label that appears on the radio button
 * @param groupTandem - used to associate the item's tandem with the radio-button group
 * @param itemTandemName - used to create the item's tandem
 */
function createItem( value: FocalLengthModelType,
                     labelStringProperty: TReadOnlyProperty<string>,
                     groupTandem: Tandem,
                     itemTandemName: string ): AquaRadioButtonGroupItem<FocalLengthModelType> {
  return {
    value: value,
    createNode: tandem => new Text( labelStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500,
      tandem: tandem.createTandem( 'labelText' )
    } ),
    tandemName: itemTandemName
  };
}

geometricOptics.register( 'FocalLengthModelTypeRadioButtonGroup', FocalLengthModelTypeRadioButtonGroup );