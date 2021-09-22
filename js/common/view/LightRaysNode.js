// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';

class LightRaysNode extends Node {

  /**
   * @param {LightRays} lightRays
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( lightRays, modelViewTransform, options ) {

    options = merge( {
      realRayStroke: 'white',
      realRayLineWidth: 2,
      virtualRayStroke: 'white',
      virtualRayLineWidth: 2
    }, options );

    const realRayPath = new Path( modelViewTransform.modelToViewShape( lightRays.realRay ), {
      stroke: options.realRayStroke,
      lineWidth: options.realRayLineWidth
    } );

    const virtualRayPath = new Path( modelViewTransform.modelToViewShape( lightRays.virtualRay ), {
      stroke: options.virtualRayStroke,
      lineWidth: options.virtualRayLineWidth
    } );

    assert && assert( !options.children );
    options.children = [ realRayPath, virtualRayPath ];

    super( options );

    // Update this Node when the model tells us that it's time to update.
    lightRays.raysProcessedEmitter.addListener( () => {
      realRayPath.shape = modelViewTransform.modelToViewShape( lightRays.realRay );
      virtualRayPath.shape = modelViewTransform.modelToViewShape( lightRays.virtualRay );
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

geometricOptics.register( 'LightRaysNode', LightRaysNode );
export default LightRaysNode;