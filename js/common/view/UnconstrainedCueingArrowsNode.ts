// Copyright 2021, University of Colorado Boulder

/**
 * UnconstrainedCueingArrowsNode is the cueing arrows used to indicate that something can be dragged unconstrained.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import Shape from '../../../../kite/js/Shape.js';

class UnconstrainedCueingArrowsNode extends Path {

  constructor( options?: any ) {

    options = merge( {
      length: 45,

      // ArrowShape options
      arrowShapeOptions: {
        doubleHead: true,
        tailWidth: 5,
        headWidth: 15,
        headHeight: 10
      },

      // Path options
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black',
      lineWidth: 1

    }, options );

    // The Shape is a union of 2 arrows.
    const leftRightArrowShape = new ArrowShape( -options.length / 2, 0, options.length / 2, 0, options.arrowShapeOptions );
    const upDownArrowShape = new ArrowShape( 0, -options.length / 2, 0, options.length / 2, options.arrowShapeOptions );
    const shape = Shape.union( [ leftRightArrowShape, upDownArrowShape ] );

    super( shape, options );

    this.touchArea = this.localBounds;
    this.mouseArea = this.localBounds;
  }
}

geometricOptics.register( 'UnconstrainedCueingArrowsNode', UnconstrainedCueingArrowsNode );
export default UnconstrainedCueingArrowsNode;