// Copyright 2022, University of Colorado Boulder

/**
 * Add2FPointsCheckbox is the "Add 2F Points checkbox" checkbox that appears in the Options dialog.
 * The name should technically be Add2FPointsCheckboxCheckbox, but that confused everyone who saw it.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';

type Add2FPointsCheckboxOptions = PickRequired<CheckboxOptions, 'tandem'>;

class Add2FPointsCheckbox extends Checkbox {

  private readonly disposeAdd2FPointsCheckbox: () => void;

  /**
   * @param add2FPointsCheckboxProperty
   * @param providedOptions
   */
  constructor( add2FPointsCheckboxProperty: Property<boolean>, providedOptions: Add2FPointsCheckboxOptions ) {

    const options = optionize<Add2FPointsCheckboxOptions, {}, CheckboxOptions>( {
      boxWidth: GOConstants.CHECKBOX_BOX_WIDTH
    }, providedOptions );

    const labelNode = new Text( geometricOpticsStrings.checkbox.add2FPointsCheckbox, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 250,
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    super( labelNode, add2FPointsCheckboxProperty, options );

    this.disposeAdd2FPointsCheckbox = () => {
      labelNode.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeAdd2FPointsCheckbox();
  }
}

geometricOptics.register( 'Add2FPointsCheckbox', Add2FPointsCheckbox );
export default Add2FPointsCheckbox;