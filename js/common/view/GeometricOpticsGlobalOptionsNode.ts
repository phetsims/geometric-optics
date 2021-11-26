// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsGlobalOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import merge from '../../../../phet-core/js/merge.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import FocalLengthControlRadioButtonGroup from './FocalLengthControlRadioButtonGroup.js';
import { Text } from '../../../../scenery/js/imports.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

class GeometricOpticsGlobalOptionsNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeGeometricOpticsGlobalOptionsNode: () => void;

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TYPESCRIPT any

    options = merge( {

      // VBox options
      align: 'left',
      spacing: 20,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Projector Mode checkbox
    const projectorModeCheckbox = new ProjectorModeCheckbox( {
      boxWidth: 14,
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxTextWidth: 350,
      tandem: options.tandem.createTandem( 'projectorModeCheckbox' )
    } );

    const focalLengthControlText = new Text( geometricOpticsStrings.focalLengthControl, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'focalLengthControlText' )
    } );

    const focalLengthControlRadioButtonGroup = new FocalLengthControlRadioButtonGroup( {
      tandem: options.tandem.createTandem( 'focalLengthControlRadioButtonGroup' )
    } );

    const focalLengthControlVBox = new VBox( {
      children: [ focalLengthControlText, focalLengthControlRadioButtonGroup ],
      spacing: 8,
      align: 'left'
    } );

    assert && assert( !options.children, 'GasPropertiesGlobalOptionsNode sets children' );
    options.children = [ projectorModeCheckbox, focalLengthControlVBox ];

    super( options );

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

geometricOptics.register( 'GeometricOpticsGlobalOptionsNode', GeometricOpticsGlobalOptionsNode );
export default GeometricOpticsGlobalOptionsNode;