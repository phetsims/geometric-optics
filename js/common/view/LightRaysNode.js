// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class LightRaysNode extends Node {

  /**
   * @param {LightRays} lightRays
   * @param {Property.<boolean>} visibleVirtualImageProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( lightRays, visibleVirtualImageProperty, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    const realRayPath = new Path( modelViewTransform.modelToViewShape( lightRays.realRay ), {
      stroke: 'pink',
      lineWidth: 2
    } );
    const virtualRayPath = new Path( modelViewTransform.modelToViewShape( lightRays.virtualRay ), {
      stroke: 'green',
      lineWidth: 2
    } );

    this.addChild( realRayPath );
    this.addChild( virtualRayPath );

    lightRays.raysProcessedEmitter.addListener(
      () => {

        // update this node as the model representation changes
        realRayPath.shape = modelViewTransform.modelToViewShape( lightRays.realRay );
        virtualRayPath.shape = modelViewTransform.modelToViewShape( lightRays.virtualRay );
      }
    );

    visibleVirtualImageProperty.linkAttribute( virtualRayPath, 'visible' );
  }

}

geometricOptics.register( 'LightRaysNode', LightRaysNode );
export default LightRaysNode;
