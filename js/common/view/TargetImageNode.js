// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TargetImageNode extends Node {

  /**
   * @param {TargetImage} targetImage
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( targetImage, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    const object = new Circle( 3, {
      stroke: 'green',
      lineWidth: 10,
      center: modelViewTransform.modelToViewPosition( targetImage.positionProperty.value )
    } );

    targetImage.positionProperty.link( position => {
      object.center = modelViewTransform.modelToViewPosition( position );
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
