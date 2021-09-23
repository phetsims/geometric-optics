// Copyright 2021, University of Colorado Boulder

/**
 * View for optical axis
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class OpticalAxisLine extends Line {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( opticPositionProperty, modelBoundsProperty, modelViewTransform ) {

    assert && assert( opticPositionProperty instanceof Property );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, {
      lineWidth: GeometricOpticsConstants.OPTICAL_AXIS_LINE_WIDTH,
      stroke: GeometricOpticsColors.opticalAxisStrokeProperty
    } );

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

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisLine', OpticalAxisLine );

export default OpticalAxisLine;
