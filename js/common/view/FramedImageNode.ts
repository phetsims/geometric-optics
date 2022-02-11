// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedImageNode renders the optical image (real or virtual) associated with a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image, Node, Path } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';
import FramedImage from '../model/FramedImage.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GOColors from '../GOColors.js';
import GOQueryParameters from '../GOQueryParameters.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { OpticalImageType } from '../model/OpticalImageType.js';

type FramedImageNodeOptions = {
  tandem: Tandem
};

class FramedImageNode extends Node {

  /**
   * @param framedImage
   * @param optic
   * @param virtualImageVisibleProperty
   * @param raysAndImagesVisibleProperty
   * @param objectVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( framedImage: FramedImage,
               optic: Optic,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               raysAndImagesVisibleProperty: IReadOnlyProperty<boolean>,
               objectVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: FramedImageNodeOptions ) {

    const options = merge( {
      // because we'll be supplying our own visibleProperty via setVisibleProperty
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    assert && assert( framedImage.imageProperty.value ); // {HTMLImageElement|null}
    const imageNode = new Image( framedImage.imageProperty.value!, {
      hitTestPixels: true // See https://github.com/phetsims/geometric-optics/issues/283
    } );

    // This mask is used to reduce the opacity of the parts of the optical axis and rays that are occluded by
    // the real or virtual image. The shape of the mask matches the shape of imageNode, using getSelfShape.
    // See https://github.com/phetsims/geometric-optics/issues/283.
    const maskNode = new Path( null, {
      fill: GOColors.screenBackgroundColorProperty,
      opacity: GOQueryParameters.imageMaskOpacity,
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

      parentNode.scale( viewBounds.width / initialWidth, viewBounds.height / initialHeight );
      parentNode.translation = new Vector2( viewBounds.minX, viewBounds.minY );
    };

    this.setVisibleProperty( new DerivedProperty(
      [ virtualImageVisibleProperty, framedImage.opticalImageTypeProperty, raysAndImagesVisibleProperty, framedImage.visibleProperty, objectVisibleProperty ],
      ( virtualImageVisible: boolean, opticalImageType: OpticalImageType, raysAndImagesVisible: boolean, framedImageVisible: boolean, objectVisible: boolean ) =>
        ( virtualImageVisible || opticalImageType === 'real' ) && raysAndImagesVisible && framedImageVisible && objectVisible, {
        tandem: options.tandem.createTandem( 'visibleProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
      } ) );

    // update position and scale when model bounds change
    framedImage.boundsProperty.link( () => updateScaleAndPosition() );

    // update the opacity of the Image
    framedImage.opacityProperty.link( opacity => {
      imageNode.opacity = opacity;
    } );

    // Update the image and mask
    framedImage.imageProperty.link( image => {
      if ( image ) {
        imageNode.image = image!;
        maskNode.shape = imageNode.getSelfShape();
        updateScaleAndPosition();
      }
      else {
        maskNode.shape = null;
      }
    } );

    this.addLinkedElement( framedImage, {
      tandem: options.tandem.createTandem( 'framedImage' )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'FramedImageNode', FramedImageNode );
export default FramedImageNode;