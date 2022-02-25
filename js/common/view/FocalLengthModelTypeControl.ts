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
import { PickRequired } from '../PickRequired.js';
import { PickOptional } from '../PickOptional.js';

type FocalLengthModelControlOptions = PickRequired<VBoxOptions, 'tandem'> & PickOptional<VBoxOptions, 'visible'>;

class FocalLengthModelTypeControl extends VBox {

  private readonly disposeFocalLengthModelControl: () => void;

  /**
   * @param focalLengthModelTypeProperty
   * @param providedOptions
   */
  constructor( focalLengthModelTypeProperty: Property<FocalLengthModelType>, providedOptions: FocalLengthModelControlOptions ) {

    const options = optionize<FocalLengthModelControlOptions, {}, VBoxOptions>( {
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

    this.disposeFocalLengthModelControl = (): void => {
      labelNode.dispose();
      radioButtonGroup.dispose();
    };
  }

  public dispose(): void {
    super.dispose();
    this.disposeFocalLengthModelControl();
  }
}

geometricOptics.register( 'FocalLengthModelTypeControl', FocalLengthModelTypeControl );
export default FocalLengthModelTypeControl;