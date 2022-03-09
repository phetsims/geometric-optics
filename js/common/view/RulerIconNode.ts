// Copyright 2021-2022, University of Colorado Boulder

/**
 * RulerIconNode is a ruler icon that appears in the toolbox. It is associated with a specific ruler Node,
 * and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, PressListenerEvent } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GORulerNode from './GORulerNode.js';

// constants
const ICON_WIDTH = 48;
const ICON_HEIGHT = 17;
const NUMBER_OF_MAJOR_TICKS = 5;

class RulerIconNode extends RulerNode {

  /**
   * @param rulerNode
   * @param zoomTransformProperty
   */
  constructor( rulerNode: GORulerNode, zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2> ) {

    const ruler = rulerNode.ruler;

    const options = {

      // pointer areas
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5,

      // RulerNodeOptions
      backgroundLineWidth: 0.5,
      majorTickLineWidth: 0.5,
      minorTickLineWidth: 0.25,
      minorTicksPerMajorTick: 5,
      majorTickHeight: ( 0.6 * ICON_HEIGHT ) / 2,
      minorTickHeight: ( 0.4 * ICON_HEIGHT ) / 2,
      insetsWidth: 0,

      // NodeOptions
      cursor: 'pointer',
      tagName: 'button',
      tandem: Tandem.OPT_OUT
    };

    // major ticks have no labels, it would be too much detail in an icon
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < NUMBER_OF_MAJOR_TICKS; i++ ) {
      majorTickLabels.push( '' );
    }
    const majorTickWidth = ICON_WIDTH / ( majorTickLabels.length - 1 );

    // no units, it would be too much detail in an icon
    const units = '';

    super( ICON_WIDTH, ICON_HEIGHT, majorTickWidth, majorTickLabels, units, options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    // rotate to create a vertical ruler icon
    if ( ruler.orientation === 'vertical' ) {
      this.rotate( -Math.PI / 2 );
    }

    ruler.isInToolboxProperty.link( isInToolbox => {
      this.visible = isInToolbox;
    } );

    // Dragging with mouse/touch. Drag events are forwarded from the icon to its associated ruler.
    this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {

      // Take the ruler out of the toolbox.
      ruler.isInToolboxProperty.value = false;

      // Set position of the ruler so that the pointer is initially at the center of rulerNode.
      assert && assert( event.pointer.point ); // {Vector2|null}
      const zoomTransform = zoomTransformProperty.value;
      const viewPosition = rulerNode.globalToParentPoint( event.pointer.point! );
      let x;
      let y;
      if ( ruler.orientation === 'vertical' ) {
        x = viewPosition.x - rulerNode.width / 2;
        y = viewPosition.y - zoomTransform.modelToViewDeltaY( ruler.length ) / 2;
      }
      else {
        x = viewPosition.x - zoomTransform.modelToViewDeltaX( ruler.length ) / 2;
        y = viewPosition.y - rulerNode.height / 2;
      }
      ruler.positionProperty.value = zoomTransform.viewToModelXY( x, y );

      // Forward events to the RulerNode.
      rulerNode.startDrag( event );
    } ) );

    // When the icon is clicked via the keyboard, take the ruler out of the toolbox, and place it at the model origin.
    this.addInputListener( {
      click: () => {
        ruler.isInToolboxProperty.value = false;
        ruler.positionProperty.value = Vector2.ZERO;
        rulerNode.focus();
      }
    } );
  }
}

geometricOptics.register( 'RulerIconNode', RulerIconNode );
export default RulerIconNode;