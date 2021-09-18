// Copyright 2021, University of Colorado Boulder

//TODO there appears to be a lot of unnecessary complication here for Creator pattern
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
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

// constants
const MINIMUM_VISIBLE_LENGTH = GeometricOpticsConstants.MINIMUM_VISIBLE_LENGTH;

class GeometricOpticsRulerNode extends Node {

  /**
   * @param {Ruler} ruler - model for ruler
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {Bounds2} panelBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( ruler, visibleBoundsProperty, panelBounds, modelViewTransform, options ) {

    options = merge( {
      cursor: 'pointer',
      rulerOptions: {
        opacity: 0.8,
        minorTicksPerMajorTick: 4,
        majorTickDistance: 10, // in model coordinate (cm)
        majorTickFont: new PhetFont( 13 ),
        insetsWidth: 0
      }
    }, options );

    super( options );

    // @private
    this.rulerOptions = options.rulerOptions;

    // @private {Ruler}
    this.ruler = ruler;

    // @public {Bounds2} bounds of the toolbox panel
    this.panelBounds = panelBounds;

    // create and add a SCENERY/RulerNode
    this.setRulerNode( modelViewTransform, this.rulerOptions );

    // set the initial orientation, position and visibility of the ruler node
    this.setOrientation();
    this.setPosition();
    this.setInitialVisibility();

    // {DerivedProperty.<Bounds2>} dragBounds Property for ruler: the view width and the height of the ruler
    // will NOT change throughout the simulation
    const rulerDragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty ],
      visibleBounds => {
        if ( ruler.isVertical() ) {

          // if vertical the left and right bounds of the ruler stay within visible bounds
          // minimum visible length of the ruler is always showing inside top and bottom visible bounds.
          return visibleBounds.withOffsets( 0,
            -MINIMUM_VISIBLE_LENGTH,
            -this.width,
            -MINIMUM_VISIBLE_LENGTH + this.height );
        }
        else {
          // if horizontal ruler, the bottom and top bounds of the ruler stay within visible bounds
          // minimum visible length of the ruler is always showing inside left  and right visible bounds.
          return visibleBounds.withOffsets( this.width - MINIMUM_VISIBLE_LENGTH,
            0,
            -MINIMUM_VISIBLE_LENGTH,
            -this.height );
        }
      } );

    // @public create and add drag listener
    this.dragListener = new DragListener( {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: rulerDragBoundsProperty,
      start: () => {

        // move this node on top of all the nodes
        this.moveToFront();
      },

      end: event => {

        // return ruler to toolbox if the pointer is within the toolbox
        if ( this.panelBounds.containsPoint( this.globalToParentPoint( event.pointer.point ) ) ) {
          this.visibleProperty.value = false;
        }
      }
    } );
    this.addInputListener( this.dragListener );

    // update ruler node position based on ruler model position
    // the GeometricOpticRulerNode exists from the lifetime of the simulation, so need to unlink.
    ruler.positionProperty.link( () => this.setPosition() );

    // prevent the ruler from escaping the visible bounds
    rulerDragBoundsProperty.link( dragBounds => {
      ruler.positionProperty.value = dragBounds.closestPointTo( ruler.positionProperty.value );
    } );
  }

  /**
   * Resets the visibility and position of this node
   * @public
   */
  reset() {
    this.setPosition(); //TODO why isn't it sufficient to reset Ruler.positionProperty?
    this.setInitialVisibility(); //TODO add visibleProperty to Ruler model element
  }

  /**
   * Sets the visibility of this node to false
   * @private
   */
  setInitialVisibility() {
    this.visible = false;
  }

  //TODO this seems unnecessary, only called once from constructor
  /**
   * Sets the orientation of the ruler
   * @private
   */
  setOrientation() {
    if ( this.ruler.isVertical() ) {

      // update the rotation of the ruler
      this.rotation = -Math.PI / 2;
    }
  }

  /**
   * Sets the position of the ruler
   * @public
   */
  setPosition() {
    if ( this.ruler.isVertical() ) {

      // set initial position of the ruler - leftBottom since rotated 90 degrees
      this.leftBottom = this.ruler.positionProperty.value;
    }
    else {

      // set initial position of the ruler
      this.leftTop = this.ruler.positionProperty.value;
    }
  }

  /**
   * Forwards an event from the toolbox to start dragging this node
   * @public
   * @param {SceneryEvent} event
   */
  startDrag( event ) {
    this.dragListener.press( event, this );
  }

  /**
   * Updates toolbox panel bounds
   * @public
   * @param {Bounds2} bounds
   */
  setToolboxPanelBounds( bounds ) {
    this.panelBounds = bounds;
  }

  /**
   * Returns a Scenery Ruler Node appropriate for the model view transform
   * @private
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @returns {Node} rulerNode
   */
  getRulerNode( modelViewTransform, options ) {

    options = merge( {}, this.rulerOptions, options );

    // define the length ruler
    const rulerWidth = modelViewTransform.modelToViewDeltaX( this.ruler.length );

    // separation between the major ticks mark
    const majorTickWidth = modelViewTransform.modelToViewDeltaX(
      options.majorTickDistance );

    const numberOfMajorTicks = Math.floor( rulerWidth / majorTickWidth ) + 1;

    // create major ticks label
    const majorTickLabels = [];
    for ( let i = 0; i < numberOfMajorTicks; i++ ) {

      const majorTickInterval = options.majorTickDistance;

      // skip labels on every other major ticks
      if ( i % 2 === 0 ) {
        majorTickLabels[ i ] = Utils.toFixed( i * majorTickInterval, 0 );
      }
      else {
        majorTickLabels[ i ] = '';
      }
    }

    // set the units at the end of ruler
    const rulerOptions = merge( {
      unitsMajorTickIndex: numberOfMajorTicks - 3
    }, options );

    return new RulerNode(
      rulerWidth,
      GeometricOpticsConstants.RULER_HEIGHT,
      majorTickWidth,
      majorTickLabels,
      geometricOpticsStrings.centimeters,
      rulerOptions
    );
  }

  /**
   * Adds a new SCENERY/RulerNode to the parent, detaching the previous ruler Node.
   * @public
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  setRulerNode( modelViewTransform, options ) {

    // remove previous instances of rulerNode
    this.removeAllChildren();

    // add and create new
    this.addChild( this.getRulerNode( modelViewTransform, options ) );
  }
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );
export default GeometricOpticsRulerNode;