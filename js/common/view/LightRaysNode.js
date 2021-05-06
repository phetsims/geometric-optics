// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class LightRaysNode extends Node {

  /**
   * @param {LightRays} lightRays
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( lightRays, modelViewTransform, tandem ) {
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


    Property.multilink( [ lightRays.sourceObject.positionProperty, lightRays.lens.positionProperty, lightRays.modeProperty, lightRays.lens.diameterProperty, lightRays.lens.focalLengthProperty ],
      () => {
        // Move this node as the model representation moves
        realRayPath.shape = modelViewTransform.modelToViewShape( lightRays.realRay );
        virtualRayPath.shape = modelViewTransform.modelToViewShape( lightRays.virtualRay );
      }
    );

  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

}

geometricOptics.register( 'LightRaysNode', LightRaysNode );
export default LightRaysNode;
