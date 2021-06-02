// Copyright 2021, University of Colorado Boulder

/**
 * View for optical axis
 *
 * @author Sarah Chang, Swarthmore College
 */

import Line from '../../../../scenery/js/nodes/Line.js';
import geometricOptics from '../../geometricOptics.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_AXIS_LINE_WIDTH;
const STROKE = GeometricOpticsColorProfile.opticalAxisStrokeProperty;

class OpticalAxisNode extends Node {
  /**
   *
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( opticPositionProperty, modelViewTransform ) {
    super();
    const yPosition = modelViewTransform.modelToViewY( opticPositionProperty.value.y );
    const line = new Line( 0, yPosition, 1000, yPosition, {
      linewidth: LINE_WIDTH,
      stroke: STROKE
    } );
    opticPositionProperty.link( position => {
      const yView = modelViewTransform.modelToViewY( position.y );
      line.setY1( yView );
      line.setY2( yView );
    } );
    this.addChild( line );
  }
}

geometricOptics.register( 'OpticalAxisNode', OpticalAxisNode );

export default OpticalAxisNode;