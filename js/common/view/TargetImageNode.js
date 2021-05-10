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
   * @param {Property.<boolean>} visibleVirtualImageProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( targetImage, visibleVirtualImageProperty, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( { tandem: tandem } );

    const typeProperty = targetImage.sourceObject.typeProperty;

    const object = new Image( typeProperty.value.target, { scale: 0.5 } );

    function updateFrame() {
      const isVirtual = targetImage.isInvertedImageProperty.value;
      object.image = isVirtual ? typeProperty.value.source : typeProperty.value.target;
    }

    function updateScale() {
      const position = targetImage.positionProperty.value;
      const scale = Math.abs( targetImage.scaleProperty.value );
      const verticalOffset = targetImage.isInvertedImage() ? -40 : -136;
      const horizontalOffset = targetImage.isInvertedImage() ? -30 : -25;
      object.translation = modelViewTransform.modelToViewPosition( position ).plusXY( horizontalOffset * scale, verticalOffset * scale );
      object.setScaleMagnitude( scale * 0.5 );
    }

    function updateImage() {
      const isVirtual = targetImage.isInvertedImageProperty.value;
      object.image = isVirtual ? typeProperty.value.source : typeProperty.value.target;
      const showVirtualImage = visibleVirtualImageProperty.value;
      const isSourceToTheLeft = ( targetImage.sourceObject.positionProperty.value.x < targetImage.lens.positionProperty.value.x );
      object.visible = ( ( isVirtual ) ? showVirtualImage : true ) && isSourceToTheLeft;
    }

    targetImage.sourceObject.typeProperty.link( type => {
      updateFrame();
    } );

    targetImage.positionProperty.link( position => {
      updateScale();
      updateImage();
    } );

    targetImage.isInvertedImageProperty.link( isVirtual => {
      updateFrame();
      updateImage();
    } );

    targetImage.lens.curvatureTypeProperty.link( curvatureType => {
      updateScale();
      updateImage();
    } );

    targetImage.lens.diameterProperty.link( diameter => {
      object.setImageOpacity( targetImage.lens.getNormalizedDiameter( diameter ) );
    } );

    visibleVirtualImageProperty.link( visible => {
      updateImage();
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
