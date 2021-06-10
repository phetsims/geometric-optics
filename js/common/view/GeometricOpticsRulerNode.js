// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for a movable ruler in the Geometric Optics simulation
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import geometricOptics from '../../geometricOptics.js';
import Ruler from '../model/Ruler.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

const centimetersString = geometricOpticsStrings.centimeters;

const RULER_HEIGHT = 40; //  in view coordinates

class GeometricOpticsRulerNode extends RulerNode {
  /**
   *
   * @param {Ruler} ruler - model for ruler
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} layoutBounds - bounds of screen view
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleProperty, layoutBounds, modelViewTransform, options ) {

    options = merge( {
      opacity: 0.8,
      minorTicksPerMajorTick: 4,
      majorTickDistance: 0.2, // in model coordinate (m)
      majorTickLineWidth: 2
    }, options );

    // define the length ruler
    const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );

    // separation between the major ticks mark
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( options.majorTickDistance );

    const numberOfMajorTicks = ruler.length / options.majorTickDistance + 1;

    // create major ticks label
    const majorTickLabels = [];
    for ( let i = 0; i < numberOfMajorTicks; i++ ) {
      majorTickLabels[ i ] = Utils.toFixed( i * options.majorTickDistance * 100, 0 );
    }

    super( rulerWidth, RULER_HEIGHT, majorTickWidth, majorTickLabels, centimetersString, options );

    // {Bounds2} the bounds of the ruler to stay within the devBounds
    let rulerBounds;

    if ( ruler.orientation === Ruler.Orientation.VERTICAL ) {

      // update the rotation of the ruler
      this.rotation = -Math.PI / 2;

      // making sure that the right top of the ruler stays within the screen
      rulerBounds = layoutBounds.withOffsets( 0, -this.height, -this.width, 0 );
    }
    else {

      // making sure that the right bottom of the ruler stays within the screen
      rulerBounds = layoutBounds.withOffsets( 0, 0, -this.width, -this.height );
    }

    // create property for dragBounds of ruler
    const rulerDragBoundsProperty = new Property( modelViewTransform.viewToModelBounds( rulerBounds ) );

    // create and add drag listener
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

    // set initial position of the ruler
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
