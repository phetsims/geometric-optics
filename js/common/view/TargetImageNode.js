// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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

    // {Property.<Image>}
    const imageProperty = new DerivedProperty( [ representationProperty, targetImage.isVirtualProperty ],
      ( representation, isVirtual ) => {
        const realImage = optic.isLens() ? representation.targetInverted :
                          representation.sourceInverted;
        const virtualImage = optic.isLens() ? representation.sourceUpright :
                             representation.targetUpright;
        return isVirtual ? virtualImage : realImage;
      } );

    const target = new Image( imageProperty.value, { scale: 0.5 } );

    function updateFrame() {
      target.image = imageProperty.value;
    }

    function updateScale() {
      const position = targetImage.positionProperty.value;
      const scale = Math.abs( targetImage.scaleProperty.value );
      const verticalOffset = targetImage.isVirtual() ? -40 : -136;
      const horizontalOffset = targetImage.isVirtual() ? -30 : -25;
      target.translation = modelViewTransform.modelToViewPosition( position ).plusXY( horizontalOffset * scale, verticalOffset * scale );
      target.setScaleMagnitude( scale * 0.5 );
    }

    function updateImage() {
      const isVirtual = targetImage.isVirtual();
      target.image = imageProperty.value;
      const showVirtualImage = visibleVirtualImageProperty.value;
      const isSourceToTheLeft = targetImage.isObjectOpticDistancePositive();
      target.visible = ( ( isVirtual ) ? showVirtualImage : true ) && isSourceToTheLeft;
    }

    imageProperty.link( image => {
      target.image = imageProperty.value;
    } );

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
      target.setImageOpacity( optic.getNormalizedDiameter( diameter ) );
    } );

    visibleVirtualImageProperty.link( visible => {
      updateImage();
    } );

    this.addChild( target );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
