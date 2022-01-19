// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOGlobalOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import merge from '../../../../phet-core/js/merge.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import FocalLengthControlRadioButtonGroup from './FocalLengthControlRadioButtonGroup.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

type GOGlobalOptionsNodeOptions = {
  tandem: Tandem
};

class GOGlobalOptionsNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeGeometricOpticsGlobalOptionsNode: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GOGlobalOptionsNodeOptions ) {

    // Projector Mode checkbox
    const projectorModeCheckbox = new ProjectorModeCheckbox( {
      boxWidth: 14,
      font: GOConstants.CONTROL_FONT,
      maxTextWidth: 350,
      tandem: providedOptions.tandem.createTandem( 'projectorModeCheckbox' )
    } );

    const focalLengthControlText = new Text( geometricOpticsStrings.focalLengthControl, {
      font: GOConstants.CONTROL_FONT,
      tandem: providedOptions.tandem.createTandem( 'focalLengthControlText' )
    } );

    const focalLengthControlRadioButtonGroup = new FocalLengthControlRadioButtonGroup( {
      tandem: providedOptions.tandem.createTandem( 'focalLengthControlRadioButtonGroup' )
    } );

    const focalLengthControlVBox = new VBox( {
      children: [ focalLengthControlText, focalLengthControlRadioButtonGroup ],
      spacing: 8,
      align: 'left'
    } );

    super( merge( {

      // VBox options
      align: 'left',
      spacing: 20,
      children: [ projectorModeCheckbox, focalLengthControlVBox ]
    }, providedOptions ) );

    this.disposeGeometricOpticsGlobalOptionsNode = (): void => {
      projectorModeCheckbox.dispose();
      focalLengthControlText.dispose();
      focalLengthControlRadioButtonGroup.dispose();
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