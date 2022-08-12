// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisForegroundNode is a subclass of OpticalAxisNode that (using clipArea) shows only the parts of
 * OpticalAxisNode that are in front of framed objects and their associated images. It is intended to be used in
 * FramedSceneNode, and layered in front of framed objects and images.
 *
 * Note that because the optical axis is dashed, we need to use clipArea instead of just drawing the relevant
 * line segments. If we were to draw line segments, the dash pattern would appear to move, and would not line
 * up with the (background) axis drawn by OpticalAxisNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import OpticalAxisNode, { OpticalAxisNodeOptions } from './OpticalAxisNode.js';
import GOQueryParameters from '../GOQueryParameters.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import GOColors from '../GOColors.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

type SelfOptions = EmptySelfOptions;

type OpticalAxisForegroundNodeOptions = SelfOptions & OpticalAxisNodeOptions;

export default class OpticalAxisForegroundNode extends OpticalAxisNode {

  /**
   * @param opticPositionProperty - position of the optic
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param modelViewTransform
   * @param framedObjectPositionProperty
   * @param framedObjectNode
   * @param framedImagePositionProperty
   * @param framedImageNode
   * @param lightRaysProcessedEmitter - fires when animation of rays has completed
   * @param providedOptions
   */
  public constructor( opticPositionProperty: TReadOnlyProperty<Vector2>,
                      modelVisibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      modelViewTransform: ModelViewTransform2,
                      framedObjectPositionProperty: TReadOnlyProperty<Vector2>,
                      framedObjectNode: Node,
                      framedImagePositionProperty: TReadOnlyProperty<Vector2>,
                      framedImageNode: Node,
                      lightRaysProcessedEmitter: TEmitter,
                      providedOptions: OpticalAxisForegroundNodeOptions ) {

    const options = optionize<OpticalAxisForegroundNodeOptions, SelfOptions, OpticalAxisNodeOptions>()( {

      // OpticalAxisNodeOptions
      stroke: ( GOQueryParameters.debugOpticalAxis ) ? 'red' : GOColors.opticalAxisStrokeProperty
    }, providedOptions );

    // create optical axis line, with arbitrary length values.
    super( opticPositionProperty, modelVisibleBoundsProperty, modelViewTransform, options );

    // Stroke the clipArea in red.
    let clipAreaNode: Path;
    if ( GOQueryParameters.debugOpticalAxis ) {
      clipAreaNode = new Path( null, {
        stroke: 'red'
      } );
      this.addChild( clipAreaNode );
    }

    // Update the clipArea, to make the axis look like it passes through things.
    // This shows only the parts of this Node that are in the foreground, i.e. not occluded by other things.
    // While it may seem a bit odd to be listening to the light rays, this is an optimization. When computation
    // of the light rays has completed, we know that other things are in their final positions, and therefore
    // don't end up computing intermediate states as things move around.
    // Run with ?debugOpticalAxis to see the clipArea rendered as a rectangle.
    const updateClipArea = () => {

      let clipArea: Shape; // in view coordinates

      const viewVisibleBounds = modelViewTransform.modelToViewBounds( modelVisibleBoundsProperty.value );
      const minY = viewVisibleBounds.minY;
      const maxY = viewVisibleBounds.maxY;
      const clipHeight = maxY - minY;

      const opticX = modelViewTransform.modelToViewX( opticPositionProperty.value.x );
      const framedObjectX = modelViewTransform.modelToViewX( framedObjectPositionProperty.value.x );
      const framedImageX = modelViewTransform.modelToViewX( framedImagePositionProperty.value.x );

      if ( framedImageX > opticX ) {

        // If the Image is to the right of the optic, clipArea is 1 rectangle, between the Object and Image.
        clipArea = Shape.rectangle( framedObjectX, minY, framedImageX - framedObjectX, clipHeight );
      }
      else {

        // If the Image is to the left of the optic, clipArea requires 2 rectangles.

        // Determine the relative position of the Object and Image.
        const imageOnRight = ( framedImageX > framedObjectX );

        // The first rectangle is between the thing on the right and the optic.
        const x1 = imageOnRight ? framedImageX : framedObjectX;
        const clipWidth1 = opticX - x1;

        // The second rectangle is between the thing on the left and the left edge of the picture frame on the right.
        const x2 = imageOnRight ? framedObjectX : framedImageX;
        const halfFrameWidth = ( imageOnRight ? framedImageNode.bounds.width : framedObjectNode.visibleBounds.width ) / 2;
        const clipWidth2 = x1 - x2 - halfFrameWidth;

        clipArea = new Shape()
          .rect( x1, minY, clipWidth1, clipHeight )
          .rect( x2, minY, clipWidth2, clipHeight );
      }

      this.clipArea = clipArea;

      if ( clipAreaNode ) {
        clipAreaNode.shape = clipArea;
      }
    };

    lightRaysProcessedEmitter.addListener( () => {
      if ( this.visible ) {
        updateClipArea();
      }
    } );

    this.visibleProperty.link( visible => {
      if ( visible ) {
        updateClipArea();
      }
    } );
  }
}

geometricOptics.register( 'OpticalAxisForegroundNode', OpticalAxisForegroundNode );