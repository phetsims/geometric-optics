// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Image from '../../../../scenery/js/nodes/Image.js';
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

    super( { tandem: tandem } );

    const typeProperty = targetImage.sourceObject.typeProperty;

    const object = new Image( typeProperty.value.target, { scale: 0.5 } );

    function updateFrame() {
      const isVirtual = targetImage.isVirtualImageProperty.value;
      object.image = isVirtual ? typeProperty.value.source : typeProperty.value.target;
    }

    function updateScale() {
      const position = targetImage.positionProperty.value;
      const scale = Math.abs( targetImage.scaleProperty.value );
      const verticalOffset = targetImage.isVirtualImage() ? -40 : -136;
      const horizontalOffset = targetImage.isVirtualImage() ? -30 : -25;
      object.translation = modelViewTransform.modelToViewPosition( position ).plusXY( horizontalOffset * scale, verticalOffset * scale );
      object.setScaleMagnitude( scale * 0.5 );
    }

    targetImage.sourceObject.typeProperty.link( type => {
      updateFrame();
    } );

    targetImage.positionProperty.link( position => {
      updateScale();
    } );

    targetImage.isVirtualImageProperty.link( isVirtual => {
      updateFrame();
    } );

    targetImage.lens.curvatureTypeProperty.link( curvatureType => {
      updateScale();
    } );

    targetImage.lens.diameterProperty.link( diameter => {
      object.setImageOpacity( targetImage.lens.getNormalizedDiameter( diameter ) );
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
