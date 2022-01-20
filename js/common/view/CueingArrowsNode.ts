// Copyright 2021-2022, University of Colorado Boulder

/**
 * CueingArrowsNode is the cueing arrows used to indicate that something can be dragged in some direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import Shape from '../../../../kite/js/Shape.js';
import GOConstants from '../GOConstants.js';

type CueingArrowsDirection = 'horizontal' | 'vertical' | 'both';

type CueingArrowsNodeOptions = {
  direction?: CueingArrowsDirection,
  length?: number,
} & PathOptions;

class CueingArrowsNode extends Path {

  // length of the arrows, from tip to tip
  private readonly length: number;

  /**
   * @param providedOptions
   */
  constructor( providedOptions?: CueingArrowsNodeOptions ) {

    const options = merge( {
      direction: 'both',
      length: 35,

      // Path options
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black'

    }, providedOptions );

    super( createArrowsShape( options.direction, options.length ), options );

    this.length = options.length;

    this.boundsProperty.link( () => {
      this.touchArea = this.localBounds;
      this.mouseArea = this.localBounds;
    } );
  }

  public setDirection( direction: CueingArrowsDirection ): void {
    this.shape = createArrowsShape( direction, this.length );
  }
}

function createArrowsShape( direction: CueingArrowsDirection, length: number ): Shape {

  const arrowShapeOptions = merge( {
    doubleHead: true
  }, GOConstants.CUEING_ARROW_SHAPE_OPTIONS );

  let shape;
  if ( direction === 'horizontal' ) {
    shape = new ArrowShape( -length / 2, 0, length / 2, 0, arrowShapeOptions );
  }
  else if ( direction === 'vertical' ) {
    shape = new ArrowShape( 0, -length / 2, 0, length / 2, arrowShapeOptions );
  }
  else {
    const leftRightArrowShape = new ArrowShape( -length / 2, 0, length / 2, 0, arrowShapeOptions );
    const upDownArrowShape = new ArrowShape( 0, -length / 2, 0, length / 2, arrowShapeOptions );
    shape = Shape.union( [ leftRightArrowShape, upDownArrowShape ] );
  }
  return shape;
}

geometricOptics.register( 'CueingArrowsNode', CueingArrowsNode );
export default CueingArrowsNode;