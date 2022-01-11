// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisForegroundNode is a subclass of OpticalAxisNode that (using clipArea) shows only the parts of
 * OpticalAxisNode that are not occluded. It is intended to be layered in front of things that occlude the
 * optical axis (framed objects, images, and projection screen).
 *
 * Note that because the optical axis is dashed, we need to use clipArea instead of just drawing the relevant
 * line segments. If we were to draw line segments, the dash pattern would appear to move, and would not line
 * up with the (background) axis drawn by OpticalAxisNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import Barrier from '../model/Barrier.js';
import Representation from '../model/Representation.js';
import OpticalAxisNode, { OpticalAxisNodeOptions } from './OpticalAxisNode.js';
import GOQueryParameters from '../GOQueryParameters.js';
import Emitter from '../../../../axon/js/Emitter.js';

class OpticalAxisForegroundNode extends OpticalAxisNode {

  /**
   * @param lightRaysProcessedEmitter
   * @param opticPositionProperty
   * @param representationProperty
   * @param sourceObjectPositionProperty
   * @param targetPositionProperty
   * @param barrier
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param targetNodeBoundsProperty
   * @param providedOptions
   */
  constructor( lightRaysProcessedEmitter: Emitter<[]>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               representationProperty: IReadOnlyProperty<Representation>,
               sourceObjectPositionProperty: IReadOnlyProperty<Vector2>,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               barrier: Barrier | null,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               targetNodeBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: OpticalAxisNodeOptions ) {

    const options = merge( {}, providedOptions ) as OpticalAxisNodeOptions;
    if ( GOQueryParameters.debugOpticalAxis ) {
      options.stroke = 'red';
    }

    // create optical axis line, with arbitrary length values.
    super( opticPositionProperty, modelBoundsProperty, modelViewTransform, options );

    // If there is no barrier (as in the Mirror screen), then create an artificial barrier position that is just
    // to the right of the model bounds, and therefore out of view.
    const barrierPositionProperty = barrier ?
                                    barrier.positionProperty :
                                    new DerivedProperty( [ modelBoundsProperty ], ( modelBounds: Bounds2 ) =>
                                      new Vector2( modelBounds.right + 1, modelBounds.centerX ) );

    // Update the clipArea, used to show only the part(s) of the optical axis that are in the foreground.
    // While it may seem a bit odd to be listening to the light rays, this is an optimization. When computation
    // of the light rays has completed, we know that other things are in their final positions, and therefore
    // don't end up computing intermediate states as things move around.
    lightRaysProcessedEmitter.addListener( () => {

      const opticPosition = opticPositionProperty.value;
      const sourceObjectPosition = sourceObjectPositionProperty.value;
      const targetPosition = targetPositionProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( modelBoundsProperty.value );
      const minY = viewBounds.minY;
      const maxY = viewBounds.maxY;
      const clipHeight = maxY - minY;

      let clipArea: Shape;
      if ( representationProperty.value.isObject ) {

        // For a source object...
        if ( targetPosition.x > opticPosition.x ) {

          // If the image is to the right of the optic, clipArea is 1 rectangle, between the object and image.
          const minX = modelViewTransform.modelToViewX( sourceObjectPosition.x );
          const maxX = modelViewTransform.modelToViewX( targetPosition.x );
          const clipWidth = maxX - minX;
          clipArea = Shape.rectangle( minX, minY, clipWidth, clipHeight );
        }
        else {

          // If the image is to the left of the optic, clipArea requires 2 rectangles.

          // Determine the relative position of the source object and image.
          const targetToRight = ( targetPosition.x > sourceObjectPosition.x );
          const leftPosition = targetToRight ? sourceObjectPosition : targetPosition;
          const rightPosition = targetToRight ? targetPosition : sourceObjectPosition;

          // The first rectangle is between the thing on the right and the optic.
          const x1 = modelViewTransform.modelToViewX( rightPosition.x );
          const clipWidth1 = modelViewTransform.modelToViewX( opticPosition.x ) - x1;

          // The second rectangle is between the thing on the left and the left edge of the picture frame on the right.
          const x2 = modelViewTransform.modelToViewX( leftPosition.x );
          const halfFrameWidth = targetNodeBoundsProperty.value.width / 2;
          const clipWidth2 = modelViewTransform.modelToViewX( rightPosition.x ) - halfFrameWidth - x2;

          clipArea = new Shape()
            .rect( x1, minY, clipWidth1, clipHeight )
            .rect( x2, minY, clipWidth2, clipHeight );
        }
      }
      else {

        // For a light source, clipArea is 1 rectangle, between the optic and the projection screen.
        const minX = modelViewTransform.modelToViewX( opticPosition.x );
        const maxX = modelViewTransform.modelToViewX( barrierPositionProperty.value.x );
        clipArea = Shape.rectangle( minX, minY, maxX - minX, maxY - minY );
      }
      this.clipArea = clipArea;
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisForegroundNode', OpticalAxisForegroundNode );

export default OpticalAxisForegroundNode;
