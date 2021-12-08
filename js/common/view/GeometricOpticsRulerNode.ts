// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsRulerNode is the view of a ruler. Responsibilities include:
 *
 * - It wraps a scenery-phet.RulerNode, which is re-created when the zoom level changes.
 * - As the zoom level is changed, the view dimensions remain constant, but the tick marks change.
 * - It handles dragging, including dragging back to the RulersToolbox.
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
import { DragListener, Node, SceneryEvent } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsRuler from '../model/GeometricOpticsRuler.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const MINIMUM_VISIBLE_LENGTH = GeometricOpticsConstants.RULER_MINIMUM_VISIBLE_LENGTH;

class GeometricOpticsRulerNode extends Node {

  readonly ruler: GeometricOpticsRuler;
  private toolboxBounds: Bounds2;
  private readonly dragListener: DragListener;

  /**
   * @param ruler
   * @param zoomTransformProperty
   * @param zoomScaleProperty
   * @param visibleBoundsProperty
   * @param options
   */
  constructor( ruler: GeometricOpticsRuler, zoomTransformProperty: Property<ModelViewTransform2>,
               zoomScaleProperty: Property<number>, visibleBoundsProperty: Property<Bounds2>,
               options?: any ) {

    options = merge( {

      // RulerNode options
      rulerOptions: {
        opacity: 0.8,
        minorTicksPerMajorTick: 4,
        majorTickFont: new PhetFont( 13 ),
        insetsWidth: 0
      },

      // Node options
      rotation: ruler.isVertical ? -Math.PI / 2 : 0,
      visibleProperty: ruler.visibleProperty,
      
      // phet-io options
      tandem: Tandem.REQUIRED,
      phetioInputEnabledPropertyInstrumented: true
    }, options );
    assert && assert( !options.children, 'this Node calls removeAllChildren' );

    super( options );

    this.ruler = ruler;
    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds

    // Create a RulerNode subcomponent to match zoomScale.
    //TODO https://github.com/phetsims/geometric-optics/issues/133 this listener also depends on zoomTransformProperty, so there's a problematic ordering dependency there
    zoomScaleProperty.link( zoomScale => {

      // update model length, so that view length remains the same
      ruler.scaleLength( zoomScale );

      // update view
      this.removeAllChildren();
      this.addChild( createRulerNode( this.ruler.length, zoomTransformProperty.value, zoomScale, options.rulerOptions ) );
    } );

    ruler.positionProperty.link( position => {
      if ( this.ruler.isVertical ) {
        this.leftBottom = position;
      }
      else {
        this.leftTop = position;
      }
    } );

    // Drag bounds for the ruler, to keep some part of the ruler inside the visible bounds of the ScreenView.
    // dragBoundsProperty can be in view coordinates because ruler.positionProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty ],
      ( visibleBounds: Bounds2 ) => {
        if ( ruler.isVertical ) {

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
    dragBoundsProperty.link( dragBounds => {
      ruler.positionProperty.value = dragBounds.closestPointTo( ruler.positionProperty.value );
    } );

    this.dragListener = new DragListener( {
      cursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      start: () => this.moveToFront(),
      end: ( event: SceneryEvent ) => {

        // Return ruler to toolbox if the pointer is inside the toolbox.
        assert && assert( event.pointer.point instanceof Vector2 );
        if ( this.toolboxBounds.containsPoint( this.globalToParentPoint( event.pointer.point as Vector2 ) ) ) {
          ruler.visibleProperty.value = false;
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( this.dragListener );
  }

  public setToolboxBounds( toolboxBounds: Bounds2 ): void {
    this.toolboxBounds = toolboxBounds;
  }

  // Forwards an event from the toolbox to start dragging this Node
  public startDrag( event: SceneryEvent ): void {
    this.dragListener.press( event, this );
  }
}

/**
 * Creates a scenery-phet.RulerNode appropriate for the modelViewTransform and zoom scale.
 * @param rulerLength
 * @param modelViewTransform
 * @param zoomScale
 * @param options - to RulerNode
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

  // set the units at the end of ruler
  const numberOfMajorTicks = Math.floor( rulerWidth / majorTickWidth ) + 1;
  assert && assert( options.unitsMajorTickIndex === undefined );
  options.unitsMajorTickIndex = numberOfMajorTicks - 3;

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

  return new RulerNode( rulerWidth, GeometricOpticsConstants.RULER_HEIGHT,
    majorTickWidth, majorTickLabels, geometricOpticsStrings.centimeters, options );
}

geometricOptics.register( 'GeometricOpticsRulerNode', GeometricOpticsRulerNode );
export default GeometricOpticsRulerNode;