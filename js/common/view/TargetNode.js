// Copyright 2021, University of Colorado Boulder

/**
 * View of the image (both real and virtual)
 * This scenery node is responsible for scaling the image, setting its position,
 * its representation, and assigning the appropriate orientation of the image.
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TargetNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {Target} target - model of the target
   * @param {Optic} optic
   * @param {Property.<boolean>} enableImageProperty
   * @param {Property.<boolean>} visibleVirtualImageProperty - property of the virtual image  check box
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

    // creates the target image - the actual image will be updated later
    const targetImage = new Image( target.imageProperty.value );


    /**
     * update the size as well as the position of the target image.
     */
    const updateScaleAndPosition = () => {

      // desired bounds for the image
      const viewBounds = modelViewTransform.modelToViewBounds( target.boundsProperty.value );

      // current values for width and height of the image
      const initialWidth = targetImage.width;
      const initialHeight = targetImage.height;

      // scale image appropriately
      targetImage.scale( viewBounds.width / initialWidth, viewBounds.height / initialHeight );

      // position the image
      targetImage.translation = new Vector2( viewBounds.minX, viewBounds.minY );
    };


    /**
     * update the visibility of this node based on:
     * is the image virtual?
     * is the checkbox show virtual is on?
     * has the image been targeted by the rays?
     * is the object to optic distance positive ?
     */
    const updateVisibility = () => {

      // {boolean} state of the virtual image checkbox
      const showVirtualImage = visibleVirtualImageProperty.value;

      const isObjectDistancePositive = target.isObjectOpticDistancePositive();
      targetImage.visible = ( ( target.isVirtual() ) ? showVirtualImage : true )
                            && isObjectDistancePositive
                            && enableImageProperty.value;
    };

    // update position and visibility when model bounds change
    target.boundsProperty.link( () => {
      updateScaleAndPosition();
      updateVisibility();
    } );

    // update position and visibility when the curve type is changed
    optic.curveProperty.link( () => {
      updateScaleAndPosition();
      updateVisibility();
    } );

    // update position and visibility when the curve type is changed
    target.isVirtualProperty.link( () => {
      updateVisibility();
    } );

    // updates the visibility of the image based on the checkbox toggle
    visibleVirtualImageProperty.link( () => {
      updateVisibility();
    } );

    // update the opacity of the image
    target.lightIntensityProperty.link( intensity => {
      targetImage.opacity = intensity;
    } );

    // update visibility after rays reached target
    enableImageProperty.link( () => {
      updateVisibility();
    } );

    // update the image and its visibility
    target.imageProperty.link( image => {

      // make this entire node invisible if the representation is not an object.
      this.visible = representationProperty.value.isObject;

      // update the representation if it is an object
      if ( representationProperty.value.isObject ) {

        // update the image
        targetImage.image = image;

        // update the scale of the image
        updateScaleAndPosition();
      }

    } );

    // add the target image to this node
    this.addChild( targetImage );
  }
}

geometricOptics.register( 'TargetNode', TargetNode );
export default TargetNode;
