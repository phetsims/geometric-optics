// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsRulerNode is the view of a ruler. Responsibilities include:
 *
 * - It wraps a scenery-phet.RulerNode, which is re-created when the zoom level changes.  As the zoom level is changed,
 *   the RulerNode's view dimensions remain constant, but it's tick marks change.
 * - It handles dragging, including dragging back to the toolbox from whence it came.
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

  private readonly ruler: Ruler;
  private toolboxBounds: Bounds2;
  private readonly dragListener: DragListener;

  /**
   * @param ruler
   * @param zoomTransformProperty
   * @param zoomScaleProperty
   * @param visibleBoundsProperty
   * @param options
   */
  constructor( ruler: Ruler, zoomTransformProperty: Property<ModelViewTransform2>,
               zoomScaleProperty: Property<number>, visibleBoundsProperty: Property<Bounds2>,
               options?: any ) {

    options = merge( {
      rulerOptions: {
        opacity: 0.8,
        minorTicksPerMajorTick: 4,
        majorTickFont: new PhetFont( 13 ),
        insetsWidth: 0
      }
    }, options );

    assert && assert( options.rulerOptions.tickMarksOnBottom === undefined );
    options.tickMarksOnBottom = ruler.isVertical();

    assert && assert( options.rotation === undefined );
    options.rotation = ruler.isVertical() ? -Math.PI / 2 : 0;

    super( options );

    this.ruler = ruler;
    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds

    // Create a RulerNode subcomponent to match zoomScale.
    zoomScaleProperty.link( zoomScale => {

      // update model
      ruler.scaleLength( zoomScale );

      // update view
      this.removeAllChildren();
      this.addChild( createRulerNode( this.ruler.length, zoomTransformProperty.value, zoomScale, options.rulerOptions ) );
    } );

    this.updatePosition();
    this.setInitialVisibility();

    // update ruler node position based on ruler model position
    // the GeometricOpticRulerNode exists from the lifetime of the simulation, so need to unlink.
    ruler.positionProperty.link( () => this.updatePosition() );

    // Drag bounds for the ruler, to keep some part of the ruler inside the visible bounds of the ScreenView.
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
    rulerDragBoundsProperty.link( dragBounds => {
      ruler.positionProperty.value = dragBounds.closestPointTo( ruler.positionProperty.value );
    } );

    this.dragListener = new DragListener( {
      cursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: rulerDragBoundsProperty,
      start: () => this.moveToFront(),
      end: ( event: SceneryEvent ) => {

        // Return ruler to toolbox if the pointer is within the toolbox.
        assert && assert( event.pointer.point instanceof Vector2 );
        if ( this.toolboxBounds.containsPoint( this.globalToParentPoint( event.pointer.point as Vector2 ) ) ) {
          this.visible = false;
        }
      }
    } );
    this.addInputListener( this.dragListener );
  }

  /**
   * Resets the visibility and position of this node
   */
  public reset(): void {
    this.updatePosition(); //TODO why isn't it sufficient to reset Ruler.positionProperty?
    this.setInitialVisibility(); //TODO add visibleProperty to Ruler model element
  }

  public setToolboxBounds( toolboxBounds: Bounds2 ): void {
    this.toolboxBounds = toolboxBounds;
  }

  public updatePosition(): void {
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

  //TODO why is this needed?
  /**
   * Sets the visibility of this node to false
   */
  private setInitialVisibility(): void {
    this.visible = false;
  }
}

/**
 * Creates a scenery-phet.RulerNode appropriate for the modelViewTransform and zoom scale.
 * @param rulerLength
 * @param modelViewTransform
 * @param zoomScale
 * @param options
 */
function createRulerNode( rulerLength: number, modelViewTransform: ModelViewTransform2, zoomScale: number,
                          options?: any ): Node {

  options = merge( {}, options );

  assert && assert( options.majorTickDistance === undefined );
  options.majorTickDistance = 10 / zoomScale; // in model coordinate (cm)

  // define the length ruler
  const rulerWidth = modelViewTransform.modelToViewDeltaX( rulerLength );

  // separation between the major ticks mark
  const majorTickWidth = modelViewTransform.modelToViewDeltaX( options.majorTickDistance );

  // create major ticks label
  const numberOfMajorTicks = Math.floor( rulerWidth / majorTickWidth ) + 1;
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
  assert && assert( options.unitsMajorTickIndex === undefined );
  options.unitsMajorTickIndex = numberOfMajorTicks - 3;

  return new RulerNode( rulerWidth, GeometricOpticsConstants.RULER_HEIGHT,
    majorTickWidth, majorTickLabels, geometricOpticsStrings.centimeters, options );
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );
export default GeometricOpticsRulerNode;