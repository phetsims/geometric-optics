// Copyright 2022-2023, University of Colorado Boulder

/**
 * FocalLengthModelTypeControl is the control used to choose the focal-length model type, 'direct' or 'indirect'
 * in the Preferences dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import geometricOptics from '../../geometricOptics.js';
import { FocalLengthModelType } from '../model/FocalLengthModelType.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Property from '../../../../axon/js/Property.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type FocalLengthModelTypeOptions = SelfOptions &
  PickRequired<VBoxOptions, 'tandem'> &
  PickOptional<VBoxOptions, 'visible'>;

export default class FocalLengthModelTypeControl extends VBox {

  private readonly disposeFocalLengthModelTypeControl: () => void;

  /**
   * @param focalLengthModelTypeProperty - whether to set focal length directly or indirectly
   * @param providedOptions
   */
  public constructor( focalLengthModelTypeProperty: Property<FocalLengthModelType>, providedOptions: FocalLengthModelTypeOptions ) {

    const options = optionize<FocalLengthModelTypeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: 8,
      align: 'left',
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( options );

    const labelText = new Text( GeometricOpticsStrings.focalLengthControlStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const radioButtonGroup = new FocalLengthModelTypeRadioButtonGroup( focalLengthModelTypeProperty, {
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    this.children = [ labelText, radioButtonGroup ];

    this.addLinkedElement( focalLengthModelTypeProperty, {
      tandem: options.tandem.createTandem( focalLengthModelTypeProperty.tandem.name )
    } );

    this.disposeFocalLengthModelTypeControl = (): void => {
      labelText.dispose();
      radioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeFocalLengthModelTypeControl();
  }
}

/**
 * FocalLengthModelTypeRadioButtonGroup is the radio button group associated with this control.
 */

type FocalLengthModelTypeRadioButtonGroupSelfOptions = EmptySelfOptions;

type FocalLengthControlRadioButtonGroupOptions = SelfOptions & PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

class FocalLengthModelTypeRadioButtonGroup extends VerticalAquaRadioButtonGroup<FocalLengthModelType> {

  /**
   * @param focalLengthModelTypeProperty - whether to set focal length directly or indirectl
   * @param providedOptions
   */
  public constructor( focalLengthModelTypeProperty: Property<FocalLengthModelType>,
                      providedOptions: FocalLengthControlRadioButtonGroupOptions ) {

    const options = optionize<FocalLengthControlRadioButtonGroupOptions, FocalLengthModelTypeRadioButtonGroupSelfOptions, VerticalAquaRadioButtonGroupOptions>()( {

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

geometricOptics.register( 'FocalLengthModelTypeControl', FocalLengthModelTypeControl );