// Copyright 2022, University of Colorado Boulder

/**
 * PositionMarkerNode is the view of a position marker. It can be dragged in/out of the toolbox, and
 * positioned anywhere within the drag bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener } from '../../../../../scenery/js/imports.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PositionMarker from '../../model/tools/PositionMarker.js';
import PositionMarkerIcon from './PositionMarkerIcon.js';
import GOToolNode, { GOToolNodeOptions } from './GOToolNode.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import MapMarkerNode from '../MapMarkerNode.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import GOToolKeyboardDragListener from './GOToolKeyboardDragListener.js';
import GOToolDragListener from './GOToolDragListener.js';
import geometricOptics from '../../../geometricOptics.js';

type SelfOptions = {
  iconTandem: Tandem,

  // pointer areas
  touchAreaDilationX?: number;
  touchAreaDilationY?: number;
  mouseAreaDilationX?: number;
  mouseAreaDilationY?: number;
};

export type PositionMarkerNodeOptions = SelfOptions & GOToolNodeOptions;

class PositionMarkerNode extends GOToolNode {

  // See GOToolNode
  public readonly icon: PositionMarkerIcon;
  protected readonly dragListener: DragListener;

  // the marker that is associated with this Node
  public readonly positionMarker: PositionMarker;

  private readonly dragBoundsProperty: IReadOnlyProperty<Bounds2>;

  /**
   * @param positionMarker
   * @param zoomTransformProperty
   * @param visibleBoundsProperty
   * @param providedOptions
   */
  constructor( positionMarker: PositionMarker,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: PositionMarkerNodeOptions ) {

    const options = optionize<PositionMarkerNodeOptions, SelfOptions, GOToolNodeOptions>( {

      // SelfOptions
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5
    }, providedOptions );

    super( positionMarker, options );

    this.icon = new PositionMarkerIcon( positionMarker, this, zoomTransformProperty, {
      tandem: options.iconTandem
    } );
    this.positionMarker = positionMarker;

    const mapMarkerNode = new MapMarkerNode( {
      fill: positionMarker.fill,
      stroke: positionMarker.stroke
    } );
    this.addChild( mapMarkerNode );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    // Origin is at centerTop.
    positionMarker.positionProperty.link( position => {
      this.centerTop = zoomTransformProperty.value.modelToViewPosition( position );
    } );

    // Update the marker's model position to match this Node's view position, so that the marker remains stationary
    // in the view, and the model position is correct.
    zoomTransformProperty.lazyLink( ( zoomTransform: ModelViewTransform2 ) => {
      positionMarker.positionProperty.value = zoomTransform.viewToModelPosition( this.centerTop );
    } );

    // Drag bounds for the marker, in model coordinates.
    // This keeps the entire marker inside the visible bounds of the ScreenView.
    this.dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        const viewBounds = new Bounds2( visibleBounds.minX + this.width / 2, visibleBounds.minY,
          visibleBounds.maxX - this.width / 2, visibleBounds.maxY - this.height );
        return zoomTransform.viewToModelBounds( viewBounds );
      }
    );

    // Keep the marker inside the drag bounds.
    this.dragBoundsProperty.link( dragBounds => {
      positionMarker.positionProperty.value = dragBounds.closestPointTo( positionMarker.positionProperty.value );
    } );

    // Return the tool to the toolbox if the marker's bounds intersect the toolbox.
    const shouldReturnToToolbox = () => this.toolboxBounds.intersectsBounds( this.parentToGlobalBounds( this.bounds ) );

    // Dragging with the pointer.
    this.dragListener = new GOToolDragListener( positionMarker, this, zoomTransformProperty, this.dragBoundsProperty,
      shouldReturnToToolbox, {
        offsetPosition: () => new Vector2( -this.width / 2, -this.height ),
        tandem: options.tandem.createTandem( 'dragListener' )
      } );
    this.addInputListener( this.dragListener );

    // Dragging with the keyboard.
    const keyboardDragListener = new GOToolKeyboardDragListener( positionMarker, this, zoomTransformProperty,
      this.dragBoundsProperty, shouldReturnToToolbox, {
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } );
    this.addInputListener( keyboardDragListener );
  }

  /**
   * Handles the J+P (Jump to Point) hotkey, which jumps (moves) the ruler to the next 'interesting' point.
   * See https://github.com/phetsims/geometric-optics/issues/355
   */
  public jumpToPoint(): void {
    if ( this.jumpPoints.length > 0 ) {
      const markerPosition = this.positionMarker.positionProperty.value;

      // Find the target positions that are non-null, visible, and in drag bounds.
      const relevantJumpPoints = this.jumpPoints.filter( jumpPoint =>

        // not null
        ( jumpPoint.positionProperty.value !== null ) &&

        // visible
        jumpPoint.visibleProperty.value &&

        // inside the tool's drag bounds, so the tool doesn't move out of bounds
        this.dragBoundsProperty.value.containsPoint( jumpPoint.positionProperty.value ) );

      if ( relevantJumpPoints.length > 0 ) {

        // Extract just the position values.
        const points: Vector2[] = relevantJumpPoints.map( jumpPoint => jumpPoint.positionProperty.value! );

        // Sort positions left-to-right, by increasing x coordinate.
        const sortedPoints = _.sortBy( points, point => point.x );

        let nextPoint: Vector2 | undefined;

        const thisPosition = _.find( sortedPoints, point => point.equals( markerPosition ) );
        if ( thisPosition ) {

          // If the marker is at one of the jump points, and there's more than 1 jump point, then
          // get the next jump point by search for where we're current at in the array (with wrap-around).
          if ( sortedPoints.length > 1 ) {
            let nextIndex = sortedPoints.indexOf( thisPosition ) + 1;
            if ( nextIndex > sortedPoints.length - 1 ) {
              nextIndex = 0;
            }
            nextPoint = sortedPoints[ nextIndex ];
          }
        }
        else {

          // If the marker is not one of the jump points, then find the next jump point that is to the right of
          // the marker (with wrap-around).
          nextPoint = _.find( sortedPoints, position => position.x > markerPosition.x );
          if ( !nextPoint ) {
            const leftmostPosition = sortedPoints[ 0 ];
            if ( !leftmostPosition.equals( markerPosition ) ) {
              nextPoint = leftmostPosition;
            }
          }
        }

        // Move the marker
        if ( nextPoint ) {
          this.positionMarker.positionProperty.value = nextPoint;
        }
      }
    }
  }
}

geometricOptics.register( 'PositionMarkerNode', PositionMarkerNode );
export default PositionMarkerNode;