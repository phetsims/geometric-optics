// Copyright 2021-2025, University of Colorado Boulder

/**
 * GuidesNode is a pair of guides, at the top and bottom of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import geometricOptics from '../../geometricOptics.js';
import Guides from '../model/Guides.js';
import GuideNode from './GuideNode.js';

type SelfOptions = EmptySelfOptions;

type GuidesNodeOptions = SelfOptions &
  PickRequired<NodeOptions, 'visibleProperty' | 'tandem'> &
  PickOptional<NodeOptions, 'phetioDocumentation'>;

export default class GuidesNode extends Node {

  public constructor( guides: Guides, armColor: TColor,
                      modelViewTransform: ModelViewTransform2, providedOptions: GuidesNodeOptions ) {
    super( optionize<GuidesNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [
        new GuideNode( guides.topGuide, armColor, modelViewTransform ),
        new GuideNode( guides.bottomGuide, armColor, modelViewTransform )
      ]
    }, providedOptions ) );
  }
}

geometricOptics.register( 'GuidesNode', GuidesNode );