// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsOptionsDialogContent is the content for the options dialog, accessed via the Options menu item
 * in the PhET menu.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import merge from '../../../../phet-core/js/merge.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class GeometricOpticsOptionsDialogContent extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // Projector Mode checkbox
    const projectorModeCheckbox = new ProjectorModeCheckbox( {
      boxWidth: 14,
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxTextWidth: 350,
      tandem: options.tandem.createTandem( 'projectorModeCheckbox' )
    } );

    assert && assert( !options.children, 'GasPropertiesGlobalOptionsNode sets children' );
    options.children = [ projectorModeCheckbox ];

    super( options );

    // @private
    this.disposeGeometricOpticsOptionsDialogContent = () => {
      projectorModeCheckbox.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeGeometricOpticsOptionsDialogContent();
    super.dispose();
  }
}

geometricOptics.register( 'GeometricOpticsOptionsDialogContent', GeometricOpticsOptionsDialogContent );
export default GeometricOpticsOptionsDialogContent;