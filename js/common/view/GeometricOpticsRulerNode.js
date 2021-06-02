// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for ruler in the Geometric Optics simulation
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
    const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );
    const rulerHeight = RULER_HEIGHT;
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( 0.2 );
    const majorTickLabels = [];
    for ( let i = 0; i <= 5; i++ ) {
      majorTickLabels[ i ] = ( i * 20 ).toString();
    }
    const units = 'cm';

    super( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options );

    const dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      transform: modelViewTransform,
      translateNode: true
    } );
    this.addInputListener( dragListener );

    // rotate to create vertical ruler
    const rulerOrientation = options.orientation;
    if ( rulerOrientation === 'vertical' ) {
      this.rotation = -Math.PI / 2;
    }

    // rulers only appear when box is checked
    visibleProperty.linkAttribute( this, 'visible' );

  }
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );

export default GeometricOpticsRulerNode;