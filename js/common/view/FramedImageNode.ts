// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedImageNode renders the optical image (real or virtual) associated with a framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image, Node, Path } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';
import FramedImage from '../model/FramedImage.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GOColors from '../GOColors.js';
import GOQueryParameters from '../GOQueryParameters.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { OpticalImageType } from '../model/OpticalImageType.js';
import GOConstants from '../GOConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OpticalImageNode, { OpticalImageNodeOptions } from './OpticalImageNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

type FramedImageNodeOptions = PickRequired<OpticalImageNodeOptions, 'tandem'>;

class FramedImageNode extends OpticalImageNode {

  /**
   * @param framedImage
   * @param optic
   * @param virtualImageVisibleProperty
   * @param lightPropagationEnabledProperty
   * @param objectVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( framedImage: FramedImage,
               optic: Optic,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               lightPropagationEnabledProperty: IReadOnlyProperty<boolean>,
               objectVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: FramedImageNodeOptions ) {

    const options = optionize<FramedImageNodeOptions, {}, OpticalImageNodeOptions, 'visibleProperty'>( {

      // OpticalImageNodeOptions
      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty, framedImage.opticalImageTypeProperty, lightPropagationEnabledProperty, framedImage.visibleProperty, objectVisibleProperty ],
        ( virtualImageVisible: boolean, opticalImageType: OpticalImageType, lightPropagationEnabled: boolean, framedImageVisible: boolean, objectVisible: boolean ) =>
          ( virtualImageVisible || opticalImageType === 'real' ) && lightPropagationEnabled && framedImageVisible && objectVisible, {
          tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } )
    }, providedOptions );

    super( framedImage, options );

    const imageNode = new Image( framedImage.htmlImageElementProperty.value, {
      hitTestPixels: true // See https://github.com/phetsims/geometric-optics/issues/283
    } );

    // Mask for an image that looks like it's facing right, which occurs to the left of the optic.
    const rightFacingMaskShape = new MaskShape( imageNode.width, imageNode.height );

    // Mask for an image that looks like it's facing left, which occurs to the right of the optic.
    // It's the same shape as the right-facing mask, but reflected about the y, and shifted to the right.
    const scaleX = -1;
    const translateX = imageNode.width;
    const matrix = new Matrix3().rowMajor(
      scaleX, 0, translateX,
      0, 1, 0,
      0, 0, 1
    );
    const leftFacingMaskShape = rightFacingMaskShape.transformed( matrix );

    // This mask is used to reduce the opacity of the parts of the optical axis and rays that are occluded by
    // the real or virtual image. See https://github.com/phetsims/geometric-optics/issues/283.
    const maskNode = new Path( rightFacingMaskShape, {
      fill: GOColors.screenBackgroundColorProperty,
      opacity: GOQueryParameters.frameImageMaskOpacity,
      stroke: GOQueryParameters.debugMask ? 'red' : null
    } );

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
      imageNode.image = htmlImageElement;
      maskNode.shape = ( framedImage.positionProperty.value.x < optic.positionProperty.value.x ) ?
                       rightFacingMaskShape : leftFacingMaskShape;
      updateScaleAndPosition();
    } );
  }
}

/**
 * Mask for the framed image, used to reduce the opacity of the parts of the optical axis and rays that are occluded
 * by the real or virtual image. The mask is drawn in the orientation of a right-facing image, which occurs to the
 * left of the optic. See https://github.com/phetsims/geometric-optics/issues/283.
 *
 * The original approach was to use imageNode.getSelfShape to create a Shape that matched the image exactly. But
 * getSelfShape is expensive, and caused performance issues when dragging the optical image. See
 * https://github.com/phetsims/geometric-optics/issues/361.  So I switched to drawing a specific Shape that matches
 * the image 'close enough'. This Shape is dependent on the .PNG files for the framed images, and also assumes that
 * all .PNG files for frames images have the same dimensions.
 *
 * To visually inspect this mask, run with ?debugMask.
 */
class MaskShape extends Shape {

  /**
   * @param imageWidth
   * @param imageHeight
   */
  constructor( imageWidth: number, imageHeight: number ) {

    const xInset1 = 12;
    const xInset2 = 10;
    const yInset0 = 6;
    const yInset1 = 55;
    const yInset2 = 3;

    super();

    // Outline a right-facing framed image, starting at topLeft and moving clockwise.
    this.moveTo( 0, yInset0 )
      .lineTo( xInset2, yInset2 )
      .lineTo( imageWidth - xInset1, yInset1 )
      .lineTo( imageWidth - xInset1, imageHeight - yInset1 )
      .lineTo( xInset2, imageHeight - yInset2 )
      .lineTo( 0, imageHeight - yInset0 )
      .close();
  }
}

geometricOptics.register( 'FramedImageNode', FramedImageNode );
export default FramedImageNode;