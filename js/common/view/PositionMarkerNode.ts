// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/355 factor out duplication into GOToolNode
/**
 * PositionMarkerNode is the view of a position marker. It can be dragged in/out of the toolbox, and
 * positioned anywhere within the drag bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, KeyboardDragListener, KeyboardUtils } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { KeyboardDragListenerOptions } from '../GOCommonOptions.js';
import PositionMarker from '../model/PositionMarker.js';
import PositionMarkerIcon from './PositionMarkerIcon.js';
import GOToolNode, { GOToolNodeOptions } from './GOToolNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MapMarkerNode from './MapMarkerNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';

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

    const mapMarkerNode = new MapMarkerNode( {
      fill: positionMarker.fill,
      stroke: positionMarker.stroke
    } );
    this.addChild( mapMarkerNode );

    this.positionMarker = positionMarker;

    // Create the icon after all other this fields have been initialized.
    this.icon = new PositionMarkerIcon( this, zoomTransformProperty, {
      tandem: options.iconTandem
    } );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    this.mouseArea = this.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

    positionMarker.positionProperty.link( position => {
      this.centerTop = zoomTransformProperty.value.modelToViewPosition( position );
    } );

    // Update the marker position to match this Node's position, so that the marker remains stationary
    // in the view, and the model position is correct.
    zoomTransformProperty.lazyLink( ( zoomTransform: ModelViewTransform2 ) => {
      positionMarker.positionProperty.value = zoomTransform.viewToModelPosition( this.centerTop );
    } );

    //TODO https://github.com/phetsims/geometric-optics/issues/355 limit to the area above the control panel?
    // Drag bounds for the marker, in model coordinates.
    // This keeps the entire marker inside the visible bounds of the ScreenView.
    const dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty, zoomTransformProperty ],
      ( visibleBounds: Bounds2, zoomTransform: ModelViewTransform2 ) => {
        const viewBounds = new Bounds2( visibleBounds.minX + this.width / 2, visibleBounds.minY,
          visibleBounds.maxX - this.width / 2, visibleBounds.maxY - this.height );
        return zoomTransform.viewToModelBounds( viewBounds );
      }
    );

    // Keep the marker inside the drag bounds.
    dragBoundsProperty.link( dragBounds => {
      positionMarker.positionProperty.value = dragBounds.closestPointTo( positionMarker.positionProperty.value );
    } );

    // Dragging with the pointer.
    this.dragListener = new DragListener( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: positionMarker.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      offsetPosition: () => new Vector2( -this.width / 2, -this.height ),
      transform: zoomTransformProperty.value,
      start: () => this.moveToFront(),
      end: () => {

        // Return the marker to the toolbox if the marker's bounds intersect the toolbox.
        if ( this.toolboxBounds.intersectsBounds( this.bounds ) ) {
          this.returnToToolbox( false );
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( this.dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      optionize<KeyboardDragListenerOptions, {}, KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: positionMarker.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: zoomTransformProperty.value,
        start: () => this.moveToFront(),

        // Return the marker to the toolbox if the marker's bounds intersect the toolbox.
        end: () => {
          if ( this.toolboxBounds.intersectsBounds( this.bounds ) ) {
            this.returnToToolbox( true );
          }
        },
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    keyboardDragListener.hotkeys = [

      // Escape returns the marker to the toolbox.
      {
        keys: [ KeyboardUtils.KEY_ESCAPE ],
        callback: () => this.returnToToolbox( true )
      }
    ];

    // When the transform changes, update the input listeners
    zoomTransformProperty.link( zoomTransform => {
      this.dragListener.transform = zoomTransform;
      keyboardDragListener.transform = zoomTransform;
    } );
  }
}

geometricOptics.register( 'PositionMarkerNode', PositionMarkerNode );
export default PositionMarkerNode;