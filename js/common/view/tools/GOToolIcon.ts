// Copyright 2022, University of Colorado Boulder

/**
 * GOToolIcon is the abstract base class for icons that appears in the toolbox.
 * An icon is associated with a specific tool Node, and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import GOToolNode from './GOToolNode.js';
                                                   
type SelfOptions = {
  touchAreaDilationX?: number;
  touchAreaDilationY?: number;
  mouseAreaDilationX?: number;
  mouseAreaDilationY?: number;
};

export type GOToolIconOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

abstract class GOToolIcon extends Node {

  /**
   * @param contentNode - the icon's content, what it looks like
   * @param toolNode
   * @param zoomTransformProperty
   * @param providedOptions
   */
  protected constructor( contentNode: Node,
                         toolNode: GOToolNode,
                         zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
                         providedOptions: GOToolIconOptions ) {

    const options = optionize<GOToolIconOptions, SelfOptions, NodeOptions>( {

      // pointer areas
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5,

      // NodeOptions
      children: [ contentNode ],
      cursor: 'pointer',
      tagName: 'button'
    }, providedOptions );

    super( options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    // Change contentNode.visible instead of this.visible, so that iO clients can hide toolbox icons.
    toolNode.tool.isInToolboxProperty.link( isInToolbox => {
      contentNode.visible = isInToolbox;
    } );

    // When the icon is clicked via the keyboard, take the ruler out of the toolbox, and place it at the model origin.
    this.addInputListener( {
      click: () => {
        toolNode.tool.isInToolboxProperty.value = false;
        toolNode.tool.positionProperty.value = Vector2.ZERO;
        toolNode.focus();
      }
    } );
  }
}

geometricOptics.register( 'GOToolIcon', GOToolIcon );
export default GOToolIcon;