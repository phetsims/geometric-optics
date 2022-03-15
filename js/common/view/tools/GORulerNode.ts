// Copyright 2021-2022, University of Colorado Boulder

/**
 * GORulerNode is the view of a ruler. Responsibilities include:
 *
 * - It wraps a scenery-phet.RulerNode, which is re-created when the zoom level changes.
 * - As the zoom level is changed, the view dimensions remain constant, but the tick marks change.
 * - It handles dragging, including dragging back to the toolbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Utils from '../../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../../scenery-phet/js/RulerNode.js';
import { DragListener, Node } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import GOConstants from '../../GOConstants.js';
import GORuler from '../../model/tools/GORuler.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import GORulerIcon from './GORulerIcon.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import IntentionalAny from '../../../../../phet-core/js/types/IntentionalAny.js';
import GOToolNode, { GOToolNodeOptions } from './GOToolNode.js';
import GOToolKeyboardDragListener from './GOToolKeyboardDragListener.js';
import GOToolDragListener from './GOToolDragListener.js';

// constants
const MINIMUM_VISIBLE_LENGTH = GOConstants.RULER_MINIMUM_VISIBLE_LENGTH;

export type GORulerNodeOptions = GOToolNodeOptions;

class GORulerNode extends GOToolNode {

  // See GOToolNode
  public readonly icon: GORulerIcon;
  protected readonly dragListener: DragListener;

  // the ruler model that is associated with this Node
  public readonly ruler: GORuler;

  private readonly opticPositionProperty: IReadOnlyProperty<Vector2>

  private readonly dragBoundsProperty: IReadOnlyProperty<Bounds2>;

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
               zoomTransformProperty: DerivedProperty<ModelViewTransform2, IntentionalAny[]>,
               zoomScaleProperty: IReadOnlyProperty<number>,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: GORulerNodeOptions ) {

    super( ruler, providedOptions );

    this.rotation = ( ruler.orientation === 'vertical' ) ? -Math.PI / 2 : 0;

    this.icon = new GORulerIcon( ruler, this, zoomTransformProperty, {
      tandem: providedOptions.iconTandem
    } );
    this.ruler = ruler;
    this.opticPositionProperty = opticPositionProperty;

    // Create a RulerNode subcomponent whose scale matches the current zoom level.
    zoomTransformProperty.link( ( zoomTransform: ModelViewTransform2 ) => {

      // zoomTransformProperty is derived from zoomScaleProperty, so zoomScaleProperty does not need to be
      // a dependency, and it's safe to use its value.
      assert && assert( zoomTransformProperty.hasDependency( zoomScaleProperty ) );
      const zoomScale = zoomScaleProperty.value;

      // update ruler size, so that view size remains the same
      ruler.scaleLength( zoomScale );

      // update view
      this.removeAllChildren();
      this.addChild( createRulerNode( this.ruler.length, zoomTransform, zoomScale ) );
    } );

    // Origin is at leftBottom for a vertical ruler, leftTop for a horizontal ruler.
    ruler.positionProperty.link( position => {
      const viewPosition = zoomTransformProperty.value.modelToViewPosition( position );
      if ( this.ruler.orientation === 'vertical' ) {
        this.leftBottom = viewPosition;
      }
      else {
        this.leftTop = viewPosition;
      }
    } );

    // Update the ruler's model position to match this Node's view position, so that the ruler remains stationary
    // in the view, and the model is correct.
    zoomTransformProperty.lazyLink( ( zoomTransform: ModelViewTransform2 ) => {
      ruler.positionProperty.value = ( this.ruler.orientation === 'vertical' ) ?
                                     zoomTransform.viewToModelPosition( this.leftBottom ) :
                                     zoomTransform.viewToModelPosition( this.leftTop );
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

    // Keep the ruler inside the drag bounds.
    this.dragBoundsProperty.link( dragBounds => {
      ruler.positionProperty.value = dragBounds.closestPointTo( ruler.positionProperty.value );
    } );

    // Dragging with the pointer.
    // Return to the toolbox when the pointer is released inside the toolbox.
    const dragReturnToToolbox = ( pointerPoint: Vector2 ) => this.toolboxBounds.containsPoint( pointerPoint );
    this.dragListener = new GOToolDragListener( ruler, this, zoomTransformProperty, this.dragBoundsProperty,
      dragReturnToToolbox, {
        tandem: providedOptions.tandem.createTandem( 'dragListener' )
      } );
    this.addInputListener( this.dragListener );

    // Dragging with the keyboard.
    // Return the ruler to the toolbox if the ruler's center point is inside the toolbox.
    const keyboardDragReturnToToolbox = () => this.toolboxBounds.containsPoint( this.parentToGlobalPoint( this.center ) );
    const keyboardDragListener = new GOToolKeyboardDragListener( ruler, this, zoomTransformProperty,
      this.dragBoundsProperty, keyboardDragReturnToToolbox, {
        tandem: providedOptions.tandem.createTandem( 'keyboardDragListener' )
      } );
    this.addInputListener( keyboardDragListener );
  }

  /**
   * Handles the J+P (Jump to Point) hotkey, which jumps (moves) the ruler to the next 'interesting' point.
   * See https://github.com/phetsims/geometric-optics/issues/310
   */
  public jumpToPoint(): void {

    const rulerPosition = this.ruler.positionProperty.value;

    // Find the points that are relevant.
    const relevantJumpPoints = this.jumpPoints.filter( jumpPoint =>

      // not null
      ( jumpPoint.positionProperty.value !== null ) &&

      // visible
      jumpPoint.visibleProperty.value &&

      // inside the tool's drag bounds, so the tool doesn't move out of bounds
      this.dragBoundsProperty.value.containsPoint( jumpPoint.positionProperty.value ) &&

      // For horizontal rulers, exclude points to the right of the optic, because they are not useful.
      !( this.ruler.orientation === 'horizontal' && jumpPoint.positionProperty.value.x > this.opticPositionProperty.value.x ) &&

      // For vertical rulers, exclude points on the optical axis, because they are not useful.
      !( this.ruler.orientation === 'vertical' && jumpPoint.positionProperty.value.y === this.opticPositionProperty.value.y )
    );

    // Find the next jump point and move there.
    if ( relevantJumpPoints.length > 0 ) {

      // Change the y coordinate of each point, based on the ruler's orientation. Horizontal rulers are placed on the
      // optical axis. Placement of vertical rulers depends on whether the jump point is above or below the optical
      // axis, and the ruler is placed so that we're always measuring a distance from the optical axis.
      const changeYCoordinates = ( points: Vector2[] ) => points.map( ( point: Vector2 ) => {
        const opticY = this.opticPositionProperty.value.y;
        const y = ( this.ruler.orientation === 'horizontal' ) ? opticY : Math.min( point.y, opticY );
        return new Vector2( point.x, y );
      } );

      // Get the next point, based on the ruler's position.
      const nextPoint = GOToolNode.getNextJumpPoint( relevantJumpPoints, rulerPosition, changeYCoordinates );

      // Move the ruler
      if ( nextPoint ) {
        this.ruler.positionProperty.value = nextPoint;
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