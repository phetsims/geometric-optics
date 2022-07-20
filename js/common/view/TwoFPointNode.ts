// Copyright 2021-2022, University of Colorado Boulder

/**
 * TwoFPointNode is the 2F point, whose distance from the optical is twice the focal length (f).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type TwoFPointNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class TwoFPointNode extends Node {

  public constructor( pointProperty: ReadOnlyProperty<Vector2>, modelViewTransform: ModelViewTransform2,
                      provideOptions: TwoFPointNodeOptions ) {

    const options = optionize<TwoFPointNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ TwoFPointNode.createIcon() ],
      phetioVisiblePropertyInstrumented: false
    }, provideOptions );

    super( options );

    pointProperty.link( twoFPoint => {
      this.center = modelViewTransform.modelToViewPosition( twoFPoint );
    } );

    this.addLinkedElement( pointProperty, {
      tandem: options.tandem.createTandem( pointProperty.tandem.name )
    } );
  }

  /**
   * Returns an icon for the 2F point
   */
  public static createIcon( radius = 5 ): Node {
    return new Circle( radius, {
      fill: GOColors.twoFPointFillProperty,
      stroke: GOColors.twoFPointStrokeProperty
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'TwoFPointNode', TwoFPointNode );