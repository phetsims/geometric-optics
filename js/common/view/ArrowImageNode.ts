// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImageNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowImage from '../model/ArrowImage.js';

type ArrowImageNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class ArrowImageNode extends Node {

  /**
   * @param arrowImage
   * @param virtualImageVisibleProperty
   * @param raysAndImagesVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( arrowImage: ArrowImage,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               raysAndImagesVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: ArrowImageNodeOptions ) {

    const options = merge( {}, providedOptions );

    super( options );
  }
}

geometricOptics.register( 'ArrowImageNode', ArrowImageNode );
export default ArrowImageNode;