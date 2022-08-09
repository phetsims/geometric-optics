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
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PositionMarker from '../../model/tools/PositionMarker.js';
import PositionMarkerIcon from './PositionMarkerIcon.js';
import GOToolNode, { GOToolNodeOptions } from './GOToolNode.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import MapMarkerNode from '../MapMarkerNode.js';
import GOToolKeyboardDragListener from './GOToolKeyboardDragListener.js';
import GOToolDragListener from './GOToolDragListener.js';
import geometricOptics from '../../../geometricOptics.js';

type SelfOptions = {

  // pointer areas
  touchAreaDilationX?: number;
  touchAreaDilationY?: number;
  mouseAreaDilationX?: number;
  mouseAreaDilationY?: number;
};

export type PositionMarkerNodeOptions = SelfOptions & GOToolNodeOptions;

export default class PositionMarkerNode extends GOToolNode {

  // See GOToolNode
  public readonly icon: PositionMarkerIcon;
  protected readonly dragListener: DragListener;

  // the marker that is associated with this Node
  public readonly positionMarker: PositionMarker;

  private readonly dragBoundsProperty: TReadOnlyProperty<Bounds2>;

  /**
   * @param positionMarker - model element
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param providedOptions
   */
  public constructor( positionMarker: PositionMarker,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: PositionMarkerNodeOptions ) {

    const options = optionize<PositionMarkerNodeOptions, SelfOptions, GOToolNodeOptions>()( {

      // SelfOptions
      touchAreaDilationX: 5,
      touchAreaDilationY: 5,
      mouseAreaDilationX: 5,
      mouseAreaDilationY: 5
    }, providedOptions );

    super( positionMarker, options );

    this.icon = new PositionMarkerIcon( positionMarker, this, zoomTransformProperty );
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
      ( visibleBounds, zoomTransform ) => {
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
    // toolboxNode should be set by the time this is called.
    const shouldReturnToToolbox = () => this.toolboxNode!.intersectsGlobalBounds( this.parentToGlobalBounds( this.bounds ) );

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
   * Handles the 'J' (Jump) hotkey, which moves the ruler to the next 'interesting' point.
   * See https://github.com/phetsims/geometric-optics/issues/355
   */
  public jumpToPoint(): void {

    const markerPosition = this.positionMarker.positionProperty.value;

    // Find the points that are relevant.
    const relevantJumpPoints = this.jumpPoints.filter( jumpPoint =>

      // not null
      ( jumpPoint.positionProperty.value !== null ) &&

      // visible
      jumpPoint.visibleProperty.value &&

      // inside the tool's drag bounds, so the tool doesn't move out of bounds
      this.dragBoundsProperty.value.containsPoint( jumpPoint.positionProperty.value )
    );

    // Find the next jump point and move there.
    if ( relevantJumpPoints.length > 0 ) {

      // Get the next point, based on the marker's position.
      const nextPoint = GOToolNode.getNextJumpPoint( relevantJumpPoints, markerPosition );

      // Move the marker
      if ( nextPoint ) {
        this.positionMarker.positionProperty.value = nextPoint;
      }
    }
  }
}

geometricOptics.register( 'PositionMarkerNode', PositionMarkerNode );