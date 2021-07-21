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
import Representation from '../model/Representation.js';

class TargetNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {Target} target
   * @param {Optic} optic
   * @param {Property.<boolean>} enableImageProperty
   * @param {Property.<boolean>} visibleVirtualImageProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( representationProperty,
               target,
               optic,
               enableImageProperty,
               visibleVirtualImageProperty,
               modelViewTransform,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( { tandem: tandem } );

    // {Property.<HTMLImageElement>}
    const imageProperty = new DerivedProperty( [ representationProperty, target.isVirtualProperty ],
      ( representation, isVirtual ) => {
        const realImage = optic.isLens() ? representation.leftFacingInverted :
                          representation.rightFacingInverted;
        const virtualImage = optic.isLens() ? representation.rightFacingUpright :
                             representation.leftFacingUpright;
        return isVirtual ? virtualImage : realImage;
      } );

    // creates the target image
    const targetImage = new Image( imageProperty.value, { scale: 0.5 } );

    function updateScale() {
      const position = target.positionProperty.value;
      const scale = Math.abs( target.scaleProperty.value );
      let verticalOffset;
      let horizontalOffset;
      if ( representationProperty.value === Representation.PENCIL ) {
        if ( optic.isLens() ) {
          verticalOffset = target.isVirtual() ? -37 : -145;
          horizontalOffset = target.isVirtual() ? -31 : -22;
        }
        else {
          verticalOffset = target.isVirtual() ? -37 : -145;
          horizontalOffset = target.isVirtual() ? -24 : -31;
        }
      }
      else if ( representationProperty.value === Representation.TREE ) {
        if ( optic.isLens() ) {
          verticalOffset = target.isVirtual() ? -40 : -150;
          horizontalOffset = target.isVirtual() ? -32 : -22;
        }
        else {
          verticalOffset = target.isVirtual() ? -40 : -150;
          horizontalOffset = target.isVirtual() ? -22 : -30;
        }
      }

      else if ( representationProperty.value === Representation.ROCKET ) {
        if ( optic.isLens() ) {
          verticalOffset = target.isVirtual() ? -40 : -165;
          horizontalOffset = target.isVirtual() ? -30 : -22;
        }
        else {
          verticalOffset = target.isVirtual() ? -40 : -165;
          horizontalOffset = target.isVirtual() ? -22 : -30;
        }

      }
      else {
        verticalOffset = target.isVirtual() ? -40 : -145;
        horizontalOffset = target.isVirtual() ? -30 : -22;
      }


      targetImage.translation = modelViewTransform.modelToViewPosition( position ).plusXY( horizontalOffset * scale, verticalOffset * scale );
      targetImage.setScaleMagnitude( scale * 0.5 );
    }

    function updateVisibility() {
      const showVirtualImage = visibleVirtualImageProperty.value;
      const isObjectDistancePositive = target.isObjectOpticDistancePositive();
      targetImage.visible = ( ( target.isVirtual() ) ? showVirtualImage : true ) && isObjectDistancePositive
                            && enableImageProperty.value;
    }

    // see #94
    target.scaleProperty.link( updateScale );

    target.positionProperty.link( () => {
      updateScale();
      updateVisibility();
    } );

    optic.curveProperty.link( () => {
      updateScale();
      updateVisibility();
    } );

    target.isVirtualProperty.link( () => {
      updateVisibility();
    } );

    // updates the visibility of the image based on the checkbox toggle
    visibleVirtualImageProperty.link( () => {
      updateVisibility();
    } );

    target.lightIntensityProperty.link( intensity => {
      targetImage.opacity = intensity;
    } );

    // update the image and its visibility
    imageProperty.link( image => {

      // make this entire node invisible if the representation is not an object.
      this.visible = representationProperty.value.isObject;

      // update the representation if it is an object
      if ( representationProperty.value.isObject ) {

        // update the image
        targetImage.image = image;

        // update the scale of the image
        updateScale();
      }

    } );

    this.addChild( targetImage );

    enableImageProperty.link( () => {
      updateVisibility();
    } );
  }

}

geometricOptics.register( 'TargetNode', TargetNode );
export default TargetNode;
