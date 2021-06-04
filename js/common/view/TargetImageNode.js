// Copyright 2021, University of Colorado Boulder

/**
 * View of the image (both real and virtual)
 * This scenery node is responsible for scaling the image, setting its position,
 * its representation, and assigning the appropriate orientation of the image.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TargetImageNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {TargetImage} targetImage
   * @param {Optic} optic
   * @param {Property.<boolean>} visibleVirtualImageProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( representationProperty,
               targetImage,
               optic,
               visibleVirtualImageProperty,
               modelViewTransform,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( { tandem: tandem } );

    // {Property.<HTMLImageElement>}
    const imageProperty = new DerivedProperty( [ representationProperty, targetImage.isVirtualProperty ],
      ( representation, isVirtual ) => {
        const realImage = optic.isLens() ? representation.leftFacingInverted :
                          representation.rightFacingInverted;
        const virtualImage = optic.isLens() ? representation.rightFacingUpright :
                             representation.leftFacingUpright;
        return isVirtual ? virtualImage : realImage;
      } );

    // creates the target image
    const target = new Image( imageProperty.value, { scale: 0.5 } );

    function updateScale() {
      const position = targetImage.positionProperty.value;
      const scale = Math.abs( targetImage.scaleProperty.value );
      const verticalOffset = targetImage.isVirtual() ? -40 : -145;
      const horizontalOffset = targetImage.isVirtual() ? -30 : -22;
      target.translation = modelViewTransform.modelToViewPosition( position ).plusXY( horizontalOffset * scale, verticalOffset * scale );
      target.setScaleMagnitude( scale * 0.5 );
    }

    function updateVisibility() {
      const showVirtualImage = visibleVirtualImageProperty.value;
      const isObjectDistancePositive = targetImage.isObjectOpticDistancePositive();
      target.visible = ( ( targetImage.isVirtual() ) ? showVirtualImage : true ) && isObjectDistancePositive;
    }


    targetImage.positionProperty.link( () => {
      updateScale();
      updateVisibility();
    } );

    optic.curveProperty.link( () => {
      updateScale();
      updateVisibility();
    } );

    targetImage.isVirtualProperty.link( () => {
      updateVisibility();
    } );

    // updates the visibility of the image based on the checkbox toggle
    visibleVirtualImageProperty.link( () => {
      updateVisibility();
    } );

    targetImage.lightIntensityProperty.link( intensity => {
      target.opacity = intensity;
    } );

    // update the image and its visibility
    imageProperty.link( image => {

      // make this entire node invisible if the representation is not an object.
      this.visible = representationProperty.value.isObject;

      // update the representation if it is an object
      if ( representationProperty.value.isObject ) {

        // update the image
        target.image = image;
      }
    } );

    this.addChild( target );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
