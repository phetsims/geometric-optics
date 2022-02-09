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
import { Circle, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';

type FocalPointNodeOptions = {
  tandem: Tandem
};

class FocalPointNode extends Node {

  /**
   * @param pointProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( pointProperty: Property<Vector2>, modelViewTransform: ModelViewTransform2, providedOptions: FocalPointNodeOptions ) {

    const options = merge( {
      children: [ FocalPointNode.createIcon() ],
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    pointProperty.link( focalPoint => {
      this.center = modelViewTransform.modelToViewPosition( focalPoint );
    } );

    this.addLinkedElement( pointProperty, {
      tandem: options.tandem.createTandem( 'pointProperty' )
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