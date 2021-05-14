// Copyright 2021, University of Colorado Boulder

/**
 * Create a cross to represent a focal point.
 * @author Martin Veillette
 */

import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const SIZE = GeometricOpticsConstants.FOCAL_POINT_SIZE;
const LINE_WIDTH = GeometricOpticsConstants.FOCAL_POINT_LINE_WIDTH;
const FILL = GeometricOpticsColorProfile.focalPointFillProperty;
const STROKE = GeometricOpticsColorProfile.focalPointStrokeProperty;

class FocalPointNode extends Node {

  /**
   * @param {FocalPoint} focalPoint
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( focalPoint, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    // options for plus Node. Rotated by 45 degrees to create an X shape.
    const plusNodeOptions =
      {
        size: SIZE,
        fill: FILL,
        stroke: STROKE,
        lineWidth: LINE_WIDTH,
        rotation: Math.PI / 4
      };

    // focal point to the right of the optical element if the focal length is positive
    const focalCrossNode = new PlusNode( plusNodeOptions );

    focalPoint.positionProperty.link( position => {
      focalCrossNode.center = modelViewTransform.modelToViewPosition( position );
    } );

    this.addChild( focalCrossNode );
  }

}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;
