// Copyright 2021, University of Colorado Boulder

/**
 * View of the image (both real and virtual)
 * This scenery node is responsible for scaling the image, setting its position,
 * its representation, and assigning the appropriate orientation of the image.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';
import Target from '../model/Target.js';
import Representation from '../model/Representation.js';

class TargetNode extends Node {

  /**
   * @param representationProperty
   * @param target
   * @param optic
   * @param virtualImageVisibleProperty
   * @param rayTracingVisibleProperty
   * @param modelViewTransform
   */
  constructor( representationProperty: Property<Representation>, target: Target, optic: Optic,
               virtualImageVisibleProperty: Property<boolean>, rayTracingVisibleProperty: Property<boolean>,
               modelViewTransform: ModelViewTransform2 ) {

    super();

    // creates the target image - the actual image will be updated later
    assert && assert( target.imageProperty.value ); // {HTMLImageElement|null}
    const targetImage = new Image( target.imageProperty.value! );

    /**
     * update the size as well as the position of the target image.
     */
    const updateScaleAndPosition = (): void => {

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
     * update the visibility of the image based on:
     * is the image virtual?
     * is the checkbox show virtual on?
     * has the image been targeted by the rays?
     */
    Property.multilink(
      [ target.isVirtualProperty, virtualImageVisibleProperty, target.visibleProperty ],
      ( isVirtual: boolean, virtualImageVisible: boolean, targetVisible: boolean ) => {
        targetImage.visible = ( isVirtual ? virtualImageVisible : true ) && targetVisible;
      } );

    // update position and scale when model bounds change
    target.boundsProperty.link( () => {
      updateScaleAndPosition();
    } );

    // update the opacity of the image
    target.lightIntensityProperty.link( intensity => {
      targetImage.opacity = intensity;
    } );

    // update the image and its visibility
    Property.multilink(
      [ target.imageProperty, rayTracingVisibleProperty ],
      ( image: HTMLImageElement | null, rayTracingVisible: boolean ) => {

        // is the representation an object
        const isObject = representationProperty.value.isObject;

        // make this entire node visible only if the representation is an object.
        this.visible = isObject && rayTracingVisible;

        // update the representation if it is an object
        if ( isObject ) {

          // update the image
          assert && assert( image ); // {HTMLImageElement|null}
          targetImage.image = image!;

          // update the scale of the image
          updateScaleAndPosition();
        }
      } );

    // add the target image to this node
    this.addChild( targetImage );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'TargetNode', TargetNode );
export default TargetNode;