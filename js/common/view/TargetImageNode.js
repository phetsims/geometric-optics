// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import picture_c_3d_png from '../../../images/picture_c_3d_reversed_png.js';


class TargetImageNode extends Node {

  /**
   * @param {TargetImage} targetImage
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( targetImage, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    const object = new Image( picture_c_3d_png );
    object.scale( -0.5, -0.5 );

    targetImage.positionProperty.link( position => {
      const scale = Math.abs( targetImage.scaleProperty.value );
      const sign = targetImage.isVirtualImage() ? -1 : 1;
      object.translation = modelViewTransform.modelToViewPosition( position ).plusXY( -sign * 25 * scale, -sign * 136 * scale );
      object.setScaleMagnitude( scale * 0.5 );
    } );

    targetImage.isVirtualImageProperty.link( isVirtual => {
      object.scale( -1, -1 );
    } );

    targetImage.lens.diameterProperty.link( diameter => {
      object.setImageOpacity( targetImage.lens.getNormalizedDiameter( diameter ) );
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
