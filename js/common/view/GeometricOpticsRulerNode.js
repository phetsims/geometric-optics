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
import Ruler from '../model/Ruler.js';

const centimetersString = geometricOpticsStrings.centimeters;

const RULER_HEIGHT = 40; //  in view coordinates

class GeometricOpticsRulerNode extends RulerNode {
  /**
   *
   * @param {Ruler} ruler - model for ruler
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleProperty, visibleBoundsProperty, modelViewTransform, options ) {

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

    const rulerDragBoundsProperty = new DerivedProperty( [ visibleBoundsProperty ], visibleBounds =>
      // if vertical the the right top of the ruler stays within the screen
      // if horizontal sure that the right bottom of the ruler stays within the screen
      ( ruler.orientation === Ruler.Orientation.VERTICAL ) ?
      visibleBounds.withOffsets( 0, -this.height, -this.width, 0 ) :
      visibleBounds.withOffsets( 0, 0, -this.width, -this.height )
    );

    // create and add drag listener
    const dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: rulerDragBoundsProperty,
      translateNode: true,
      start: () => {

        // move this node on top of all the nodes
        this.moveToFront();
      },

      drag: () => {

      },

      end: () => {

      }
    } );
    this.addInputListener( dragListener );


    // update ruler visibility
    visibleProperty.linkAttribute( this, 'visible' );

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
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );

export default GeometricOpticsRulerNode;
