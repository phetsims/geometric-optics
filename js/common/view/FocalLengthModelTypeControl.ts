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
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Property from '../../../../axon/js/Property.js';

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
      align: 'left'
    }, providedOptions );

    super( options );

    const labelText = new Text( geometricOpticsStrings.focalLengthControl, {
      font: GOConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'labelText' ),
      phetioVisiblePropertyInstrumented: false
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

geometricOptics.register( 'FocalLengthModelTypeControl', FocalLengthModelTypeControl );