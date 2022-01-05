// Copyright 2021-2022, University of Colorado Boulder

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
import { Image, Node, Path } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';
import Target from '../model/Target.js';
import Representation from '../model/Representation.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GOColors from '../GOColors.js';
import GOQueryParameters from '../GOQueryParameters.js';

type Options = {
  tandem: Tandem
};

class TargetNode extends Node {

  /**
   * @param representationProperty
   * @param target
   * @param optic
   * @param virtualImageVisibleProperty
   * @param rayTracingVisibleProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, target: Target, optic: Optic,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>, rayTracingVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2, options: Options ) {

    super( options );

    assert && assert( target.imageProperty.value ); // {HTMLImageElement|null}
    const imageNode = new Image( target.imageProperty.value!, {
      hitTestPixels: false //TODO https://github.com/phetsims/geometric-optics/issues/283 hitTestPixels: true
    } );

    // This mask is used to reduce the opacity of the portion of the axis that is occluded by the
    // real or virtual image. See https://github.com/phetsims/geometric-optics/issues/283.
    const maskNode = new Path( imageNode.getSelfShape(), {
      fill: GOColors.screenBackgroundColorProperty,
      opacity: 0.80,
      stroke: GOQueryParameters.debugMask ? 'red' : null
    } );

    const parentNode = new Node( {
      children: [ maskNode, imageNode ]
    } );

    this.addChild( parentNode );

    const updateScaleAndPosition = (): void => {

      // desired bounds for the image
      const viewBounds = modelViewTransform.modelToViewBounds( target.boundsProperty.value );

      // current values for width and height of the image
      const initialWidth = parentNode.width;
      const initialHeight = parentNode.height;

      parentNode.scale( viewBounds.width / initialWidth, viewBounds.height / initialHeight );
      parentNode.translation = new Vector2( viewBounds.minX, viewBounds.minY );
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
        parentNode.visible = ( isVirtual ? virtualImageVisible : true ) && targetVisible;
      } );

    // update position and scale when model bounds change
    target.boundsProperty.link( () => {
      updateScaleAndPosition();
    } );

    // update the opacity of the image
    target.lightIntensityProperty.link( intensity => {
      imageNode.opacity = intensity;
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
          imageNode.image = image!;
          maskNode.shape = imageNode.getSelfShape();

          // update the scale of the image
          updateScaleAndPosition();
        }
        else {
          maskNode.shape = null;
        }
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'TargetNode', TargetNode );
export default TargetNode;