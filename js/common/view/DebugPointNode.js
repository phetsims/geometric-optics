// Copyright 2021, University of Colorado Boulder

/**
 * DebugPointNode is used for debugging the position of things in the UI. It displays a circle at a specified
 * point, and stays synchronized with that point.  Instances of this are enabled via query parameters.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import geometricOptics from '../../geometricOptics.js';

class DebugPointNode extends Circle {

  /**
   * @param {Property.<Vector2>} positionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * */
  constructor( positionProperty, modelViewTransform, options ) {

    assert && assert( positionProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      fill: 'white',
      radius: 2
    }, options );

    super( options.radius, options );

    // update position of disk
    positionProperty.link( position => {
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