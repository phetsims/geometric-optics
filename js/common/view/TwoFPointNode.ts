// Copyright 2021, University of Colorado Boulder

/**
 * TwoFPointNode is the 2F point, whose distance from the optical is twice the focal length (f).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';

class TwoFPointNode extends Node {

  /**
   * @param pointProperty
   * @param modelViewTransform
   */
  constructor( pointProperty: IReadOnlyProperty<Vector2>, modelViewTransform: ModelViewTransform2 ) {

    super( {
      children: [ TwoFPointNode.createIcon() ]
    } );

    pointProperty.link( point => {
      this.center = modelViewTransform.modelToViewPosition( point );
    } );
  }

  /**
   * Returns an icon for the 2F point
   * @param radius
   */
  public static createIcon( radius: number = 5 ): Node {
    return new Circle( radius, {
      fill: GOColors.twoFPointFillProperty,
      stroke: GOColors.twoFPointStrokeProperty
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

geometricOptics.register( 'TwoFPointNode', TwoFPointNode );
export default TwoFPointNode;