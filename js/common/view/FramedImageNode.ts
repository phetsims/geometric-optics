// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedImageNode renders the optical image (real or virtual) associated with a framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';
import FramedImage from '../model/FramedImage.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import GOConstants from '../GOConstants.js';
import OpticalImageNode, { OpticalImageNodeOptions } from './OpticalImageNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FramedImageMaskNode from './FramedImageMaskNode.js';

type FramedImageNodeOptions = PickRequired<OpticalImageNodeOptions, 'tandem'>;

export default class FramedImageNode extends OpticalImageNode {

  /**
   * @param framedImage - model element
   * @param optic - associated optic
   * @param virtualImageVisibleProperty - should a virtual image be visible?
   * @param lightPropagationEnabledProperty - is light propagation enabled?
   * @param objectVisibleProperty - is the optical object visible?
   * @param modelViewTransform
   * @param providedOptions
   */
  public constructor( framedImage: FramedImage,
                      optic: Optic,
                      virtualImageVisibleProperty: TReadOnlyProperty<boolean>,
                      lightPropagationEnabledProperty: TReadOnlyProperty<boolean>,
                      objectVisibleProperty: TReadOnlyProperty<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: FramedImageNodeOptions ) {

    super( framedImage, virtualImageVisibleProperty, lightPropagationEnabledProperty, objectVisibleProperty, providedOptions );

    const imageNode = new Image( framedImage.htmlImageElementProperty.value );

    // A mask is used to reduce the opacity of the optical image where it occludes the optical axis and rays.
    // See https://github.com/phetsims/geometric-optics/issues/283.
    const maskNode = new FramedImageMaskNode( imageNode.width, imageNode.height );

    const parentNode = new Node( {
      children: [ maskNode, imageNode ]
    } );
    this.addChild( parentNode );

    const updateScaleAndPosition = (): void => {

      const viewBounds = modelViewTransform.modelToViewBounds( framedImage.boundsProperty.value );

      const initialWidth = parentNode.width;
      const initialHeight = parentNode.height;
      const scaleX = ( viewBounds.width / initialWidth ) || GOConstants.MIN_SCALE; // prevent zero scale
      const scaleY = ( viewBounds.height / initialHeight ) || GOConstants.MIN_SCALE; // prevent zero scale

      //TODO https://github.com/phetsims/geometric-optics/issues/321 Assertion failed: scales should be finite
      assert && assert( isFinite( scaleX ) && isFinite( scaleY ),
        'scale should be finite: ' +
        `scaleX=${scaleX}, initialWidth=${initialWidth} viewBounds.width=${viewBounds.width}` +
        `scaleY=${scaleY}, initialHeight=${initialWidth} viewBounds.height=${viewBounds.width}` );

      parentNode.scale( scaleX, scaleY );
      parentNode.translation = new Vector2( viewBounds.minX, viewBounds.minY );
    };

    framedImage.boundsProperty.link( () => updateScaleAndPosition() );

    // Update the opacity of the image, but not the mask.
    framedImage.opacityProperty.link( opacity => {
      imageNode.opacity = opacity;
    } );

    // Update the image and mask.
    framedImage.htmlImageElementProperty.link( htmlImageElement => {

      // Update the HTMLImageElement (PNG file).
      imageNode.image = htmlImageElement;

      // Update the mask to face towards the optic.
      maskNode.setIsRightFacing( framedImage.positionProperty.value.x < optic.positionProperty.value.x );

      updateScaleAndPosition();
    } );
  }
}

geometricOptics.register( 'FramedImageNode', FramedImageNode );