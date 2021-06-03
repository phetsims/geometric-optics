// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for a movable ruler in the Geometric Optics simulation
 *
 * @author Sarah Chang, Swarthmore College
 */

import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import geometricOptics from '../../geometricOptics.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';

const RULER_HEIGHT = 40;

class GeometricOpticsRulerNode extends RulerNode {
  /**
   *
   * @param {Ruler} ruler
   * @param {Property.<boolean>} visibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleProperty, modelViewTransform, options ) {

    // define the length ruler
    const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );

    // define the height of the ruler in view coordinates
    const rulerHeight = RULER_HEIGHT;

    // separation between the major ticks mark
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( 0.2 );

    // create major ticks label
    const majorTickLabels = [];
    for ( let i = 0; i <= 5; i++ ) {
      majorTickLabels[ i ] = ( i * 20 ).toString();
    }

    // units {string}
    const units = 'cm';

    super( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options );

    // add drag listener
    const dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      transform: modelViewTransform,
      translateNode: true,
      start: () => {

        // move this node on top of all the nodes
        this.moveToFront();
      }
    } );
    this.addInputListener( dragListener );

    // update the rotation of the ruler
    if ( ruler.orientation !== 'horizontal' ) {
      this.rotation = -Math.PI / 2;
    }

    // set position of the ruler
    this.leftTop = modelViewTransform.modelToViewPosition( ruler.positionProperty.value );

    // update ruler visibility
    visibleProperty.linkAttribute( this, 'visible' );

  }
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );

export default GeometricOpticsRulerNode;
