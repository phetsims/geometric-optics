// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImageNode is the view base class for all optical images.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import OpticalImage from '../model/OpticalImage.js';

export type OpticalImageNodeOptions = PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

class OpticalImageNode extends Node {

  /**
   * @param opticalImage
   * @param providedOptions
   */
  protected constructor( opticalImage: OpticalImage, providedOptions: OpticalImageNodeOptions ) {

    super( providedOptions );

    this.addLinkedElement( opticalImage, {
      tandem: providedOptions.tandem.createTandem( opticalImage.tandem.name )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalImageNode', OpticalImageNode );
export default OpticalImageNode;