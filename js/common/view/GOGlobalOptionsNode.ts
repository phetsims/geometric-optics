// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOGlobalOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FocalLengthModelTypeControl from './FocalLengthModelTypeControl.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

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

    // 'Projector Mode' checkbox
    const projectorModeCheckbox = new ProjectorModeCheckbox( {
      boxWidth: GOConstants.CHECKBOX_BOX_WIDTH,
      font: GOConstants.CONTROL_FONT,
      maxTextWidth: 350,
      tandem: options.tandem.createTandem( 'projectorModeCheckbox' )
    } );

    // 'Add "2F Points" checkbox to control panels' checkbox
    // The name should technically be add2FPointsCheckboxCheckbox, but that confused everyone who saw it.
    const add2FPointsCheckbox = new Checkbox( new Text( geometricOpticsStrings.checkbox.add2FPointsCheckbox, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 250,
      tandem: providedOptions.tandem.createTandem( 'labelNode' )
    } ), GOGlobalOptions.add2FPointsCheckboxProperty, {
      boxWidth: GOConstants.CHECKBOX_BOX_WIDTH,
      tandem: options.tandem.createTandem( 'add2FCheckbox' )
    } );

    // 'Focal Length control' radio buttons
    const focalLengthModelControl = new FocalLengthModelTypeControl( GOGlobalOptions.focalLengthModelTypeProperty, {
      visible: !options.isBasicsVersion,
      tandem: options.tandem.createTandem( 'focalLengthModelControl' )
    } );

    this.children = [ projectorModeCheckbox, add2FPointsCheckbox, focalLengthModelControl ];

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