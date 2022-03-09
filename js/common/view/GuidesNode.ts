// Copyright 2021-2022, University of Colorado Boulder

/**
 * GuidesNode is a pair of guides, at the top and bottom of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { IColor, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GuideNode from './GuideNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Guides from '../model/Guides.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type GuidesNodeOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>
  & PickOptional<NodeOptions, 'phetioDocumentation'>;

class GuidesNode extends Node {

  /**
   * @param guides
   * @param armColor
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( guides: Guides, armColor: IColor,
               modelViewTransform: ModelViewTransform2, providedOptions: GuidesNodeOptions ) {
    super( optionize<GuidesNodeOptions, {}, NodeOptions>( {

      // NodeOptions
      children: [
        new GuideNode( guides.topGuide, armColor, modelViewTransform, {
          tandem: providedOptions.tandem.createTandem( 'topGuideNode' )
        } ),
        new GuideNode( guides.bottomGuide, armColor, modelViewTransform, {
          tandem: providedOptions.tandem.createTandem( 'bottomGuideNode' )
        } )
      ]
    }, providedOptions ) );
  }
}

geometricOptics.register( 'GuidesNode', GuidesNode );
export default GuidesNode;