// Copyright 2021, University of Colorado Boulder

/**
 * Scenery Node of a X shape representing a focal point.
 * Visibility and position of the focal point can be updated.
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class FocalPointNode extends PlusNode {

  /**
   * @param {FocalPoint} focalPoint
   * @param {Property.<boolean>} visibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( focalPoint, visibleProperty, modelViewTransform, options ) {

    // options for plus Node. Rotated by 45 degrees to create an X shape.
    options = merge( {}, GeometricOpticsConstants.FOCAL_POINT_OPTIONS,
      {
        fill: GeometricOpticsColors.focalPointFillProperty,
        stroke: GeometricOpticsColors.focalPointStrokeProperty,

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
   * Returns an icon for the focal point
   * @public
   * @param {Object} [options]
   * @returns {PlusNode}
   */
  static createIcon( options ) {

    options = merge( {}, GeometricOpticsConstants.FOCAL_POINT_OPTIONS, {
      fill: GeometricOpticsColors.focalPointFillProperty,
      stroke: GeometricOpticsColors.focalPointStrokeProperty,
      rotation: Math.PI / 4
    }, options );

    return new PlusNode( options );
  }
}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;