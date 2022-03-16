// Copyright 2022, University of Colorado Boulder

/**
 * VirtualLightRaysNode renders virtual light rays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import geometricOptics from '../../geometricOptics.js';
import { IColor, Node } from '../../../../scenery/js/imports.js';
import LightRays from '../model/LightRays.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LightRaysNode, { LightRaysNodeOptions } from './LightRaysNode.js';

type SelfOptions = {
  stroke: IColor;
};

type VirtualRealLightRaysNodeOptions = SelfOptions & LightRaysNodeOptions;

class VirtualLightRaysNode extends LightRaysNode {

  /**
   * @param lightRays
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               modelViewTransform: ModelViewTransform2,
               providedOptions: VirtualRealLightRaysNodeOptions ) {

    const update = ( thisNode: Node ) => {
      thisNode.children = LightRaysNode.segmentsToLines( lightRays.virtualSegments, modelViewTransform, {
        stroke: providedOptions.stroke,
        lineWidth: 2,
        lineDash: [ 3, 3 ],
        opacity: 0.5
      } );
    };

    super( lightRays, update, providedOptions );
  }
}

geometricOptics.register( 'VirtualLightRaysNode', VirtualLightRaysNode );
export default VirtualLightRaysNode;