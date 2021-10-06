// Copyright 2021, University of Colorado Boulder

/**
 * LightRaySegment describes one line segment of a light ray, in model coordinates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

class LightRaySegment {

  /**
   * @param {Vector2} startPoint
   * @param {Vector2} endPoint
   */
  constructor( startPoint, endPoint ) {

    // @public (read-only)
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }
}

geometricOptics.register( 'LightRaySegment', LightRaySegment );
export default LightRaySegment;