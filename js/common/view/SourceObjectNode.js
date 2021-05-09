// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Image from '../../../../scenery/js/nodes/Image.js';

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

    const object = new Image( sourceObject.typeProperty.value.source );

    sourceObject.typeProperty.link( type => {
      object.image = type.source;
    } );
    object.scale( 0.5 );

    object.addInputListener( dragListener );

    sourceObject.positionProperty.link( position => {
      object.translation = modelViewTransform.modelToViewPosition( position ).plusXY( -30, -40 );
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;
