// Copyright 2021, University of Colorado Boulder

/**
 * LightRaysNode is responsible for rendering the rays associated with the real image and virtual image.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import LightRays from '../model/LightRays.js';
import LightRaySegment from '../model/LightRaySegment.js';

class LightRaysNode extends Node {

  /**
   * @param {LightRays} lightRays
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Property.<boolean>} virtualImageVisibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( lightRays, representationProperty, virtualImageVisibleProperty, modelViewTransform, options ) {

    assert && assert( lightRays instanceof LightRays );
    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( virtualImageVisibleProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      realRaysStroke: 'white',
      realRaysLineWidth: 2,
      virtualRaysStroke: 'white',
      virtualRaysLineWidth: 2
    }, options );

    const realRaysPath = new Path( segmentsToShape( lightRays.realSegments, modelViewTransform ), {
      stroke: options.realRaysStroke,
      lineWidth: options.realRaysLineWidth
    } );

    const virtualRaysPath = new Path( segmentsToShape( lightRays.virtualSegments, modelViewTransform ), {
      stroke: options.virtualRaysStroke,
      lineWidth: options.virtualRaysLineWidth,

      // Show virtual rays only for objects, not for light source. See https://github.com/phetsims/geometric-optics/issues/216
      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty, representationProperty ],
        ( virtualImageVisible, representation ) => virtualImageVisible && representation.isObject
      )
    } );

    assert && assert( !options.children );
    options.children = [ realRaysPath, virtualRaysPath ];

    super( options );

    // Update this Node when the model tells us that it's time to update.
    lightRays.raysProcessedEmitter.addListener( () => {
      realRaysPath.shape = segmentsToShape( lightRays.realSegments, modelViewTransform );
      virtualRaysPath.shape = segmentsToShape( lightRays.virtualSegments, modelViewTransform );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Converts a set of line segments (specified in model coordinates) to a Shape (in view coordinates).
 * @param {LightRaySegment[]} segments
 * @param {ModelViewTransform2} modelViewTransform
 * @returns {Shape}
 */
function segmentsToShape( segments, modelViewTransform ) {

  assert && assert( Array.isArray( segments ) );
  assert && assert( modelViewTransform instanceof ModelViewTransform2 );

  const shape = new Shape();
  segments.forEach( segment => {
    assert && assert( segment instanceof LightRaySegment );
    shape.moveToPoint( segment.startPoint ).lineToPoint( segment.endPoint );
  } );
  return modelViewTransform.modelToViewShape( shape );
}

geometricOptics.register( 'LightRaysNode', LightRaysNode );
export default LightRaysNode;