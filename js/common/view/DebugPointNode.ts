// Copyright 2021, University of Colorado Boulder

//TODO make this go away
/**
 * DebugPointNode is used for debugging the position of things in the UI. It displays a circle at a specified
 * point, and stays synchronized with that point.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';

const RADIUS = 2;

type DebugPointNodeOptions = {
  fill?: ColorDef
};

class DebugPointNode extends Circle {

  /**
   * @param positionProperty
   * @param modelViewTransform
   * @param options
   * */
  constructor( positionProperty: IReadOnlyProperty<Vector2>, modelViewTransform: ModelViewTransform2, options?: DebugPointNodeOptions ) {

    options = merge( {
      fill: 'red'
    }, options ) as Required< DebugPointNodeOptions >;

    super( RADIUS, options );

    // update position of disk
    positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'DebugPointNode', DebugPointNode );
export default DebugPointNode;