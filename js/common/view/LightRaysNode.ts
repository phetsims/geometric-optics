// Copyright 2021-2022, University of Colorado Boulder

//TODO split into 2 nodes, RealLightRaysNode and VirtualLightRaysNode, don't include VirtualLightRaysNode in LightSourceSceneNode
/**
 * LightRaysNode is responsible for rendering a bundle of rays, as described by LightRays.
 * LightRays provides a set of line segments (start and end points), and LightRaysNode draws each segment
 * as a scenery.Line. Different styles are supported for real vs virtual rays.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { ColorDef, Line, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import { LightRaySegment } from '../model/LightRay.js';
import LightRays from '../model/LightRays.js';

type LineOptions = {
  stroke?: ColorDef,
  lineWidth?: number,
  lineDash?: number[],
  opacity?: number
};

type LightRaysNodeOptions = {
  isLightSource: boolean, // is the optical object a light source?
  realRaysStroke: ColorDef,
  virtualRaysStroke: ColorDef,
  visibleProperty?: IProperty<boolean>
};

class LightRaysNode extends Node {

  /**
   * @param lightRays
   * @param virtualImageVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: LightRaysNodeOptions ) {

    const realRaysNode = new Node();

    const virtualRaysNode = new Node( {

      // No virtual rays for light sources, see https://github.com/phetsims/geometric-optics/issues/216
      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty ],
        ( virtualImageVisible: boolean ) => virtualImageVisible && !providedOptions.isLightSource
      )
    } );

    const update = (): void => {

      realRaysNode.children = segmentsToLines( lightRays.realSegments, modelViewTransform, {
        stroke: providedOptions.realRaysStroke,
        lineWidth: 2
      } );

      virtualRaysNode.children = segmentsToLines( lightRays.virtualSegments, modelViewTransform, {
        stroke: providedOptions.virtualRaysStroke,
        lineWidth: 2,
        lineDash: [ 3, 3 ],
        opacity: 0.5
      } );
    };
    update();

    super( merge( {
      children: [ realRaysNode, virtualRaysNode ]
    }, providedOptions ) );

    // Update this Node when the model tells us that it's time to update.
    lightRays.raysProcessedEmitter.addListener( () => update() );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Converts LightRaySegments (model) to scenery Lines (view).
 * @param segments
 * @param modelViewTransform
 * @param lineOptions - options to Line
 */
function segmentsToLines( segments: LightRaySegment[], modelViewTransform: ModelViewTransform2, lineOptions: LineOptions ): Line[] {

  // When attempting to render the rays as a single scenery.Path, we were seeing all kinds of closed-path triangles
  // being rendered. We had to resort to a scenery.Line per segment to make the problem go away.
  // See https://github.com/phetsims/geometric-optics/issues/209
  return segments.map( segment => {
    const viewStartPoint = modelViewTransform.modelToViewPosition( segment.startPoint );
    const viewEndPoint = modelViewTransform.modelToViewPosition( segment.endPoint );
    return new Line( viewStartPoint, viewEndPoint, lineOptions );
  } );
}

geometricOptics.register( 'LightRaysNode', LightRaysNode );
export default LightRaysNode;
export type { LightRaysNodeOptions };