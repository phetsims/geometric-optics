// Copyright 2022, University of Colorado Boulder

/**
 * Add2FPointsCheckbox is the "Add 2F Points checkbox" checkbox that appears in the Preferences dialog.
 * The name should technically be Add2FPointsCheckboxCheckbox, but that confused everyone who saw it.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';

type SelfOptions = EmptySelfOptions;

type Add2FPointsCheckboxOptions = SelfOptions & PickRequired<CheckboxOptions, 'tandem'>;

export default class Add2FPointsCheckbox extends Checkbox {

  private readonly disposeAdd2FPointsCheckbox: () => void;

  public constructor( add2FPointsCheckboxProperty: Property<boolean>, providedOptions: Add2FPointsCheckboxOptions ) {

    const options = optionize<Add2FPointsCheckboxOptions, SelfOptions, CheckboxOptions>()( {
      boxWidth: GOConstants.CHECKBOX_BOX_WIDTH
    }, providedOptions );

    const labelText = new Text( GeometricOpticsStrings.checkbox.add2FPointsCheckboxStringProperty, {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: 500,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    super( add2FPointsCheckboxProperty, labelText, options );

    this.disposeAdd2FPointsCheckbox = () => {
      labelText.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeAdd2FPointsCheckbox();
  }
}

geometricOptics.register( 'Add2FPointsCheckbox', Add2FPointsCheckbox );