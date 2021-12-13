// Copyright 2021, University of Colorado Boulder

/**
 * FocalPointNode displays a focal point. Its position updates to match the model.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';

class FocalPointNode extends Node {

  /**
   * @param focalPointProperty
   * @param modelViewTransform
   */
  constructor( focalPointProperty: IReadOnlyProperty<Vector2>, modelViewTransform: ModelViewTransform2 ) {

    super( {
      children: [ FocalPointNode.createIcon() ]
    } );

    focalPointProperty.link( focalPoint => {
      this.center = modelViewTransform.modelToViewPosition( focalPoint );
    } );
  }

  /**
   * Returns an icon for the focal point
   * @param radius
   */
  public static createIcon( radius: number = 7 ): Node {
    const circleNode = new Circle( radius, {
      fill: GOColors.focalPointFillProperty,
      stroke: GOColors.focalPointStrokeProperty
    } );
    const centerPointNode = new Circle( 2, {
      fill: GOColors.focalPointStrokeProperty
    } );
    return new Node( {
      children: [ circleNode, centerPointNode ]
    } );
  }

  /**
   * @override
   */
  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'FocalPointNode', FocalPointNode );
export default FocalPointNode;