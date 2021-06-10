// Copyright 2021, University of Colorado Boulder

/**
 * Create a cross to represent a focal point.
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const SIZE = GeometricOpticsConstants.FOCAL_POINT_SIZE;
const LINE_WIDTH = GeometricOpticsConstants.FOCAL_POINT_LINE_WIDTH;
const FILL = GeometricOpticsColorProfile.focalPointFillProperty;
const STROKE = GeometricOpticsColorProfile.focalPointStrokeProperty;

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
    options = merge(
      {
        size: SIZE,
        fill: FILL,
        stroke: STROKE,
        lineWidth: LINE_WIDTH,
        rotation: Math.PI / 4
      }, options );

    super( options );

    // focal point to the right of the optical element if the focal length is positive
    //const focalCrossNode = new PlusNode( plusNodeOptions );

    focalPoint.positionProperty.link( position => {
      super.center = modelViewTransform.modelToViewPosition( position );
    } );


    visibleProperty.linkAttribute( this, 'visible' );
  }

}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;
