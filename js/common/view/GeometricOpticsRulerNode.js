// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for a movable ruler in the Geometric Optics simulation
 *
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Ruler from '../model/Ruler.js';


const centimetersString = geometricOpticsStrings.centimeters;

const RULER_HEIGHT = GeometricOpticsConstants.RULER_HEIGHT;
const MINIMUM_VISIBLE_LENGTH = GeometricOpticsConstants.MINIMUM_VISIBLE_LENGTH;

class GeometricOpticsRulerNode extends RulerNode {
  /**
   *
   * @param {Ruler} ruler - model for ruler
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleBoundsProperty, modelViewTransform, options ) {

    options = merge( {
      opacity: 0.8,
      minorTicksPerMajorTick: 4,
      majorTickDistance: 0.1, // in model coordinate (m)
      majorTickFont: new PhetFont( 13 ),
      insetsWidth: 0
    }, options );

    // define the length ruler
    const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );

    // separation between the major ticks mark
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( options.majorTickDistance );

    const numberOfMajorTicks = ruler.length / options.majorTickDistance + 1;

    // create major ticks label
    const majorTickLabels = [];

    for ( let i = 0; i < numberOfMajorTicks; i++ ) {

      const centimetersInMeters = 100;
      const majorTickInterval = options.majorTickDistance * centimetersInMeters;

      if ( i % 2 === 0 ) {
        majorTickLabels[ i ] = Utils.toFixed( i * majorTickInterval, 0 );
      }
      else {
        majorTickLabels[ i ] = '';
      }
    }

    // set the units at the end of ruler
    options = merge( {
      unitsMajorTickIndex: numberOfMajorTicks - 3
    }, options );

    super( rulerWidth,
      RULER_HEIGHT,
      majorTickWidth,
      majorTickLabels,
      centimetersString,
      options );

    // @private
    this.ruler = ruler;

    this.setOrientation();
    this.setPosition();

    const rulerDragBoundsProperty = new DerivedProperty( [ visibleBoundsProperty ], visibleBounds => {

        if ( ruler.orientation === Ruler.Orientation.VERTICAL ) {

          // if vertical the left and right bounds of the ruler stay within visible bounds
          // minimum visible length of the ruler is always showing inside top and bottom visible bounds.
          return visibleBounds.withOffsets( 0, -MINIMUM_VISIBLE_LENGTH, -this.width, -MINIMUM_VISIBLE_LENGTH + this.height );
        }
        else {
          // if horizontal ruler,  the bottom and top bounds of the ruler stay within visible bounds
          // minimum visible length of the ruler is always showing inside left  and right visible bounds.
          return visibleBounds.withOffsets( this.width - MINIMUM_VISIBLE_LENGTH, 0, -MINIMUM_VISIBLE_LENGTH, -this.height );
        }
      }
    );

    // @public create and add drag listener
    this.dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: rulerDragBoundsProperty,
      start: () => {

        // move this node on top of all the nodes
        this.moveToFront();
      },

      end: () => {

        // Drop in toolbox, using the bounds ruler
        if ( this.panelBounds.intersectsBounds( this.bounds ) ) {
          this.visible = false
        }
      }
    } );
    this.addInputListener( this.dragListener );

    // always keep ruler in visible/drag bounds when visible bounds are changed
    rulerDragBoundsProperty.link( dragBounds => {
      ruler.positionProperty.value = dragBounds.closestPointTo( ruler.positionProperty.value );
    } );

    // update ruler node position based on ruler model position
    ruler.positionProperty.link( position => {
      this.setPosition();
    } );

    // @private
    this.resetLeftTopPosition = () => {
      this.leftTop = ruler.positionProperty.value;
    };

  }

  /**
   * @public
   */
  reset() {
    this.setPosition();
    this.visible = false;
  }

  /**
   * @public
   */
  setOrientation() {
    if ( this.ruler.orientation === Ruler.Orientation.VERTICAL ) {

      // update the rotation of the ruler
      this.rotation = -Math.PI / 2;
    }
  }

  /**
   * @public
   */
  setPosition() {
    if ( this.ruler.orientation === Ruler.Orientation.VERTICAL ) {

      // set initial position of the ruler - leftBottom since rotated 90 degrees
      this.leftBottom = this.ruler.positionProperty.value;
    }
    else {

      // set initial position of the ruler
      this.leftTop = this.ruler.positionProperty.value;
    }
  }


  /**
   * Forward an event from the toolbox to start dragging this node
   * @param {SceneryEvent} event
   * @public
   */
  startDrag( event ) {

    // Forward the event to the drag listener
    this.dragListener.press( event, this );
  }

  /**
   * @public
   * @param {Bounds2} bounds
   */
  setToolboxPanelBounds( bounds ) {
    this.panelBounds = bounds;
  }
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );

export default GeometricOpticsRulerNode;
