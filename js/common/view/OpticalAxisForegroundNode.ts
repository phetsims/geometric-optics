// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisForegroundNode is a subclass of OpticalAxisNode that (using clipArea) shows only the parts of
 * OpticalAxisNode that are not occluded. It is intended to be layered in front of things that occlude the
 * optical axis (framed Objects, Images, and projection screen).
 *
 * Note that because the optical axis is dashed, we need to use clipArea instead of just drawing the relevant
 * line segments. If we were to draw line segments, the dash pattern would appear to move, and would not line
 * up with the (background) axis drawn by OpticalAxisNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import Representation from '../model/Representation.js';
import OpticalAxisNode, { OpticalAxisNodeOptions } from './OpticalAxisNode.js';
import GOQueryParameters from '../GOQueryParameters.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';

class OpticalAxisForegroundNode extends OpticalAxisNode {

  /**
   * @param opticPositionProperty
   * @param modelVisibleBoundsProperty
   * @param modelViewTransform
   * @param lightRaysProcessedEmitter
   * @param representationProperty
   * @param objectPositionProperty
   * @param objectNode
   * @param targetPositionProperty
   * @param targetNode
   * @param projectionScreen
   * @param providedOptions
   */
  constructor( opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               lightRaysProcessedEmitter: Emitter<[]>,
               representationProperty: IReadOnlyProperty<Representation>,
               objectPositionProperty: IReadOnlyProperty<Vector2>,
               objectNode: Node,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               targetNode: Node,
               projectionScreen: ProjectionScreen | null,
               providedOptions: OpticalAxisNodeOptions ) {

    const options = merge( {}, providedOptions );
    if ( GOQueryParameters.debugOpticalAxis ) {
      options.stroke = 'red';
    }

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

      if ( representationProperty.value.isFramedObject ) {

        const opticX = modelViewTransform.modelToViewX( opticPositionProperty.value.x );
        const objectX = modelViewTransform.modelToViewX( objectPositionProperty.value.x );
        const targetX = modelViewTransform.modelToViewX( targetPositionProperty.value.x );

        // For a framed object...
        if ( targetX > opticX ) {

          // If the Image is to the right of the optic, clipArea is 1 rectangle, between the Object and Image.
          clipArea = Shape.rectangle( objectX, minY, targetX - objectX, clipHeight );
        }
        else {

          // If the Image is to the left of the optic, clipArea requires 2 rectangles.

          // Determine the relative position of the Object and Image.
          const targetOnRight = ( targetX > objectX );

          // The first rectangle is between the thing on the right and the optic.
          const x1 = targetOnRight ? targetX : objectX;
          const clipWidth1 = opticX - x1;

          // The second rectangle is between the thing on the left and the left edge of the picture frame on the right.
          const x2 = targetOnRight ? objectX : targetX;
          const halfFrameWidth = ( targetOnRight ? targetNode.bounds.width : objectNode.visibleBounds.width ) / 2;
          const clipWidth2 = x1 - x2 - halfFrameWidth;

          clipArea = new Shape()
            .rect( x1, minY, clipWidth1, clipHeight )
            .rect( x2, minY, clipWidth2, clipHeight );
        }
      }
      else {
        //TODO https://github.com/phetsims/geometric-optics/issues/217 use different approach in LightSourceSceneNode,
        //  draw foreground segment instead of using clipArea

        // For a light source, clipArea is 1 rectangle, between the optic and the projection screen.
        const minX = modelViewTransform.modelToViewX( opticPositionProperty.value.x );
        assert && assert( projectionScreen );
        const maxX = modelViewTransform.modelToViewX( projectionScreen!.positionProperty.value.x );
        clipArea = Shape.rectangle( minX, minY, maxX - minX, clipHeight );
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

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisForegroundNode', OpticalAxisForegroundNode );

export default OpticalAxisForegroundNode;
