// Copyright 2021, University of Colorado Boulder

/**
 * View of the image (both real and virtual)
 * This scenery node is responsible for scaling the image, setting its position,
 * its representation, and assigning the appropriate orientation of the image.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';
import Target from '../model/Target.js';

class TargetNode extends Node {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Target} target
   * @param {Optic} optic
   * @param {Property.<boolean>} virtualImageVisibleProperty
   * @param {Property.<boolean>} rayTracingVisibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( representationProperty: any, target: Target, optic: Optic, //TODO-TS any
               virtualImageVisibleProperty: Property<boolean>, rayTracingVisibleProperty: Property<boolean>,
               modelViewTransform: ModelViewTransform2 ) {

    super();

    // creates the target image - the actual image will be updated later
    // @ts-ignore TODO-TS  Argument of type 'HTMLImageElement | null' is not assignable to parameter of type 'string | any[] | HTMLImageElement | HTMLCanvasElement'.
    const targetImage = new Image( target.imageProperty.value );

    /**
     * update the size as well as the position of the target image.
     */
    const updateScaleAndPosition = () => {

      // desired bounds for the image
      const viewBounds = modelViewTransform.modelToViewBounds( target.boundsProperty.value );

      // current values for width and height of the image
      // @ts-ignore TODO-TS Property 'width' does not exist on type 'Image'.
      const initialWidth = targetImage.width;
      // @ts-ignore TODO-TS Property 'height' does not exist on type 'Image'.
      const initialHeight = targetImage.height;

      // scale image appropriately
      // @ts-ignore TODO-TS Property 'scale' does not exist on type 'Image'.
      targetImage.scale( viewBounds.width / initialWidth, viewBounds.height / initialHeight );

      // position the image
      // @ts-ignore TODO-TS Property 'translation' does not exist on type 'Image'.
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
        // @ts-ignore TODO-TS Property 'visible' does not exist on type 'Image'.
        targetImage.visible = ( isVirtual ? virtualImageVisible : true ) && targetVisible;
      } );

    // update position and scale when model bounds change
    target.boundsProperty.link( () => {
      updateScaleAndPosition();
    } );

    // update the opacity of the image
    target.lightIntensityProperty.link( ( intensity: number ) => {
      // @ts-ignore TODO-TS Property 'opacity' does not exist on type 'Image'.
      targetImage.opacity = intensity;
    } );

    // update the image and its visibility
    Property.multilink(
      [ target.imageProperty, rayTracingVisibleProperty ],
      ( image: HTMLImageElement|null, rayTracingVisible: boolean ) => {

        // is the representation an object
        const isObject = representationProperty.value.isObject;

        // make this entire node visible only if the representation is an object.
        this.visible = isObject && rayTracingVisible;

        // update the representation if it is an object
        if ( isObject ) {

          // update the image
          // @ts-ignore TODO-TS Type 'HTMLImageElement | null' is not assignable to type 'HTMLImageElement | HTMLCanvasElement'.
          targetImage.image = image;

          // update the scale of the image
          updateScaleAndPosition();
        }
      } );

    // add the target image to this node
    // @ts-ignore TODO-TS Argument of type 'Image' is not assignable to parameter of type 'Node'.
    this.addChild( targetImage );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'TargetNode', TargetNode );
export default TargetNode;