// Copyright 2021, University of Colorado Boulder

/**
 * RulerIconNode is a ruler icon that appears in the RulersToolbox. It is associated with a specific ruler Node,
 * and forwards events to that ruler Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, SceneryEvent } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';

// constants
const ICON_WIDTH = 400;
const ICON_HEIGHT = 140;
const ICON_SCALE = 0.12;
const NUMBER_OF_MAJOR_TICKS = 5;

class RulerIconNode extends RulerNode {

  /**
   * @param rulerNode
   * @param options
   */
  constructor( rulerNode: GeometricOpticsRulerNode, options?: any ) {

    options = merge( {

      // pointer areas
      touchAreaDilationX: 50,
      touchAreaDilationY: 50,
      mouseAreaDilationX: 50,
      mouseAreaDilationY: 50,

      // RulerNode options
      backgroundLineWidth: 3,
      minorTicksPerMajorTick: 5,
      majorTickHeight: ( 0.6 * ICON_HEIGHT ) / 2,
      minorTickHeight: ( 0.4 * ICON_HEIGHT ) / 2,
      majorTickLineWidth: 5,
      minorTickLineWidth: 2,
      cursor: 'pointer',

      // @ts-ignore DerivedProperty.not has incorrect param type
      visibleProperty: DerivedProperty.not( rulerNode.visibleProperty )
    }, options );

    const majorTickLabels = [ '' ];
    for ( let i = 1; i < NUMBER_OF_MAJOR_TICKS; i++ ) {
      majorTickLabels.push( '' );
    }
    const majorTickWidth = ICON_WIDTH / ( majorTickLabels.length - 1 );
    const units = '';

    super( ICON_WIDTH, ICON_HEIGHT, majorTickWidth, majorTickLabels, units, options );
    
    this.scale( ICON_SCALE );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    // rotate to create a vertical ruler icon
    if ( rulerNode.ruler.isVertical ) {
      this.rotate( -Math.PI / 2 );
    }

    // Add a listener to forward drag events from the icon to its associated ruler.
    this.addInputListener( DragListener.createForwardingListener( ( event: SceneryEvent ) => {

      // Make the ruler visible.
      rulerNode.ruler.visibleProperty.value = true;

      // Position the center of the rulerNode at the pointer.
      assert && assert( event.pointer.point ); // {Vector2|null}
      rulerNode.center = rulerNode.globalToParentPoint( event.pointer.point! );

      // Forward events to the RulerNode.
      rulerNode.startDrag( event );
    } ) );
  }
}

geometricOptics.register( 'RulerIconNode', RulerIconNode );
export default RulerIconNode;