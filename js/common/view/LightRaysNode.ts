// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightRaysNode is responsible for rendering the rays associated with the real image and virtual image.
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
import LightRays from '../model/LightRays.js';
import LightRaySegment from '../model/LightRaySegment.js';
import Representation from '../model/Representation.js';

type LineOptions = {
  stroke?: ColorDef,
  lineWidth?: number,
  lineDash?: number[],
  opacity?: number
};

type LightRaysNodeOptions = {
  realRaysStroke: ColorDef,
  virtualRaysStroke: ColorDef,
  visibleProperty?: IProperty<boolean>
};

class LightRaysNode extends Node {

  /**
   * @param lightRays
   * @param representationProperty
   * @param virtualImageVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               representationProperty: IReadOnlyProperty<Representation>,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: LightRaysNodeOptions ) {

    const realRaysNode = new Node();

    const virtualRaysNode = new Node( {

      // Show virtual rays only for objects, not for light source. See https://github.com/phetsims/geometric-optics/issues/216
      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty, representationProperty ],
        ( virtualImageVisible: boolean, representation: Representation ) =>
          virtualImageVisible && representation.isFramedObject
      )
    } );

    const realRayOptions = {
      stroke: providedOptions.realRaysStroke,
      lineWidth: 2
    };
    const virtualRayOptions = {
      stroke: providedOptions.virtualRaysStroke,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      opacity: 0.5
    };

    const update = (): void => {
      realRaysNode.children = segmentsToLines( lightRays.realSegments, modelViewTransform, realRayOptions );
      virtualRaysNode.children = segmentsToLines( lightRays.virtualSegments, modelViewTransform, virtualRayOptions );
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
 * Converts model ray segments to scenery Line nodes.
 * @param segments
 * @param modelViewTransform
 * @param lineOptions
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