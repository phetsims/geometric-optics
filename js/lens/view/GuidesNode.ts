// Copyright 2021, University of Colorado Boulder

/**
 * GuidesNode is a pair of guides, at the top and bottom of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from '../model/Guide.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GuideNode from './GuideNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import merge from '../../../../phet-core/js/merge.js';
import IProperty from '../../../../axon/js/IProperty.js';

type Options = {
  visibleProperty: IProperty<boolean>,
  tandem: Tandem,
  phetioDocumentation: string
};

class GuidesNode extends Node {

  /**
   * @param topGuide
   * @param bottomGuide
   * @param modelViewTransform
   * @param options
   */
  constructor( topGuide: Guide, bottomGuide: Guide, modelViewTransform: ModelViewTransform2, options: Options ) {
    super( merge( {
      children: [
        new GuideNode( topGuide, modelViewTransform ),
        new GuideNode( bottomGuide, modelViewTransform )
      ]
    }, options ) );
  }
}

geometricOptics.register( 'GuidesNode', GuidesNode );
export default GuidesNode;