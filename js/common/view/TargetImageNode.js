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
   * @param {EnumerationProperty.<Representation>} representationProperty
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


    targetImage.positionProperty.link( position => {
      updateScale();
      updateVisibility();
    } );

    optic.curveProperty.link( curvatureType => {
      updateScale();
      updateVisibility();
    } );

    targetImage.isVirtualProperty.link( isVirtual => {
      updateVisibility();
    } );

    // updates the visibility of the image based on the checkbox toggle
    visibleVirtualImageProperty.link( visible => {
      updateVisibility();
    } );

    targetImage.lightIntensityProperty.link( intensity => {
      target.opacity = intensity;
    } );

    // update the image and its visibility
    imageProperty.link( image => {
      if ( representationProperty.value.isObject ) {
        this.visible = true;

        // update the image
        target.image = image;
      }
      else {
        // make this entire node invisible if  representation is not an object.
        this.visible = false;
      }
    } );

    this.addChild( target );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
