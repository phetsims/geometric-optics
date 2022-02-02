// Copyright 2021-2022, University of Colorado Boulder

/**
 * View of the optical Image (both real and virtual)
 * This scenery node is responsible for scaling the Image, setting its position,
 * its representation, and assigning the appropriate orientation of the Image.
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
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type TargetNodeOptions = {
  tandem: Tandem
};

class TargetNode extends Node {

  /**
   * @param representationProperty
   * @param target
   * @param optic
   * @param virtualImageVisibleProperty
   * @param raysAndImagesVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, target: Target, optic: Optic,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>, raysAndImagesVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2, providedOptions: TargetNodeOptions ) {

    const options = merge( {
      visibleProperty: new DerivedProperty(
        [ representationProperty, raysAndImagesVisibleProperty ],
        ( representation: Representation, rayTracingVisible: boolean ) =>
          representation.isFramedObject && rayTracingVisible
      )
    }, providedOptions );

    super( options );

    assert && assert( target.imageProperty.value ); // {HTMLImageElement|null}
    const imageNode = new Image( target.imageProperty.value!, {
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

      const viewBounds = modelViewTransform.modelToViewBounds( target.boundsProperty.value );

      const initialWidth = parentNode.width;
      const initialHeight = parentNode.height;

      parentNode.scale( viewBounds.width / initialWidth, viewBounds.height / initialHeight );
      parentNode.translation = new Vector2( viewBounds.minX, viewBounds.minY );
    };

    /**
     * update the visibility of the optical Image based on:
     * Is the Image virtual?
     * Is the 'Virtual Image' checkbox checked?
     * Has the Image been targeted by the rays?
     */
    Property.multilink(
      [ target.isVirtualProperty, virtualImageVisibleProperty, target.visibleProperty ],
      ( isVirtual: boolean, virtualImageVisible: boolean, targetVisible: boolean ) => {
        parentNode.visible = ( isVirtual ? virtualImageVisible : true ) && targetVisible;
      } );

    // update position and scale when model bounds change
    target.boundsProperty.link( () => updateScaleAndPosition() );

    // update the opacity of the Image
    target.lightIntensityProperty.link( intensity => {
      imageNode.opacity = Utils.linear( 0, 1, GOQueryParameters.imageOpacityRange[ 0 ], GOQueryParameters.imageOpacityRange[ 1 ], intensity );
      phet.log && phet.log( `Image opacity=${imageNode.opacity}` );
    } );

    // Update the image and mask
    target.imageProperty.link( image => {
      if ( image ) {
        imageNode.image = image!;
        maskNode.shape = imageNode.getSelfShape();
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