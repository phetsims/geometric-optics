// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthModelTypeControl is the control used to choose the focal-length model type, 'direct' or 'indirect'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import FocalLengthModelTypeRadioButtonGroup from './FocalLengthModelTypeRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import { FocalLengthModelType } from '../model/FocalLengthModelType.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type FocalLengthModelTypeOptions = PickRequired<VBoxOptions, 'tandem'> & PickOptional<VBoxOptions, 'visible'>;

class FocalLengthModelTypeControl extends VBox {

  private readonly disposeFocalLengthModelTypeControl: () => void;

  /**
   * @param focalLengthModelTypeProperty
   * @param providedOptions
   */
  constructor( focalLengthModelTypeProperty: Property<FocalLengthModelType>, providedOptions: FocalLengthModelTypeOptions ) {

    const options = optionize<FocalLengthModelTypeOptions, {}, VBoxOptions>( {

      // VBoxOptions
      spacing: 8,
      align: 'left'
    }, providedOptions );

    super( options );

    const labelNode = new Text( geometricOpticsStrings.focalLengthControl, {
      font: GOConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const radioButtonGroup = new FocalLengthModelTypeRadioButtonGroup( focalLengthModelTypeProperty, {
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    this.children = [ labelNode, radioButtonGroup ];

    this.disposeFocalLengthModelTypeControl = (): void => {
      labelNode.dispose();
      radioButtonGroup.dispose();
    };
  }

  public dispose(): void {
    super.dispose();
    this.disposeFocalLengthModelTypeControl();
  }
}

geometricOptics.register( 'FocalLengthModelTypeControl', FocalLengthModelTypeControl );
export default FocalLengthModelTypeControl;