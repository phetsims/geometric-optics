// Copyright 2021-2022, University of Colorado Boulder

/**
 * TwoFPointNode is the 2F point, whose distance from the optical is twice the focal length (f).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import { PickRequired } from '../GOTypes.js';

type TwoFPointNodeOptions = PickRequired<NodeOptions, 'tandem'>;

class TwoFPointNode extends Node {

  /**
   * @param pointProperty
   * @param modelViewTransform
   * @param provideOptions
   */
  constructor( pointProperty: Property<Vector2>, modelViewTransform: ModelViewTransform2, provideOptions: TwoFPointNodeOptions ) {

    const options = merge( {
      children: [ TwoFPointNode.createIcon() ],
      phetioVisiblePropertyInstrumented: false
    }, provideOptions );

    super( options );

    pointProperty.link( twoFPoint => {
      this.center = modelViewTransform.modelToViewPosition( twoFPoint );
    } );

    this.addLinkedElement( pointProperty, {
      tandem: options.tandem.createTandem( 'pointProperty' )
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