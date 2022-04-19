// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * The Options dialog is created on demand by joist, using a PhetioCapsule. So GOOptionsNode must
 * implement dispose, and all elements of GOOptionsNode that have tandems must be disposed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import optionize from '../../../../phet-core/js/optionize.js';
import FocalLengthModelTypeControl from './FocalLengthModelTypeControl.js';
import GOOptions from '../GOOptions.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { GOSimOptions } from '../../GOSim.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Add2FPointsCheckbox from './Add2FPointsCheckbox.js';

type SelfOptions = PickOptional<GOSimOptions, 'isBasicsVersion'>;

type GOGlobalOptionsNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class GOOptionsNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeGeometricOpticsGlobalOptionsNode: () => void;

  constructor( providedOptions: GOGlobalOptionsNodeOptions ) {

    const options = optionize<GOGlobalOptionsNodeOptions, SelfOptions, VBoxOptions>()( {

      // SelfOptions
      isBasicsVersion: false,

      // VBoxOptions
      align: 'left',
      spacing: 20,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    // 'Add "2F Points" checkbox' checkbox
    // The name should technically be add2FPointsCheckboxCheckbox, but that confused everyone who saw it.
    const add2FPointsCheckbox = new Add2FPointsCheckbox( GOOptions.add2FPointsCheckboxProperty, {
      tandem: options.tandem.createTandem( 'add2FPointsCheckbox' )
    } );

    // 'Focal Length control' radio buttons
    const focalLengthModelControl = new FocalLengthModelTypeControl( GOOptions.focalLengthModelTypeProperty, {
      visible: !options.isBasicsVersion,
      tandem: options.tandem.createTandem( 'focalLengthModelControl' )
    } );

    this.children = [ add2FPointsCheckbox, focalLengthModelControl ];

    this.disposeGeometricOpticsGlobalOptionsNode = (): void => {
      add2FPointsCheckbox.dispose();
      focalLengthModelControl.dispose();
    };
  }

  public override dispose(): void {
    this.disposeGeometricOpticsGlobalOptionsNode();
    super.dispose();
  }
}

geometricOptics.register( 'GOOptionsNode', GOOptionsNode );