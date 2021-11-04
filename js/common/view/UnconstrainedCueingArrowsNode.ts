// Copyright 2021, University of Colorado Boulder

/**
 * UnconstrainedCueingArrowsNode is the cueing arrows used to indicate that something can be dragged unconstrained.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
import geometricOptics from '../../geometricOptics.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';

class UnconstrainedCueingArrowsNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TODO-TS any

    options = merge( {
      length: 45,
      arrowNodeOptions: {
        doubleHead: true,
        tailWidth: 5,
        headWidth: 15,
        headHeight: 10,
        fill: 'rgb( 0, 200, 0 )',
        stroke: 'black',
        lineWidth: 1
      }
    }, options );

    const cueingArrowsUpDown = new ArrowNode( 0, 0, 0, options.length, options.arrowNodeOptions );
    const cueingArrowsLeftRight = new ArrowNode( 0, 0, options.length, 0, merge( {
      center: cueingArrowsUpDown.center
    }, options.arrowNodeOptions ) );

    assert && assert( !options.children );
    options.children = [ cueingArrowsUpDown, cueingArrowsLeftRight ];

    super( options );

    this.touchArea = this.localBounds;
    this.mouseArea = this.localBounds;
  }
}

geometricOptics.register( 'UnconstrainedCueingArrowsNode', UnconstrainedCueingArrowsNode );
export default UnconstrainedCueingArrowsNode;