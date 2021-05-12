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

class OpticalElementNode extends Node {

  /**
   * @param {OpticalElement} opticalElement
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( opticalElement, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( options );

    // create a drag listener on this node
    const dragListener = new DragListener(
      {
        positionProperty: opticalElement.positionProperty,
        transform: modelViewTransform,
        applyOffset: false
      } );

    // create the path of the opticalElement
    // @public {Path}
    this.opticalElementPath = new Path( modelViewTransform.modelToViewShape( opticalElement.shape ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );


    this.addInputListener( dragListener );
    this.addChild( this.opticalElementPath );

  }
}

geometricOptics.register( 'OpticalElementNode', OpticalElementNode );
export default OpticalElementNode;
