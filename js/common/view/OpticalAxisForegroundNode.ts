// Copyright 2021, University of Colorado Boulder

/**
 * OpticalAxisForegroundNode is the part of the optical axis that is not occluded by things in the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import GOConstants from '../GOConstants.js';
import Barrier from '../model/Barrier.js';
import Representation from '../model/Representation.js';

type Options = {
  visibleProperty: IProperty<boolean>
};

class OpticalAxisForegroundNode extends Line {

  /**
   * @param opticPositionProperty
   * @param representationProperty
   * @param sourceObjectPositionProperty
   * @param targetPositionProperty
   * @param isVirtualProperty
   * @param barrier
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( opticPositionProperty: IReadOnlyProperty<Vector2>,
               representationProperty: IReadOnlyProperty<Representation>,
               sourceObjectPositionProperty: IReadOnlyProperty<Vector2>,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               isVirtualProperty: IReadOnlyProperty<boolean>,
               barrier: Barrier | null,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               options?: Options ) {

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, merge( {
      stroke: phet.chipper.queryParameters.dev ? 'red' : GOColors.opticalAxisStrokeProperty,
      lineWidth: GOConstants.AXIS_LINE_WIDTH,
      lineDash: GOConstants.AXIS_LINE_DASH
    }, options ) );

    // set the horizontal extent of the optical axis line
    modelBoundsProperty.link( bounds => {
      this.setX1( modelViewTransform.modelToViewX( bounds.left ) );
      this.setX2( modelViewTransform.modelToViewX( bounds.right ) );
    } );

    // update y-position of line based on position of optic
    opticPositionProperty.link( position => {
      const yView = modelViewTransform.modelToViewY( position.y );
      this.setY1( yView );
      this.setY2( yView );
    } );

    //TODO this is a hack for dealing with the fact that the Mirror screen doesn't have a ProjectionScreen
    let barrierPositionProperty;
    if ( barrier ) {
      barrierPositionProperty = barrier.positionProperty;
    }
    else {
      barrierPositionProperty = new DerivedProperty( [ modelBoundsProperty ],
        ( modelBounds: Bounds2 ) => new Vector2( modelBounds.right, modelBounds.centerX ) );
    }

    // Clip area
    Property.multilink(
      [ opticPositionProperty, representationProperty, sourceObjectPositionProperty, targetPositionProperty,
        barrierPositionProperty, isVirtualProperty, modelBoundsProperty ],
      ( opticPosition: Vector2, representation: Representation, sourceObjectPosition: Vector2, targetPosition: Vector2,
        barrierPosition: Vector2, isVirtual: boolean, modelBounds: Bounds2 ) => {
        const minY = modelViewTransform.modelToViewY( modelBounds.minY );
        const maxY = modelViewTransform.modelToViewY( modelBounds.maxY );
        const clipHeight = maxY - minY;
        if ( representation.isObject ) {

          // For a source object...
          if ( targetPosition.x < opticPosition.x ) {

            // For a source object and virtual image, clipArea is 2 rectangles.
            // The first rectangle is between the object and optic.
            const x1 = modelViewTransform.modelToViewX( sourceObjectPosition.x );
            const clipWidth1 = modelViewTransform.modelToViewX( opticPosition.x ) - x1;

            // The second rectangle is between the image and left edge of the picture frame.
            const x2 = modelViewTransform.modelToViewX( targetPosition.x );
            const halfFrameWidth = 34; //TODO either add sourceObject.width to model, or get this from sourceObjectNode
            const clipWidth2 = modelViewTransform.modelToViewX( sourceObjectPosition.x ) - halfFrameWidth - x2;

            this.clipArea = new Shape()
              .rect( x1, minY, clipWidth1, clipHeight )
              .rect( x2, minY, clipWidth2, clipHeight );
          }
          else {

            // For a source object and real image, clipAra is 1 rectangle, between the object and image.
            const minX = modelViewTransform.modelToViewX( sourceObjectPosition.x );
            const maxX = modelViewTransform.modelToViewX( targetPosition.x );
            const clipWidth = maxX - minX;
            this.clipArea = Shape.rectangle( minX, minY, clipWidth, clipHeight );
          }
        }
        else {

          // For a light source, clipArea is 1 rectangle, between the optic and the projection screen.
          const minX = modelViewTransform.modelToViewX( opticPosition.x );
          const maxX = modelViewTransform.modelToViewX( barrierPosition.x );
          this.clipArea = Shape.rectangle( minX, minY, maxX - minX, maxY - minY );
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
