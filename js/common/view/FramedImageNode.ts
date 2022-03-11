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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { OpticalImageType } from '../model/OpticalImageType.js';
import GOConstants from '../GOConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OpticalImageNode, { OpticalImageNodeOptions } from './OpticalImageNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FramedImageMaskNode from './FramedImageMaskNode.js';

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

      // update the HTMLImageElement (PNG file)
      imageNode.image = htmlImageElement;

      // update the mask to match the orientation of the optical image
      if ( ( framedImage.positionProperty.value.x < optic.positionProperty.value.x ) ) {
        maskNode.shape = maskNode.rightFacingMaskShape;
      }
      else {
        maskNode.shape = maskNode.leftFacingMaskShape;
      }

      updateScaleAndPosition();
    } );
  }
}

geometricOptics.register( 'FramedImageNode', FramedImageNode );
export default FramedImageNode;