// Copyright 2021, University of Colorado Boulder

/**
 * FocalPointNode displays a focal point. Its position updates to match the model.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlusShape from '../../../../scenery-phet/js/PlusShape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';

// constants
const DEFAULT_OPTIONS = {
  size: new Dimension2( 15, 3 ), // width of the X sign and "thickness" in X sign

  // Path options
  lineWidth: 1,
  fill: GeometricOpticsColors.focalPointFillProperty,
  stroke: GeometricOpticsColors.focalPointStrokeProperty
};

class FocalPointNode extends Node {

  /**
   * @param {Property.<Vector2>} focalPointProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( focalPointProperty: Property<Vector2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {}, DEFAULT_OPTIONS, options );

    assert && assert( !options.children );
    options.children = [ FocalPointNode.createIcon( options ) ];

    super( options );

    focalPointProperty.link( ( focalPoint: Vector2 ) => {
      this.center = modelViewTransform.modelToViewPosition( focalPoint );
    } );
  }

  /**
   * @override
   */
  public dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Returns an icon for the focal point
   * @param {Object} [options] - options for Path
   * @returns {Node}
   */
  public static createIcon( options?: any ) { //TYPESCRIPT any
    options = merge( {}, DEFAULT_OPTIONS, options );
    let shape = new PlusShape( options.size );
    shape = shape.transformed( Matrix3.rotation2( Math.PI / 4 ) );
    return new Path( shape, options );
  }
}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;