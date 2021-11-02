// Copyright 2021, University of Colorado Boulder

/**
 * LightRaySegment describes one line segment of a light ray, in model coordinates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';

class LightRaySegment {

  readonly startPoint: Vector2;
  readonly endPoint: Vector2;

  /**
   * @param {Vector2} startPoint
   * @param {Vector2} endPoint
   */
  constructor( startPoint: Vector2, endPoint: Vector2 ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }
}

geometricOptics.register( 'LightRaySegment', LightRaySegment );
export default LightRaySegment;