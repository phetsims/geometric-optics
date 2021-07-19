// Copyright 2021, University of Colorado Boulder

/**
 * Scenery Node of a X shape representing a focal point.
 * Visibility and position of the focal point can be updated.
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsColorProfile from '../geometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const FOCAL_POINT_OPTIONS = GeometricOpticsConstants.FOCAL_POINT_OPTIONS;
const FILL = geometricOpticsColorProfile.focalPointFillProperty;
const STROKE = geometricOpticsColorProfile.focalPointStrokeProperty;

class FocalPointNode extends PlusNode {

  /**
   * @param {FocalPoint} focalPoint
   * @param {Property.<boolean>} visibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( focalPoint, visibleProperty, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // options for plus Node. Rotated by 45 degrees to create an X shape.
    options = merge( FOCAL_POINT_OPTIONS,
      {
        fill: FILL,
        stroke: STROKE,

        rotation: Math.PI / 4
      }, options );

    super( options );

    // update the position of this node
    focalPoint.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    // update the visibility of this node
    visibleProperty.linkAttribute( this, 'visible' );
  }

  /**
   * @public
   * @param {Object} [options]
   * @returns {PlusNode}
   */
  static createIcon( options ) {
    options = merge( FOCAL_POINT_OPTIONS,
      {
        fill: FILL,
        stroke: STROKE,

        rotation: Math.PI / 4
      }, options );

    return new PlusNode( options );
  }


}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;
