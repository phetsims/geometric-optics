// Copyright 2021, University of Colorado Boulder

/**
 * FocalPointNode displays a focal point. Its position updates to match the model.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';

class FocalPointNode extends Node {

  /**
   * @param {Property.<Vector2>} focalPointProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( focalPointProperty: Property<Vector2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {}, options );

    assert && assert( !options.children );
    options.children = [ FocalPointNode.createIcon() ];

    super( options );

    focalPointProperty.link( focalPoint => {
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
   * @param {number} [radius]
   * @returns {Node}
   */
  public static createIcon( radius: number = 7 ) {
    const circleNode = new Circle( radius, {
      fill: GeometricOpticsColors.focalPointFillProperty,
      stroke: GeometricOpticsColors.focalPointStrokeProperty
    } );
    const centerPointNode = new Circle( 1.5, {
      fill: GeometricOpticsColors.focalPointStrokeProperty
    } );
    return new Node( {
      children: [ circleNode, centerPointNode ]
    } );
  }
}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;