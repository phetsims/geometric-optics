// Copyright 2021-2023, University of Colorado Boulder

/**
 * GOPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So GOPreferencesNode and its
 * subcomponents must implement dispose.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FocalLengthModelTypeControl from './FocalLengthModelTypeControl.js';
import GOPreferences from '../model/GOPreferences.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { GOSimOptions } from '../../GOSim.js';
import Add2FPointsCheckbox from './Add2FPointsCheckbox.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type GOPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class GOPreferencesNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeGeometricOpticsPreferencesNode: () => void;

  public constructor( providedOptions: GOPreferencesNodeOptions ) {

    const options = optionize<GOPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 20,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    // 'Add "2F Points" checkbox' checkbox
    // The name should technically be add2FPointsCheckboxCheckbox, but that confused everyone who saw it.
    const add2FPointsCheckbox = new Add2FPointsCheckbox( GOPreferences.add2FPointsCheckboxProperty, {
      tandem: options.tandem.createTandem( 'add2FPointsCheckbox' )
    } );

    // 'Focal Length control' radio buttons
    const focalLengthModelTypeControl = new FocalLengthModelTypeControl( GOPreferences.focalLengthModelTypeProperty, {
      tandem: options.tandem.createTandem( 'focalLengthModelTypeControl' )
    } );

    this.children = [ add2FPointsCheckbox, focalLengthModelTypeControl ];

    this.disposeGeometricOpticsPreferencesNode = (): void => {
      add2FPointsCheckbox.dispose();
      focalLengthModelTypeControl.dispose();
    };
  }

  public override dispose(): void {
    this.disposeGeometricOpticsPreferencesNode();
    super.dispose();
  }
}

geometricOptics.register( 'GOPreferencesNode', GOPreferencesNode );