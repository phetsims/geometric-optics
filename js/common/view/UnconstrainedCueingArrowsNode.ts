// Copyright 2021, University of Colorado Boulder

/**
 * UnconstrainedCueingArrowsNode is the cueing arrows used to indicate that something can be dragged unconstrained.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import merge from '../../../../phet-core/js/merge.js';
import { NodeOptions, Path } from '../../../../scenery/js/imports.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import Shape from '../../../../kite/js/Shape.js';

const ARROW_SHAPE_OPTIONS = {
  doubleHead: true,
  tailWidth: 5,
  headWidth: 15,
  headHeight: 10
};

type Options = {
  length?: number,
  fill?: ColorDef,
  stroke?: ColorDef
} & NodeOptions; //TODO would prefer to limit to Node translation options

class UnconstrainedCueingArrowsNode extends Path {

  constructor( providedOptions?: Options ) {

    const options = merge( {
      length: 45,

      // Path options
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black'

    }, providedOptions ) as Required<Options>;

    // The Shape is a union of 2 arrows.
    const leftRightArrowShape = new ArrowShape( -options.length / 2, 0, options.length / 2, 0, ARROW_SHAPE_OPTIONS );
    const upDownArrowShape = new ArrowShape( 0, -options.length / 2, 0, options.length / 2, ARROW_SHAPE_OPTIONS );
    const shape = Shape.union( [ leftRightArrowShape, upDownArrowShape ] );

    super( shape, options );

    this.touchArea = this.localBounds;
    this.mouseArea = this.localBounds;
  }
}

geometricOptics.register( 'UnconstrainedCueingArrowsNode', UnconstrainedCueingArrowsNode );
export default UnconstrainedCueingArrowsNode;