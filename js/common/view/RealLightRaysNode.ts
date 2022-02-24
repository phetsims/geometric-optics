// Copyright 2022, University of Colorado Boulder

/**
 * RealLightRaysNode renders real light rays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { ColorDef, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import LightRays from '../model/LightRays.js';
import LightRaysNode, { LightRaysNodeOptions } from './LightRaysNode.js';

type SelfOptions = {
  stroke: ColorDef
};

type RealLightRaysNodeOptions = SelfOptions & LightRaysNodeOptions;

class RealLightRaysNode extends LightRaysNode {

  /**
   * @param lightRays
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               modelViewTransform: ModelViewTransform2,
               providedOptions: RealLightRaysNodeOptions ) {

    const update = ( thisNode: Node ) => {
      thisNode.children = LightRaysNode.segmentsToLines( lightRays.realSegments, modelViewTransform, {
        stroke: providedOptions.stroke,
        lineWidth: 2
      } );
    };

    super( lightRays, update, providedOptions );
  }
}

geometricOptics.register( 'RealLightRaysNode', RealLightRaysNode );
export default RealLightRaysNode;
export type { RealLightRaysNodeOptions };