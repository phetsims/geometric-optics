// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Property from '../../../../axon/js/Property.js';

const SIZE = GeometricOpticsConstants.FOCAL_POINT_SIZE;
const LINE_WIDTH = GeometricOpticsConstants.FOCAL_POINT_LINE_WIDTH;
const FILL = GeometricOpticsColorProfile.focalPointFillProperty;
const STROKE = GeometricOpticsColorProfile.focalPointStrokeProperty;

class FocalPointsNode extends Node {

  /**
   * @param {Optic} optic
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( optic, modelViewTransform, tandem ) {
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
    const positiveFocalPoint = new PlusNode( plusNodeOptions );

    // focal point to the left of the optical element if the focal length is positive
    const negativeFocalPoint = new PlusNode( plusNodeOptions );

    Property.multilink( [ optic.positionProperty, optic.focalLengthProperty ], ( position, focalLength ) => {
      positiveFocalPoint.center = modelViewTransform.modelToViewPosition( position.plusXY( focalLength, 0 ) );
      negativeFocalPoint.center = modelViewTransform.modelToViewPosition( position.plusXY( -focalLength, 0 ) );
    } );

    this.addChild( positiveFocalPoint );
    this.addChild( negativeFocalPoint );
  }

}

geometricOptics.register( 'FocalPointsNode', FocalPointsNode );
export default FocalPointsNode;
