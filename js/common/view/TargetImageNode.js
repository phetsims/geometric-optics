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
   * @param {Optic} optic
   * @param {Property.<boolean>} visibleVirtualImageProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( targetImage, optic, visibleVirtualImageProperty, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( { tandem: tandem } );

    const representationProperty = targetImage.representationProperty;

    const object = new Image( representationProperty.value.target, { scale: 0.5 } );

    function updateFrame() {
      const isVirtual = targetImage.isInverted();
      object.image = isVirtual ? representationProperty.value.source : representationProperty.value.target;
    }

    function updateScale() {
      const position = targetImage.positionProperty.value;
      const scale = Math.abs( targetImage.scaleProperty.value );
      const verticalOffset = targetImage.isInverted() ? -40 : -136;
      const horizontalOffset = targetImage.isInverted() ? -30 : -25;
      object.translation = modelViewTransform.modelToViewPosition( position ).plusXY( horizontalOffset * scale, verticalOffset * scale );
      object.setScaleMagnitude( scale * 0.5 );
    }

    function updateImage() {
      const isVirtual = targetImage.isInverted();
      object.image = isVirtual ? representationProperty.value.source : representationProperty.value.target;
      const showVirtualImage = visibleVirtualImageProperty.value;
      const isSourceToTheLeft = targetImage.isObjectOpticDistancePositive();
      object.visible = ( ( isVirtual ) ? showVirtualImage : true ) && isSourceToTheLeft;
    }

    representationProperty.link( type => {
      updateFrame();
    } );

    targetImage.positionProperty.link( position => {
      updateScale();
      updateImage();
    } );

    targetImage.isInvertedProperty.link( isVirtual => {
      updateFrame();
      updateImage();
    } );

    optic.curveProperty.link( curvatureType => {
      updateScale();
      updateImage();
    } );

    optic.diameterProperty.link( diameter => {
      object.setImageOpacity( optic.getNormalizedDiameter( diameter ) );
    } );

    visibleVirtualImageProperty.link( visible => {
      updateImage();
    } );

    this.addChild( object );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
