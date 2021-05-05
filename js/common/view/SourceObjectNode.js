// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class SourceObjectNode extends Node {

  /**
   * @param {SourceObject} sourceObject
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( sourceObject, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    const dragListener = new DragListener(
      {
        positionProperty: sourceObject.positionProperty,
        transform: modelViewTransform
      } );

    const object = new Circle( 10, {
      stroke: 'yellow',
      lineWidth: 2
    } );

    object.addInputListener( dragListener );

    sourceObject.positionProperty.link( position => {
      object.translation = modelViewTransform.modelToViewPosition( position );
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;
