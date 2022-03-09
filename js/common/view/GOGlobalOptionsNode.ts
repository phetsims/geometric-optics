// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOGlobalOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FocalLengthModelTypeControl from './FocalLengthModelTypeControl.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Enable2FCheckbox from './Enable2FCheckbox.js';

type SelfOptions = {
  isBasicsVersion?: boolean;
}

type GOGlobalOptionsNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class GOGlobalOptionsNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeGeometricOpticsGlobalOptionsNode: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GOGlobalOptionsNodeOptions ) {

    const options = optionize<GOGlobalOptionsNodeOptions, SelfOptions, VBoxOptions>( {

      // SelfOptions
      isBasicsVersion: false,

      // VBoxOptions
      align: 'left',
      spacing: 20
    }, providedOptions );

    super( options );

    // Projector Mode checkbox
    const projectorModeCheckbox = new ProjectorModeCheckbox( {
      boxWidth: GOConstants.CHECKBOX_BOX_WIDTH,
      font: GOConstants.CONTROL_FONT,
      maxTextWidth: 350,
      tandem: options.tandem.createTandem( 'projectorModeCheckbox' )
    } );

    // Enable 2F points
    const enable2FCheckbox = new Enable2FCheckbox( GOGlobalOptions.enable2FProperty, {
      boxWidth: GOConstants.CHECKBOX_BOX_WIDTH,
      tandem: options.tandem.createTandem( 'enable2FCheckbox' )
    } );

    // Focal Length model type
    const focalLengthModelControl = new FocalLengthModelTypeControl( GOGlobalOptions.focalLengthModelTypeProperty, {
      visible: !options.isBasicsVersion,
      tandem: options.tandem.createTandem( 'focalLengthModelControl' )
    } );

    this.children = [ projectorModeCheckbox, enable2FCheckbox, focalLengthModelControl ];

    this.disposeGeometricOpticsGlobalOptionsNode = (): void => {
      projectorModeCheckbox.dispose();
      focalLengthModelControl.dispose();
    };
  }

  /**
   * @override
   */
  public dispose(): void {
    this.disposeGeometricOpticsGlobalOptionsNode();
    super.dispose();
  }
}

geometricOptics.register( 'GOGlobalOptionsNode', GOGlobalOptionsNode );
export default GOGlobalOptionsNode;