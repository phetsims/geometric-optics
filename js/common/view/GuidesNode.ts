// Copyright 2021-2022, University of Colorado Boulder

/**
 * GuidesNode is a pair of guides, at the top and bottom of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GuideNode from './GuideNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import merge from '../../../../phet-core/js/merge.js';
import IProperty from '../../../../axon/js/IProperty.js';
import Guides from '../model/Guides.js';
import { PickOptional, PickRequired } from '../GOTypes.js';

type GuidesNodeOptions = {
  visibleProperty: IProperty<boolean>
} & PickRequired<NodeOptions, 'tandem'> & PickOptional<NodeOptions, 'phetioDocumentation'>;

class GuidesNode extends Node {

  /**
   * @param guides
   * @param armColor
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( guides: Guides, armColor: ColorDef,
               modelViewTransform: ModelViewTransform2, providedOptions: GuidesNodeOptions ) {
    super( merge( {
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