// Copyright 2021, University of Colorado Boulder

/**
 * FocalPointNode displays a focal point. Its position updates to match the model.
 *
 * @author Martin Veillette
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import FocalPoint from '../model/FocalPoint.js';

// constants
const DEFAULT_OPTIONS = {
  size: new Dimension2( 15, 3 ),  // width of the X sign and "thickness" in X sign
  lineWidth: 1,
  fill: GeometricOpticsColors.focalPointFillProperty,
  stroke: GeometricOpticsColors.focalPointStrokeProperty,
  rotation: Math.PI / 4  // rotated by 45 degrees to create an X shape.
};

class FocalPointNode extends PlusNode {

  /**
   * @param {FocalPoint} focalPoint
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( focalPoint, modelViewTransform, options ) {

    assert && assert( focalPoint instanceof FocalPoint );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {}, DEFAULT_OPTIONS, options );

    super( options );

    // update the position of this node
    focalPoint.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  /**
   * Returns an icon for the focal point
   * @public
   * @param {Object} [options] - options for PlusNode
   * @returns {Node}
   */
  static createIcon( options ) {
    return new PlusNode( merge( {}, DEFAULT_OPTIONS, options ) );
  }
}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;