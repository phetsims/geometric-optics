// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for a movable ruler in the Geometric Optics simulation
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import geometricOptics from '../../geometricOptics.js';
import Ruler from '../model/Ruler.js';
//import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

// const MIN_SCENE_WIDTH = GeometricOpticsConstants.MIN_SCENE_WIDTH;
// const MIN_SCENE_HEIGHT = GeometricOpticsConstants.MIN_SCENE_HEIGHT;
// const SCREEN_VIEW_X_MARGIN = GeometricOpticsConstants.SCREEN_VIEW_X_MARGIN;
// const SCREEN_VIEW_Y_MARGIN = GeometricOpticsConstants.SCREEN_VIEW_Y_MARGIN;

const RULER_HEIGHT = 40;

class GeometricOpticsRulerNode extends RulerNode {
  /**
   *
   * @param {Ruler} ruler
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleProperty, dragBoundsProperty, modelViewTransform, options ) {

    options = merge( {
      opacity: 0.8,
      minorTicksPerMajorTick: 4,
      majorTickDistance: 0.2, // in model coordinate (m)
      majorTickLineWidth: 2
    }, options );

    // define the length ruler
    const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );

    // define the height of the ruler in view coordinates
    const rulerHeight = RULER_HEIGHT;

    // separation between the major ticks mark
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( options.majorTickDistance );

    const numberOfMajorTicks = ruler.length / options.majorTickDistance + 1;

    // create major ticks label
    const majorTickLabels = [];
    for ( let i = 0; i < numberOfMajorTicks; i++ ) {
      majorTickLabels[ i ] = Utils.toFixed( i * options.majorTickDistance * 100, 0 );
    }

    // units {string}
    const units = 'cm';

    super( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options );
    const devBounds = new Bounds2( 0, 0, 1, 1 );
    const rulerDragBoundsProperty = new Property( devBounds );
    // add drag listener
    const dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: rulerDragBoundsProperty,
      transform: modelViewTransform,
      translateNode: true,
      start: () => {

        // move this node on top of all the nodes
        this.moveToFront();
      }
    } );
    this.addInputListener( dragListener );

    // update the rotation of the ruler
    if ( ruler.orientation === Ruler.Orientation.VERTICAL ) {
      this.rotation = -Math.PI / 2;
    }

    // set position of the ruler
    this.leftTop = modelViewTransform.modelToViewPosition( ruler.positionProperty.value );

    // update ruler visibility
    visibleProperty.linkAttribute( this, 'visible' );

    // @private
    this.resetLeftTopPosition = () => {
      this.leftTop = modelViewTransform.modelToViewPosition( ruler.positionProperty.value );
    };

  }

  /**
   * @public
   */
  reset() {
    this.resetLeftTopPosition();
  }
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );

export default GeometricOpticsRulerNode;
