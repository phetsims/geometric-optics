// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthModelTypeControl is the control used to choose the focal-length model type, 'direct' or 'indirect'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import FocalLengthControlRadioButtonGroup from './FocalLengthControlRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import { FocalLengthControlType } from '../model/FocalLengthControlType.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { PickOptional, PickRequired } from '../GOTypes.js';
import Property from '../../../../axon/js/Property.js';

type FocalLengthModelControlOptions = PickRequired<VBoxOptions, 'tandem'> & PickOptional<VBoxOptions, 'visible'>;

class FocalLengthModelTypeControl extends VBox {

  private readonly disposeFocalLengthModelControl: () => void;

  /**
   * @param focalLengthControlTypeProperty
   * @param providedOptions
   */
  constructor( focalLengthControlTypeProperty: Property<FocalLengthControlType>, providedOptions: FocalLengthModelControlOptions ) {

    const options = optionize<FocalLengthModelControlOptions, {}, VBoxOptions>( {
      spacing: 8,
      align: 'left'
    }, providedOptions );

    super( options );

    const focalLengthControlText = new Text( geometricOpticsStrings.focalLengthControl, {
      font: GOConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'focalLengthControlText' )
    } );

    const focalLengthControlRadioButtonGroup = new FocalLengthControlRadioButtonGroup( focalLengthControlTypeProperty, {
      tandem: options.tandem.createTandem( 'focalLengthControlRadioButtonGroup' )
    } );

    this.children = [ focalLengthControlText, focalLengthControlRadioButtonGroup ];

    this.disposeFocalLengthModelControl = (): void => {
      focalLengthControlText.dispose();
      focalLengthControlRadioButtonGroup.dispose();
    };
  }

  public dispose(): void {
    super.dispose();
    this.disposeFocalLengthModelControl();
  }
}

geometricOptics.register( 'FocalLengthModelTypeControl', FocalLengthModelTypeControl );
export default FocalLengthModelTypeControl;