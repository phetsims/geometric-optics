// Copyright 2021, University of Colorado Boulder

/**
 * View of the optical element (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class OpticNode extends Node {

  /**
   * @param {Optic} optic
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( optic, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( options );

    // create a drag listener on this node
    const dragListener = new DragListener(
      {
        positionProperty: optic.positionProperty,
        transform: modelViewTransform,
        applyOffset: false
      } );

    // create the path of the optic
    // @public {Path}
    this.opticPath = new Path( modelViewTransform.modelToViewShape( optic.shapeProperty.value ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    optic.shapeProperty.link( shape => {
      this.opticPath.shape = modelViewTransform.modelToViewShape( shape );
    } );

    this.addInputListener( dragListener );
    this.addChild( this.opticPath );

  }
}

geometricOptics.register( 'OpticNode', OpticNode );
export default OpticNode;
