// Copyright 2021, University of Colorado Boulder

/**
 * LightRaysNode is responsible for rendering the rays associated with the real image and virtual image.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { ColorDef } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import LightRays from '../model/LightRays.js';
import LightRaySegment from '../model/LightRaySegment.js';
import Representation from '../model/Representation.js';

class LightRaysNode extends Node {

  /**
   * @param lightRays
   * @param representationProperty
   * @param virtualImageVisibleProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( lightRays: LightRays, representationProperty: Property<Representation>,
               virtualImageVisibleProperty: Property<boolean>, modelViewTransform: ModelViewTransform2, options?: any ) {

    options = merge( {
      realRaysStroke: 'white',
      realRaysLineWidth: 2,
      virtualRaysStroke: 'white',
      virtualRaysLineWidth: 2
    }, options );

    const realRaysNode = new Node();

    const virtualRaysPath = new Node( {

      // Show virtual rays only for objects, not for light source. See https://github.com/phetsims/geometric-optics/issues/216
      visibleProperty: new DerivedProperty<boolean>(
        [ virtualImageVisibleProperty, representationProperty ],
        ( virtualImageVisible: boolean, representation: Representation ) =>
          virtualImageVisible && representation.isObject
      )
    } );

    const update = (): void => {
      realRaysNode.children = segmentsToLines( lightRays.realSegments, modelViewTransform, options.realRaysStroke, options.realRaysLineWidth );
      virtualRaysPath.children = segmentsToLines( lightRays.virtualSegments, modelViewTransform, options.virtualRaysStroke, options.virtualRaysLineWidth );
    };
    update();

    assert && assert( !options.children );
    options.children = [ realRaysNode, virtualRaysPath ];

    super( options );

    // Update this Node when the model tells us that it's time to update.
    lightRays.raysProcessedEmitter.addListener( () => update() );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Converts a set of kite.Line segments (specified in model coordinates) to a set of scenery.Line Nodes (in view coordinates).
 * @param segments
 * @param modelViewTransform
 * @param stroke
 * @param lineWidth
 */
function segmentsToLines( segments: LightRaySegment[], modelViewTransform: ModelViewTransform2, stroke: ColorDef,
                          lineWidth: number ): Line[] {

  assert && assert( lineWidth > 0 );

  // When attempting to render the rays as a single scenery.Path, we were seeing all kinds of closed-path triangles
  // being rendered. We had to resort to a scenery.Line per segment to make the problem go away.
  // See https://github.com/phetsims/geometric-optics/issues/209
  return segments.map( segment => {
    const viewStartPoint = modelViewTransform.modelToViewPosition( segment.startPoint );
    const viewEndPoint = modelViewTransform.modelToViewPosition( segment.endPoint );
    return new Line( viewStartPoint, viewEndPoint, {
      stroke: stroke,
      lineWidth: lineWidth
    } );
  } );
}

geometricOptics.register( 'LightRaysNode', LightRaysNode );
export default LightRaysNode;