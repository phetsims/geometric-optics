// Copyright 2022, University of Colorado Boulder

/**
 * RealLightRaysNode renders real light rays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { TColor, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import LightRays from '../model/LightRays.js';
import LightRaysNode, { LightRaysNodeOptions } from './LightRaysNode.js';
import GOQueryParameters from '../GOQueryParameters.js';

type SelfOptions = {
  stroke: TColor;
};

export type RealLightRaysNodeOptions = SelfOptions & LightRaysNodeOptions;

export default class RealLightRaysNode extends LightRaysNode {

  public constructor( lightRays: LightRays,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: RealLightRaysNodeOptions ) {

    const update = ( thisNode: Node ) => {
      thisNode.children = LightRaysNode.segmentsToLines( lightRays.realSegments, modelViewTransform, {
        stroke: providedOptions.stroke,
        lineWidth: GOQueryParameters.realRaysLineWidth
      } );
    };

    super( lightRays, update, providedOptions );
  }
}

geometricOptics.register( 'RealLightRaysNode', RealLightRaysNode );