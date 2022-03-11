// Copyright 2022, University of Colorado Boulder

/**
 * Enabled2FCheckbox is the check box used to enable the '2F' feature in the Options dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';

type Enable2FCheckboxOptions = PickRequired<CheckboxOptions, 'boxWidth' | 'tandem'>;

class Enabled2FCheckbox extends Checkbox {

  private readonly disposeEnable2FCheckbox: () => void;

  /**
   * @param enabled2FProperty
   * @param providedOptions
   */
  constructor( enabled2FProperty: Property<boolean>, providedOptions: Enable2FCheckboxOptions ) {

    const labelNode = new Text( geometricOpticsStrings.checkbox.show2FPointsCheckbox, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 250,
      tandem: providedOptions.tandem.createTandem( 'labelNode' )
    } );

    super( labelNode, enabled2FProperty, providedOptions );

    this.disposeEnable2FCheckbox = (): void => {
      labelNode.dispose();
    };
  }

  public dispose(): void {
    super.dispose();
    this.disposeEnable2FCheckbox();
  }
}

geometricOptics.register( 'Enabled2FCheckbox', Enabled2FCheckbox );
export default Enabled2FCheckbox;