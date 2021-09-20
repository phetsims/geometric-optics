// Copyright 2021, University of Colorado Boulder

/**
 * View for visual tracking of an object
 * Most often used by QueryParameters to illustrate the position of a point or an object.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import geometricOptics from '../../geometricOptics.js';

class TrackingDiskNode extends Circle {

  /**
   * @param {Property.<Vector2>} positionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * */
  constructor( positionProperty, modelViewTransform, options ) {

    assert && assert( positionProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      fill: 'white', // {color} fill of disk
      radius: 2 // {number} radius of disk in view coordinates.
    }, options );

    super( options.radius, options );

    // update position of disk
    positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

geometricOptics.register( 'TrackingDiskNode', TrackingDiskNode );
export default TrackingDiskNode;