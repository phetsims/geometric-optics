// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for a movable ruler in the Geometric Optics simulation
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Ruler from '../model/Ruler.js';
import GeometricOpticsScreenView from './GeometricOpticsScreenView.js';

const centimetersString = geometricOpticsStrings.centimeters;

const RULER_HEIGHT = 40; //  in view coordinates
const ZOOM_RANGE = GeometricOpticsConstants.ZOOM_RANGE;

class GeometricOpticsRulerNode extends Node {
  /**
   *
   * @param {Ruler} ruler - model for ruler
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<number>} zoomLevelProperty
   * @param {Bounds2} layoutBounds - bounds of screen view
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleProperty, zoomLevelProperty, layoutBounds, modelViewTransform, options ) {

    options = merge( {
      ruler: {
        opacity: 0.8,
        minorTicksPerMajorTick: 4,
        majorTickDistance: 0.1, // in model coordinate (m)
        majorTickFont: new PhetFont( 16 ),
        insetsWidth: 0
      }
    }, options );

    super( options );

    // define the length ruler
    const rulerWidth = modelViewTransform.modelToViewDeltaX( ruler.length );

    // separation between the major ticks mark
    const majorTickWidth = modelViewTransform.modelToViewDeltaX( options.ruler.majorTickDistance );

    const numberOfMajorTicks = ruler.length / options.ruler.majorTickDistance + 1;

    zoomLevelProperty.link( zoomLevel => {

      this.removeAllChildren();

      // create major ticks label
      const majorTickLabels = [];

      for ( let i = 0; i < numberOfMajorTicks; i++ ) {
        const scale = GeometricOpticsScreenView.scaleFunction( zoomLevel );
        const defaultScale = GeometricOpticsScreenView.scaleFunction( ZOOM_RANGE.defaultValue );
        const relativeScale = defaultScale / scale;

        const centimetersInMeters = 100;
        const majorTickInterval = options.ruler.majorTickDistance * centimetersInMeters * relativeScale;

        if ( i % 2 === 0 ) {
          majorTickLabels[ i ] = Utils.toFixed( i * majorTickInterval, 0 );
        }
        else {
          majorTickLabels[ i ] = '';
        }
      }

      const rulerNode = new RulerNode( rulerWidth,
        RULER_HEIGHT,
        majorTickWidth,
        majorTickLabels,
        centimetersString,
        options.ruler );

      this.addChild( rulerNode );

    } );

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
      },

      drag: () => {

      },

      end: () => {

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
