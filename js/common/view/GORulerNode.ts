// Copyright 2021-2022, University of Colorado Boulder

/**
 * GORulerNode is the view of a ruler. Responsibilities include:
 *
 * - It wraps a scenery-phet.RulerNode, which is re-created when the zoom level changes.
 * - As the zoom level is changed, the view dimensions remain constant, but the tick marks change.
 * - It handles dragging, including dragging back to the RulersToolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, KeyboardDragListener, KeyboardUtils, Node, NodeOptions, PressedDragListener, PressListenerEvent } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import GORuler from '../model/GORuler.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RulerIconNode from './RulerIconNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { KeyboardDragListenerOptions } from '../GOCommonOptions.js';

// constants
const MINIMUM_VISIBLE_LENGTH = GOConstants.RULER_MINIMUM_VISIBLE_LENGTH;

type GORulerNodeOptions = PickRequired<Node, 'tandem'>;

// Describes a measurement point that can be 'jumped' to via J+R hotkey.
type RulerHotkeyTarget = {
  positionProperty: IReadOnlyProperty<Vector2>,
  visibleProperty: IReadOnlyProperty<boolean>
}

class GORulerNode extends Node {

  // the ruler model that is associated with this Node
  readonly ruler: GORuler;

  private readonly opticPositionProperty: IReadOnlyProperty<Vector2>

  // the icon associated with this ruler, it appears in the toolbox
  readonly iconNode: RulerIconNode;

  // bounds of the toolbox, in view coordinates
  private toolboxBounds: Bounds2;

  private readonly dragListener: DragListener;
  private readonly dragBoundsProperty: IReadOnlyProperty<Bounds2>;

  private hotkeyTargets: RulerHotkeyTarget[];
  private hotkeyTargetsIndex: number;

  /**
   * @param ruler
   * @param opticPositionProperty
   * @param zoomTransformProperty
   * @param zoomScaleProperty
   * @param visibleBoundsProperty
   * @param providedOptions
   */
  constructor( ruler: GORuler,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               zoomScaleProperty: IReadOnlyProperty<number>,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: GORulerNodeOptions ) {

    const options = optionize<GORulerNodeOptions, {}, NodeOptions>( {

      // Node options
      rotation: ( ruler.orientation === 'vertical' ) ? -Math.PI / 2 : 0,
      visibleProperty: ruler.visibleProperty,

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    this.ruler = ruler;
    this.opticPositionProperty = opticPositionProperty;
    this.hotkeyTargets = [];
    this.hotkeyTargetsIndex = 0;
    this.toolboxBounds = Bounds2.NOTHING; // to be set later via setToolboxBounds
    this.iconNode = new RulerIconNode( this, zoomTransformProperty );

    // Create a RulerNode subcomponent to match zoomScale.
    //TODO https://github.com/phetsims/geometric-optics/issues/133 this listener also depends on zoomTransformProperty, so there's a problematic ordering dependency there
    zoomScaleProperty.link( zoomScale => {

      // update ruler size, so that view size remains the same
      ruler.scaleLength( zoomScale );

      // update view
      this.removeAllChildren();
      this.addChild( createRulerNode( this.ruler.length, zoomTransformProperty.value, zoomScale ) );
    } );

    ruler.positionProperty.link( position => {
      const viewPosition = zoomTransformProperty.value.modelToViewPosition( position );
      if ( this.ruler.orientation === 'vertical' ) {
        this.leftBottom = viewPosition;
      }
      else {
        this.leftTop = viewPosition;
      }
    } );

    // Drag bounds for the ruler, in model coordinates.
    // This keeps a part of the ruler inside the visible bounds of the ScreenView.
    this.dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        let viewDragBounds;
        if ( ruler.orientation === 'vertical' ) {

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

    // Dragging with the pointer
    this.dragListener = new DragListener( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: ruler.positionProperty,
      dragBoundsProperty: this.dragBoundsProperty,
      transform: zoomTransformProperty.value,
      start: () => this.moveToFront(),
      end: ( listener: DragListener ) => {
        const pressedListener = listener as PressedDragListener;

        // Return ruler to toolbox if the pointer is inside the toolbox.
        assert && assert( pressedListener.pointer.point instanceof Vector2 );
        if ( this.toolboxBounds.containsPoint( this.globalToParentPoint( pressedListener.pointer.point as Vector2 ) ) ) {
          ruler.visibleProperty.value = false;
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( this.dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      optionize<KeyboardDragListenerOptions, {}, KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: ruler.positionProperty,
        dragBoundsProperty: this.dragBoundsProperty,
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
        // tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // Hotkeys for rulers, see https://github.com/phetsims/geometric-optics/issues/279
    keyboardDragListener.hotkeys = [

      // Escape returns the ruler to the toolbox.
      {
        keys: [ KeyboardUtils.KEY_ESCAPE ],
        callback: () => this.returnToToolbox()
      },

      // J+R move the ruler to next visible position in hotkeyTargets
      {
        keys: [ KeyboardUtils.KEY_R ],
        callback: () => this.jumpToNextHotkeyTarget()
      }
    ];

    // When the transform changes, update the input listeners
    zoomTransformProperty.link( zoomTransform => {
      this.dragListener.transform = zoomTransform;
      keyboardDragListener.transform = zoomTransform;
    } );
  }

  /**
   * Sets the bounds of the toolbox, so the ruler know where to return to.
   * @param toolboxBounds
   */
  public setToolboxBounds( toolboxBounds: Bounds2 ): void {
    this.toolboxBounds = toolboxBounds;
  }

  /**
   * Forwards an event from the toolbox to start dragging this Node
   * @param event
   */
  public startDrag( event: PressListenerEvent ): void {
    this.dragListener.press( event, this );
  }

  /**
   * Sets the targets for the J+R hotkey.
   * @param hotkeyTargets
   */
  public setHotkeyTargets( hotkeyTargets: RulerHotkeyTarget[] ) {
    this.hotkeyTargets = hotkeyTargets;
    this.hotkeyTargetsIndex = 0;
  }

  /**
   * Returns the ruler to the toolbox.
   */
  private returnToToolbox() {
    this.ruler.visibleProperty.value = false;
    this.iconNode.focus();
  }

  /**
   * Jumps (moves) the ruler to the next measurement point, from left-to-right.
   * See https://github.com/phetsims/geometric-optics/issues/310
   */
  private jumpToNextHotkeyTarget() {
    if ( this.hotkeyTargets.length > 0 ) {

      const rulerPosition = this.ruler.positionProperty.value;

      // Find the target positions that are visible, not the same as the ruler position, and in bounds.
      // For horizontal rulers, exclude points to the right of the optic, because they are not useful.
      const visibleBoundedHotkeyTargets = this.hotkeyTargets.filter( target =>
        target.visibleProperty.value &&
        ( target.positionProperty.value.x !== rulerPosition.x ) &&
        this.dragBoundsProperty.value.containsPoint( target.positionProperty.value ) &&
        ( this.ruler.orientation === 'vertical' || target.positionProperty.value.x <= this.opticPositionProperty.value.x ) );

      // Sort target positions left-to-right, by increasing x coordinate.
      const targetPositions = visibleBoundedHotkeyTargets.map( target => target.positionProperty.value );
      const sortedTargetPositions = _.sortBy( targetPositions, targetPosition => targetPosition.x );

      // Find the first target position to the right of the ruler, with wrap-around to left.
      let targetPosition = _.find( sortedTargetPositions, targetPosition => targetPosition.x > rulerPosition.x );
      if ( !targetPosition ) {
        const leftmostTargetPosition = sortedTargetPositions[ 0 ];
        if ( leftmostTargetPosition.x < rulerPosition.x ) {
          targetPosition = leftmostTargetPosition;
        }
      }

      // Move the ruler
      if ( targetPosition ) {
        const opticY = this.opticPositionProperty.value.y;
        const y = ( this.ruler.orientation === 'vertical' ) ? Math.min( targetPosition.y, opticY ) : opticY;
        this.ruler.positionProperty.value = new Vector2( targetPosition.x, y );
      }
    }
  }
}

/**
 * Creates a scenery-phet.RulerNode appropriate for the zoomTransform and zoom scale.
 * @param rulerLength
 * @param zoomTransform
 * @param zoomScale
 */
function createRulerNode( rulerLength: number, zoomTransform: ModelViewTransform2, zoomScale: number ): Node {

  // define the length ruler
  const rulerWidth = zoomTransform.modelToViewDeltaX( rulerLength );

  const majorTickDistance = 10 / zoomScale; // in model coordinate (cm)

  // separation between the major ticks mark
  const majorTickWidth = zoomTransform.modelToViewDeltaX( majorTickDistance );

  // set the units at the end of ruler
  const numberOfMajorTicks = Math.floor( rulerWidth / majorTickWidth ) + 1;
  const unitsMajorTickIndex = numberOfMajorTicks - 3;

  // create major ticks label
  const majorTickLabels = [];
  for ( let i = 0; i < numberOfMajorTicks; i++ ) {

    // skip labels on every other major ticks
    if ( i % 2 === 0 ) {
      majorTickLabels[ i ] = Utils.toFixed( i * majorTickDistance, 0 );
    }
    else {
      majorTickLabels[ i ] = '';
    }
  }

  return new RulerNode( rulerWidth, GOConstants.RULER_HEIGHT,
    majorTickWidth, majorTickLabels, geometricOpticsStrings.centimeters, {
      opacity: 0.8,
      minorTicksPerMajorTick: 4,
      majorTickFont: new PhetFont( 13 ),
      majorTickDistance: majorTickDistance,
      unitsMajorTickIndex: unitsMajorTickIndex,
      insetsWidth: 0,

      // Because RulerNode instances are created dynamically, whenever the zoom level changes.
      // GORulerNode is therefore a wrapper around RulerNode, and will consequently not have the
      // same PhET-iO API as RulerNode.
      tandem: Tandem.OPT_OUT
    } );
}

geometricOptics.register( 'GORulerNode', GORulerNode );
export default GORulerNode;
export type { GORulerNodeOptions, RulerHotkeyTarget };