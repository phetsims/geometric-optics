// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedImageNode renders the optical image (real or virtual) associated with a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image, Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type FramedImageNodeOptions = PickRequired<NodeOptions, 'tandem'>;

class FramedImageNode extends Node {

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

    const options = optionize<FramedImageNodeOptions, {}, NodeOptions>( {

      // NodeOptions
      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty, framedImage.opticalImageTypeProperty, lightPropagationEnabledProperty, framedImage.visibleProperty, objectVisibleProperty ],
        ( virtualImageVisible: boolean, opticalImageType: OpticalImageType, lightPropagationEnabled: boolean, framedImageVisible: boolean, objectVisible: boolean ) =>
          ( virtualImageVisible || opticalImageType === 'real' ) && lightPropagationEnabled && framedImageVisible && objectVisible, {
          tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } )
    }, providedOptions );

    super( options );

    const imageNode = new Image( framedImage.htmlImageElementProperty.value, {
      hitTestPixels: true // See https://github.com/phetsims/geometric-optics/issues/283
    } );

    // This mask is used to reduce the opacity of the parts of the optical axis and rays that are occluded by
    // the real or virtual image. The shape of the mask matches the shape of imageNode, using getSelfShape.
    // See https://github.com/phetsims/geometric-optics/issues/283.
    const maskNode = new Path( null, {
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

    // update position and scale when model bounds change
    framedImage.boundsProperty.link( () => updateScaleAndPosition() );

    // update the opacity of the Image
    framedImage.opacityProperty.link( opacity => {
      imageNode.opacity = opacity;
    } );

    // Update the image and mask
    framedImage.htmlImageElementProperty.link( htmlImageElement => {
      imageNode.image = htmlImageElement;
      maskNode.shape = imageNode.getSelfShape();
      updateScaleAndPosition();
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