// Copyright 2021, University of Colorado Boulder

/**
 * DebugPointNode is used for debugging the position of things in the UI. It displays a circle at a specified
 * point, and stays synchronized with that point.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import geometricOptics from '../../geometricOptics.js';

// The API is limited to these options. Other superclass options are not allowed.
type DebugPointNodeOptions = {
  fill?: ColorDef
  radius?: number
};

class DebugPointNode extends Circle {

  /**
   * @param {Property.<Vector2>} positionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [providedOptions]
   * */
  constructor( positionProperty: Property<Vector2>, modelViewTransform: ModelViewTransform2, providedOptions: DebugPointNodeOptions ) {

    const options = merge( {
      fill: 'white',
      radius: 2
    } as DebugPointNodeOptions, providedOptions ) as Required< DebugPointNodeOptions >;

    super( options.radius, options );

    // update position of disk
    positionProperty.link( ( position: Vector2 ) => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'DebugPointNode', DebugPointNode );
export default DebugPointNode;
export { DebugPointNodeOptions };