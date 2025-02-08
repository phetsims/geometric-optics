// Copyright 2022-2025, University of Colorado Boulder

/**
 * VirtualLightRaysNode renders virtual light rays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import geometricOptics from '../../geometricOptics.js';
import GOQueryParameters from '../GOQueryParameters.js';
import LightRays from '../model/LightRays.js';
import LightRaysNode, { LightRaysNodeOptions } from './LightRaysNode.js';

type SelfOptions = {
  stroke: TColor;
};

type VirtualRealLightRaysNodeOptions = SelfOptions & LightRaysNodeOptions;

export default class VirtualLightRaysNode extends LightRaysNode {

  public constructor( lightRays: LightRays,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: VirtualRealLightRaysNodeOptions ) {

    const update = ( thisNode: Node ) => {
      thisNode.children = LightRaysNode.segmentsToLines( lightRays.virtualSegments, modelViewTransform, {
        stroke: providedOptions.stroke,
        lineWidth: GOQueryParameters.virtualRaysLineWidth,
        lineDash: [ 3, 3 ],
        opacity: 0.5
      } );
    };

    super( lightRays, update, providedOptions );
  }
}

geometricOptics.register( 'VirtualLightRaysNode', VirtualLightRaysNode );