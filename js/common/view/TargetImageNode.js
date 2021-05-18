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

    // {Property.<Image>}
    const imageProperty = new DerivedProperty( [ targetImage.representationProperty, targetImage.isVirtualProperty ],
      ( representation, isVirtual ) => {
        const realImage = optic.isLens() ? representation.targetInverted :
                          representation.sourceInverted;
        const virtualImage = optic.isLens() ? representation.sourceUpright :
                             representation.targetUpright;
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

    imageProperty.link( image => {
      target.image = image;
    } );

    targetImage.positionProperty.link( position => {
      updateScale();
      updateVisibility();
    } );

    targetImage.isVirtualProperty.link( isVirtual => {
      updateVisibility();
    } );

    optic.curveProperty.link( curvatureType => {
      updateScale();
      updateVisibility();
    } );


    // updates the opacity of the image
    optic.diameterProperty.link( diameter => {
      target.setImageOpacity( optic.getNormalizedDiameter( diameter ) );
    } );

    // updates the visibility of the image based on the checkbox toggle
    visibleVirtualImageProperty.link( visible => {
      updateVisibility();
    } );

    this.addChild( target );
  }

}

geometricOptics.register( 'TargetImageNode', TargetImageNode );
export default TargetImageNode;
