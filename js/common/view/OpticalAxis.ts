// Copyright 2021, University of Colorado Boulder

/**
 * OpticalAxis is the horizontal line that passes through the geometric center of a lens or mirror.
 * It is referred to as 'optical axis', or sometimes as 'principal axis'.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class OpticalAxis extends Line {

  /**
   * @param opticPositionProperty
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( opticPositionProperty: Property<Vector2>, modelBoundsProperty: Property<Bounds2>,
               modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {
      stroke: GeometricOpticsColors.opticalAxisStrokeProperty,
      lineWidth: GeometricOpticsConstants.AXIS_LINE_WIDTH,
      lineDash: GeometricOpticsConstants.AXIS_LINE_DASH
    }, options );

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, options );

    // set the horizontal extent of the optical axis line
    modelBoundsProperty.link( bounds => {
      this.setX1( modelViewTransform.modelToViewX( bounds.minX ) );
      this.setX2( modelViewTransform.modelToViewX( bounds.maxX ) );
    } );

    // update y-position of line based on position of optic
    opticPositionProperty.link( position => {
      const yView = modelViewTransform.modelToViewY( position.y );
      this.setY1( yView );
      this.setY2( yView );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxis', OpticalAxis );

export default OpticalAxis;
