// Copyright 2021-2025, University of Colorado Boulder

/**
 * FocalPointNode displays a focal point. Its position updates to match the model.
 *
 * @author Martin Veillette
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

type FocalPointNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class FocalPointNode extends Node {

  public constructor( pointProperty: ReadOnlyProperty<Vector2>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: FocalPointNodeOptions ) {

    const options = optionize<FocalPointNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      children: [ FocalPointNode.createIcon() ],
      phetioVisiblePropertyInstrumented: false,
      isDisposable: false
    }, providedOptions );

    super( options );

    pointProperty.link( focalPoint => {
      this.center = modelViewTransform.modelToViewPosition( focalPoint );
    } );

    this.addLinkedElement( pointProperty );
  }

  /**
   * Returns an icon for the focal point
   */
  public static createIcon( radius = 7 ): Node {
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
}

geometricOptics.register( 'FocalPointNode', FocalPointNode );