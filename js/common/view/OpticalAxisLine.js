// Copyright 2021, University of Colorado Boulder

/**
 * View for optical axis
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Line from '../../../../scenery/js/nodes/Line.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

// constants
const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_AXIS_LINE_WIDTH;
const STROKE = GeometricOpticsColors.opticalAxisStrokeProperty;

class OpticalAxisLine extends Line {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( opticPositionProperty, visibleModelBoundsProperty, modelViewTransform ) {

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, {
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );

    // set the horizontal extent of the optical axis line
    visibleModelBoundsProperty.link( bounds => {
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
}

geometricOptics.register( 'OpticalAxisLine', OpticalAxisLine );

export default OpticalAxisLine;
