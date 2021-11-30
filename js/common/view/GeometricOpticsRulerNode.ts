// Copyright 2021, University of Colorado Boulder

//TODO there appears to be a lot of unnecessary complication here for Creator pattern
/**
 * Scenery node for a movable ruler in the Geometric Optics simulation
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Ruler from '../model/Ruler.js';
import { SceneryEvent } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// constants
const MINIMUM_VISIBLE_LENGTH = GeometricOpticsConstants.RULER_MINIMUM_VISIBLE_LENGTH;

class GeometricOpticsRulerNode extends Node {

  // bounds of the toolbox
  toolboxBounds: Bounds2;
  readonly ruler: Ruler;
  private readonly rulerOptions: any; //TYPESCRIPT any
  private readonly dragListener: DragListener;

  /**
   * @param ruler
   * @param visibleBoundsProperty
   * @param toolboxBounds
   * @param modelViewTransform
   * @param options
   */
  constructor( ruler: Ruler, visibleBoundsProperty: Property<Bounds2>, toolboxBounds: Bounds2,
               modelViewTransform: ModelViewTransform2, options?: any ) {

    options = merge( {
      rulerOptions: {
        opacity: 0.8,
        minorTicksPerMajorTick: 4,
        majorTickDistance: 10, // in model coordinate (cm)
        majorTickFont: new PhetFont( 13 ),
        insetsWidth: 0
      }
    }, options );

    assert && assert( options.rotation === undefined );
    options.rotation = ruler.isVertical() ? -Math.PI / 2 : 0;

    super( options );

    this.ruler = ruler;
    this.rulerOptions = options.rulerOptions;
    this.toolboxBounds = toolboxBounds;

    // create and add a scenery-phet.RulerNode
    this.setRulerNode( modelViewTransform, this.rulerOptions );

    // set the initial position and visibility
    this.setPosition();
    this.setInitialVisibility();

    // {DerivedProperty.<Bounds2>} dragBounds Property for ruler: the view width and the height of the ruler
    // will NOT change throughout the simulation
    const rulerDragBoundsProperty = new DerivedProperty<Bounds2>(
      [ visibleBoundsProperty ],
      ( visibleBounds: Bounds2 ) => {
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

    this.dragListener = new DragListener( {
      cursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: rulerDragBoundsProperty,
      start: () => {

        // move this node on top of all the nodes
        this.moveToFront();
      },

      end: ( event: SceneryEvent ) => {

        // return ruler to toolbox if the pointer is within the toolbox
        assert && assert( event.pointer.point instanceof Vector2 );
        if ( this.toolboxBounds.containsPoint( this.globalToParentPoint( event.pointer.point as Vector2 ) ) ) {
          this.visible = false;
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
   */
  public reset(): void {
    this.setPosition(); //TODO why isn't it sufficient to reset Ruler.positionProperty?
    this.setInitialVisibility(); //TODO add visibleProperty to Ruler model element
  }

  /**
   * Sets the position of the ruler
   */
  public setPosition(): void {
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
   */
  public startDrag( event: SceneryEvent ): void {
    this.dragListener.press( event, this );
  }

  /**
   * Adds a new scenery-phet.RulerNode to the parent, detaching the previous RulerNode.
   * @param modelViewTransform
   * @param options
   */
  public setRulerNode( modelViewTransform: ModelViewTransform2, options?: any ): void {

    // remove previous instances of rulerNode
    this.removeAllChildren();

    // add and create new
    this.addChild( this.getRulerNode( modelViewTransform, options ) );
  }

  //TODO why is this needed?
  /**
   * Sets the visibility of this node to false
   */
  private setInitialVisibility(): void {
    this.visible = false;
  }

  /**
   * Returns a scenery-phet.RulerNode appropriate for the model view transform
   * @param modelViewTransform
   * @param options
   */
  private getRulerNode( modelViewTransform: ModelViewTransform2, options?: any ): Node {

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
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );
export default GeometricOpticsRulerNode;