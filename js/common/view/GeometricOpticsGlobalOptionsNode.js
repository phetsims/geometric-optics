// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsGlobalOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsGlobalOptions from '../GeometricOpticsGlobalOptions.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';

class GeometricOpticsGlobalOptionsNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

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

    // Focal Length control... radio buttons
    const focalLengthControlNode = new FocalLengthControlNode( {
      tandem: options.tandem.createTandem( 'focalLengthControlNode' )
    } );

    assert && assert( !options.children, 'GasPropertiesGlobalOptionsNode sets children' );
    options.children = [ projectorModeCheckbox, focalLengthControlNode ];

    super( options );
  }
}

class FocalLengthControlNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // VBox options
      spacing: 8,
      align: 'left',

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const focalLengthControlText = new Text( geometricOpticsStrings.focalLengthControl.label, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'focalLengthControlText' )
    } );

    // We're using string values here because QueryStringMachine does not support enumerations.
    const radioButtonItems = [
      {
        value: 'direct',
        node: new Text( geometricOpticsStrings.focalLengthControl.direct, {
          font: GeometricOpticsConstants.CONTROL_FONT
        } ),
        tandemName: 'directItem'
      },
      {
        value: 'indirect',
        node: new Text( geometricOpticsStrings.focalLengthControl.indirect, {
          font: GeometricOpticsConstants.CONTROL_FONT
        } ),
        tandemName: 'indirectItem'
      }
    ];

    // Verify that all of the values for ?focalLengthControl are represented here.
    assert && assert( GeometricOpticsQueryParameters.SCHEMA.focalLengthControl.validValues.length === radioButtonItems.length );
    assert && assert( _.every( radioButtonItems.length, radioButtonItem =>
      GeometricOpticsQueryParameters.SCHEMA.focalLengthControl.validValues.includes( radioButtonItem ) ) );

    const radioButtonGroup = new VerticalAquaRadioButtonGroup(
      GeometricOpticsGlobalOptions.focalLengthControlProperty, radioButtonItems, {
        spacing: 8
      } );

    assert && assert( !options.children );
    options.children = [ focalLengthControlText, radioButtonGroup ];

    super( options );
  }
}

geometricOptics.register( 'GeometricOpticsGlobalOptionsNode', GeometricOpticsGlobalOptionsNode );
export default GeometricOpticsGlobalOptionsNode;