// Copyright 2021, University of Colorado Boulder

/**
 * TODO
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
   * @param barrier
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( opticPositionProperty: IReadOnlyProperty<Vector2>,
               representationProperty: IReadOnlyProperty<Representation>,
               sourceObjectPositionProperty: IReadOnlyProperty<Vector2>,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               barrier: Barrier | null,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               options?: Options ) {

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, merge( {
      stroke: GOColors.opticalAxisStrokeProperty,
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
      [ representationProperty, sourceObjectPositionProperty, targetPositionProperty, barrierPositionProperty, modelBoundsProperty ],
      ( representation: Representation, sourceObjectPosition: Vector2, targetPosition: Vector2, barrierPosition: Vector2, modelBounds: Bounds2 ) => {
        let minX;
        let maxX;
        const minY = modelViewTransform.modelToViewY( modelBounds.minY );
        const maxY = modelViewTransform.modelToViewY( modelBounds.maxY );
        if ( representation.isObject ) {
          minX = modelViewTransform.modelToViewX( sourceObjectPosition.x );
          maxX = modelViewTransform.modelToViewX( targetPosition.x );
        }
        else {
          minX = modelViewTransform.modelToViewX( modelBoundsProperty.value.left );
          maxX = modelViewTransform.modelToViewX( barrierPosition.x );
        }
        this.clipArea = Shape.rectangle( minX, minY, maxX - minX, maxY - minY );
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisForegroundNode', OpticalAxisForegroundNode );

export default OpticalAxisForegroundNode;
