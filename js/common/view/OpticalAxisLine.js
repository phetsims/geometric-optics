// Copyright 2021, University of Colorado Boulder

/**
 * View for optical axis
 *
 * @author Sarah Chang, Swarthmore College
 */

import Line from '../../../../scenery/js/nodes/Line.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_AXIS_LINE_WIDTH;
const STROKE = GeometricOpticsColorProfile.opticalAxisStrokeProperty;

class OpticalAxisLine extends Line {
  /**
   *
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Bounds2} screenViewBounds
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( opticPositionProperty, screenViewBounds, modelViewTransform ) {

    // determine initial position of line in view
    const yPosition = modelViewTransform.modelToViewY( opticPositionProperty.value.y );

    // set min and max X to extend far beyond sim bounds
    const lineMinX = screenViewBounds.minX - screenViewBounds.width;
    const lineMaxX = screenViewBounds.maxX + screenViewBounds.width;

    // create optical axis line
    super( lineMinX, yPosition, lineMaxX, yPosition, {
      lineWidth: LINE_WIDTH,
      stroke: STROKE
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
