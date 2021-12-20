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
import GOConstants from '../GOConstants.js';

type Options = {
  length?: number,
  fill?: ColorDef,
  stroke?: ColorDef
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class UnconstrainedCueingArrowsNode extends Path {

  /**
   * @param providedOptions
   */
  constructor( providedOptions?: Options ) {

    const options = merge( {
      length: 38,

      // Path options
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black'

    }, providedOptions ) as Required<Options>;

    // The Shape is a union of 2 arrows.
    const arrowShapeOptions = merge( {
      doubleHead: true
    }, GOConstants.CUEING_ARROW_SHAPE_OPTIONS );
    const leftRightArrowShape = new ArrowShape( -options.length / 2, 0, options.length / 2, 0, arrowShapeOptions );
    const upDownArrowShape = new ArrowShape( 0, -options.length / 2, 0, options.length / 2, arrowShapeOptions );
    const shape = Shape.union( [ leftRightArrowShape, upDownArrowShape ] );

    super( shape, options );

    this.touchArea = this.localBounds;
    this.mouseArea = this.localBounds;
  }
}

geometricOptics.register( 'UnconstrainedCueingArrowsNode', UnconstrainedCueingArrowsNode );
export default UnconstrainedCueingArrowsNode;