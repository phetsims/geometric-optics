// Copyright 2021-2025, University of Colorado Boulder

/**
 * TwoFPointNode is the 2F point, whose distance from the optical is twice the focal length (f).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';

type SelfOptions = EmptySelfOptions;

type TwoFPointNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class TwoFPointNode extends Node {

  public constructor( pointProperty: ReadOnlyProperty<Vector2>, modelViewTransform: ModelViewTransform2,
                      provideOptions: TwoFPointNodeOptions ) {

    const options = optionize<TwoFPointNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ TwoFPointNode.createIcon() ],
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, provideOptions );

    super( options );

    pointProperty.link( twoFPoint => {
      this.center = modelViewTransform.modelToViewPosition( twoFPoint );
    } );

    this.addLinkedElement( pointProperty );
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
}

geometricOptics.register( 'TwoFPointNode', TwoFPointNode );