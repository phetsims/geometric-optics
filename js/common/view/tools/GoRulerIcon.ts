// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/355 factor out duplication into GOToolIcon
/**
 * GoRulerIcon is a ruler icon that appears in the toolbox. It is associated with a specific ruler Node,
 * and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import RulerNode from '../../../../../scenery-phet/js/RulerNode.js';
import { DragListener, PressListenerEvent } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import geometricOptics from '../../../geometricOptics.js';
import GORuler from '../../model/tools/GORuler.js';
import GORulerNode from './GORulerNode.js';
import GOToolIcon, { GOToolIconOptions } from './GOToolIcon.js';

// constants
const ICON_WIDTH = 48;
const ICON_HEIGHT = 17;
const NUMBER_OF_MAJOR_TICKS = 5;

type GoRulerIconOptions = PickRequired<GOToolIconOptions, 'tandem'>;

class GoRulerIcon extends GOToolIcon {

  /**
   * @param ruler
   * @param rulerNode
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( ruler: GORuler,
               rulerNode: GORulerNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: GoRulerIconOptions ) {

    // The ruler icon has no ticks labels, it would be too much detail in an icon.
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < NUMBER_OF_MAJOR_TICKS; i++ ) {
      majorTickLabels.push( '' );
    }
    const majorTickWidth = ICON_WIDTH / ( majorTickLabels.length - 1 );

    // The ruler icon has no units, it would be too much detail in an icon.
    const units = '';

    const contentNode = new RulerNode( ICON_WIDTH, ICON_HEIGHT, majorTickWidth, majorTickLabels, units, {
      backgroundLineWidth: 0.5,
      majorTickLineWidth: 0.5,
      minorTickLineWidth: 0.25,
      minorTicksPerMajorTick: 5,
      majorTickHeight: ( 0.6 * ICON_HEIGHT ) / 2,
      minorTickHeight: ( 0.4 * ICON_HEIGHT ) / 2,
      insetsWidth: 0,
      tandem: Tandem.OPT_OUT
    } );

    super( contentNode, rulerNode, zoomTransformProperty, providedOptions );

    // Rotate to create a vertical ruler icon.
    if ( ruler.orientation === 'vertical' ) {
      this.rotate( -Math.PI / 2 );
    }

    // Dragging with mouse/touch. Drag events are forwarded from the icon to its associated tool.
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
  }
}

geometricOptics.register( 'GoRulerIcon', GoRulerIcon );
export default GoRulerIcon;