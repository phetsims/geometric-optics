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
import Shape from '../../../../kite/js/Shape.js';
import Utils from '../../../../dot/js/Utils.js';

type TargetNodeOptions = {
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
   * @param providedOptions
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, target: Target, optic: Optic,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>, rayTracingVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2, providedOptions: TargetNodeOptions ) {

    super( providedOptions );

    assert && assert( target.imageProperty.value ); // {HTMLImageElement|null}
    const imageNode = new Image( target.imageProperty.value!, {
      hitTestPixels: false //TODO https://github.com/phetsims/geometric-optics/issues/283 hitTestPixels: true
    } );

    // This mask is used to reduce the opacity of the portion of the axis that is occluded by the
    // real or virtual image. See https://github.com/phetsims/geometric-optics/issues/283.
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
      imageNode.opacity = Utils.linear( 0, 1, GOQueryParameters.imageOpacityRange[ 0 ], GOQueryParameters.imageOpacityRange[ 1 ], intensity );
      phet.log && phet.log( `Image opacity=${imageNode.opacity}` );
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

          //TODO https://github.com/phetsims/scenery/issues/1333 replace with: maskNode.shape = imageNode.getSelfShape();
          {
            const xInset1 = 12;
            const xInset2 = 10;
            const yInset1 = 56;
            const yInset2 = 3;
            const yInset3 = 6;
            if ( target.positionProperty.value.x > optic.positionProperty.value.x ) {
              maskNode.shape = new Shape()
                .moveTo( xInset1, yInset1 )
                .lineTo( imageNode.width - xInset2, yInset2 )
                .lineTo( imageNode.width, yInset3 )
                .lineTo( imageNode.width, imageNode.height - yInset3 )
                .lineTo( imageNode.width - xInset2, imageNode.height - yInset2 )
                .lineTo( xInset1, imageNode.height - yInset1 )
                .close();
            }
            else {
              maskNode.shape = new Shape()
                .moveTo( 0, yInset3 )
                .lineTo( xInset2, yInset2 )
                .lineTo( imageNode.width - xInset1, yInset1 )
                .lineTo( imageNode.width - xInset1, imageNode.height - yInset1 )
                .lineTo( xInset2, imageNode.height - yInset2 )
                .lineTo( 0, imageNode.height - yInset3 )
                .close();
            }
          }

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