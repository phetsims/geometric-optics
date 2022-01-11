// Copyright 2021-2022, University of Colorado Boulder

/**
 * GORulerNode is the view of a ruler. Responsibilities include:
 *
 * - It wraps a scenery-phet.RulerNode, which is re-created when the zoom level changes.
 * - As the zoom level is changed, the view dimensions remain constant, but the tick marks change.
 * - It handles dragging, including dragging back to the RulersToolbox.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, Font, KeyboardDragListener, KeyboardUtils, Node, SceneryEvent } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import GORuler from '../model/GORuler.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RulerIconNode from './RulerIconNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Representation from '../model/Representation.js';

// constants
const MINIMUM_VISIBLE_LENGTH = GOConstants.RULER_MINIMUM_VISIBLE_LENGTH;

//TODO should be defined by RulerNode
type RulerNodeOptions = {
  opacity?: number,
  minorTicksPerMajorTick?: number,
  majorTickFont?: Font,
  majorTickDistance?: number,
  unitsMajorTickIndex?: number,
  insetsWidth?: number,
};

type GORulerNodeOptions = {

  // Hotkeys that move the ruler to the optic, KeyboardUtils.KEY_* values
  hotkeysMoveRulerToOptic: string[],

  // Options passed to RulerNode
  rulerOptions?: RulerNodeOptions,

  // phet-io options
  tandem: Tandem
};

class GORulerNode extends Node {

  // the ruler model that is associated with this Node
  readonly ruler: GORuler;

  // the icon associated with this ruler, it appears in the toolbox
  readonly iconNode: RulerIconNode;

  // bounds of the toolbox, in view coordinates
  private toolboxBounds: Bounds2;

  private readonly dragListener: DragListener;

  /**
   * @param ruler
   * @param zoomTransformProperty
   * @param zoomScaleProperty
   * @param visibleBoundsProperty
   * @param opticPositionProperty
   * @param sourceObjectPositionProperty
   * @param secondPointPositionProperty
   * @param secondLightSourcePositionProperty
   * @param secondPointVisibleProperty
   * @param targetPositionProperty
   * @param targetNodeVisibleProperty
   * @param representationProperty
   * @param providedOptions
   */
  constructor( ruler: GORuler,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               zoomScaleProperty: IReadOnlyProperty<number>,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               sourceObjectPositionProperty: IReadOnlyProperty<Vector2>,
               secondPointPositionProperty: IReadOnlyProperty<Vector2>,
               secondLightSourcePositionProperty: IReadOnlyProperty<Vector2>,
               secondPointVisibleProperty: IReadOnlyProperty<boolean>,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               targetNodeVisibleProperty: IReadOnlyProperty<boolean>,
               representationProperty: IReadOnlyProperty<Representation>,
               providedOptions: GORulerNodeOptions ) {

    const options = merge( {

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

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions ) as GORulerNodeOptions;

    super( options );

    this.ruler = ruler;
    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds
    this.iconNode = new RulerIconNode( this, zoomTransformProperty );

    // Create a RulerNode subcomponent to match zoomScale.
    //TODO https://github.com/phetsims/geometric-optics/issues/133 this listener also depends on zoomTransformProperty, so there's a problematic ordering dependency there
    zoomScaleProperty.link( zoomScale => {

      // update ruler size, so that view size remains the same
      ruler.scaleLength( zoomScale );

      // update view
      this.removeAllChildren();
      this.addChild( createRulerNode( this.ruler.length, zoomTransformProperty.value, zoomScale, options.rulerOptions ) );
    } );

    ruler.positionProperty.link( position => {
      const viewPosition = zoomTransformProperty.value.modelToViewPosition( position );
      if ( this.ruler.isVertical ) {
        this.leftBottom = viewPosition;
      }
      else {
        this.leftTop = viewPosition;
      }
    } );

    // Drag bounds for the ruler, in model coordinates.
    // This keeps a part of the ruler inside the visible bounds of the ScreenView.
    const dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        let viewDragBounds;
        if ( ruler.isVertical ) {

          // if vertical the left and right bounds of the ruler stay within visible bounds
          // minimum visible length of the ruler is always showing inside top and bottom visible bounds.
          viewDragBounds = visibleBounds.withOffsets( 0, -MINIMUM_VISIBLE_LENGTH,
            -this.width, -MINIMUM_VISIBLE_LENGTH + this.height );
        }
        else {
          // if horizontal ruler, the bottom and top bounds of the ruler stay within visible bounds
          // minimum visible length of the ruler is always showing inside left  and right visible bounds.
          viewDragBounds = visibleBounds.withOffsets( this.width - MINIMUM_VISIBLE_LENGTH, 0,
            -MINIMUM_VISIBLE_LENGTH, -this.height );
        }
        return zoomTransform.viewToModelBounds( viewDragBounds );
      } );
    dragBoundsProperty.link( dragBounds => {
      ruler.positionProperty.value = dragBounds.closestPointTo( ruler.positionProperty.value );
    } );

    // Dragging with the pointer
    this.dragListener = new DragListener( {
      cursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: zoomTransformProperty.value,
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

    // Dragging with the keyboard
    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: zoomTransformProperty.value,
      start: () => this.moveToFront(),

      // Return the ruler to the toolbox if the ruler's center point is inside the toolbox.
      end: () => {
        if ( this.toolboxBounds.containsPoint( this.center ) ) {
          ruler.visibleProperty.value = false;
          this.iconNode.focus();
        }
      }
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } ) );
    this.addInputListener( keyboardDragListener );

    // Hotkeys for rulers, see https://github.com/phetsims/geometric-optics/issues/279
    keyboardDragListener.addHotkeys( [

      // Escape returns the ruler to the toolbox.
      {
        keys: [ KeyboardUtils.KEY_ESCAPE ],
        callback: () => {
          ruler.visibleProperty.value = false;
          this.iconNode.focus();
        }
      },

      // J+L moves the ruler to the optic (Lens or Mirror) position.
      {
        keys: options.hotkeysMoveRulerToOptic,
        callback: () => {
          ruler.positionProperty.value = opticPositionProperty.value;
        }
      },

      // J+O moves the ruler to the source object or first light source.
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_O ],
        callback: () => {
          moveRuler( ruler, sourceObjectPositionProperty.value, opticPositionProperty.value.y );
        }
      },

      // J+I moves the ruler to the Image position.
      // Ignored if no Image is visible, or if moving the ruler would put it outside the drag bounds.
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_I ],
        callback: () => {
          if ( targetNodeVisibleProperty.value && representationProperty.value.isObject &&
               dragBoundsProperty.value.containsPoint( targetPositionProperty.value ) ) {
            moveRuler( ruler, targetPositionProperty.value, opticPositionProperty.value.y );
          }
        }
      },

      // J+S moves the ruler to the second point or second light source.
      // Ignored if 'Second Point' is not visible.
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_S ],
        callback: () => {
          if ( secondPointVisibleProperty.value ) {
            if ( representationProperty.value.isObject ) {
              moveRuler( ruler, secondPointPositionProperty.value, opticPositionProperty.value.y );
            }
            else {
              moveRuler( ruler, secondLightSourcePositionProperty.value, opticPositionProperty.value.y );
            }
          }
        }
      }
    ] );

    // When the transform changes, update the input listeners
    zoomTransformProperty.link( zoomTransform => {
      this.dragListener.transform = zoomTransform;
      keyboardDragListener.transform = zoomTransform;
    } );
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
 * Moves the ruler so that a vertical ruler is measuring a distance from the optical axis,
 * while a horizontal ruler is placed at the specified position.
 * @param ruler
 * @param position
 * @param opticalAxisY
 */
function moveRuler( ruler: GORuler, position: Vector2, opticalAxisY: number ) {
  const x = position.x;
  const y = ruler.isVertical ? Math.min( position.y, opticalAxisY ) : opticalAxisY;
  ruler.positionProperty.value = new Vector2( x, y );
}

/**
 * Creates a scenery-phet.RulerNode appropriate for the zoomTransform and zoom scale.
 * @param rulerLength
 * @param zoomTransform
 * @param zoomScale
 * @param providedOptions - to RulerNode
 */
function createRulerNode( rulerLength: number, zoomTransform: ModelViewTransform2, zoomScale: number,
                          providedOptions?: RulerNodeOptions ): Node {

  const options = merge( {}, providedOptions ) as RulerNodeOptions;

  assert && assert( options.majorTickDistance === undefined );
  options.majorTickDistance = 10 / zoomScale; // in model coordinate (cm)

  // define the length ruler
  const rulerWidth = zoomTransform.modelToViewDeltaX( rulerLength );

  // separation between the major ticks mark
  const majorTickWidth = zoomTransform.modelToViewDeltaX( options.majorTickDistance );

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

  return new RulerNode( rulerWidth, GOConstants.RULER_HEIGHT,
    majorTickWidth, majorTickLabels, geometricOpticsStrings.centimeters, options );
}

geometricOptics.register( 'GORulerNode', GORulerNode );
export default GORulerNode;
export type { GORulerNodeOptions };