// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, FocusHighlightFromNode, KeyboardDragListener, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowObject from '../model/ArrowObject.js';
import Optic from '../model/Optic.js';
import GOConstants from '../GOConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import GOQueryParameters from '../GOQueryParameters.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { PickOptional } from '../../../../phet-core/js/types/PickOptional.js';

const SNAP_TO_MIN_MAGNITUDE = 20; // cm

type ArrowObjectNodeOptions = PickRequired<NodeOptions, 'tandem'> & PickOptional<NodeOptions, 'visibleProperty'>;

class ArrowObjectNode extends Node {

  /**
   * @param arrowObject
   * @param optic
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param modelViewTransform
   * @param dragLockedProperty - is dragging locked to horizontal?
   * @param wasDraggedProperty - was any ArrowObjectNode dragged?
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               wasDraggedProperty: Property<boolean>,
               providedOptions: ArrowObjectNodeOptions ) {

    const options = optionize<ArrowObjectNodeOptions, {}, NodeOptions>( {

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when ArrowNodeOptions exists
    const arrowNode = new ArrowNode( 0, 0, 0, 1, merge( {}, GOConstants.ARROW_NODE_OPTIONS, {
      fill: arrowObject.fill,
      stroke: null
    } ) );
    this.addChild( arrowNode );
    this.setFocusHighlight( new FocusHighlightFromNode( arrowNode ) );

    Property.multilink( [ arrowObject.positionProperty, optic.positionProperty ],
      ( arrowObjectPosition, opticPosition ) => {
        const tipPosition = modelViewTransform.modelToViewPosition( arrowObjectPosition );
        let tailY = modelViewTransform.modelToViewY( opticPosition.y );
        if ( tailY === tipPosition.y ) {
          tailY += GOConstants.MIN_MAGNITUDE; // see https://github.com/phetsims/geometric-optics/issues/306
        }
        arrowNode.setTailAndTip( tipPosition.x, tailY, tipPosition.x, tipPosition.y );
        arrowNode.mouseArea = arrowNode.localBounds.dilated( 3 );
        arrowNode.touchArea = arrowNode.localBounds.dilated( 10 );
      } );

    const cueingArrowsNode = new CueingArrowsNode( {
      visibleProperty: new DerivedProperty(
        [ this.inputEnabledProperty, wasDraggedProperty ],
        ( inputEnabled: boolean, wasDragged: boolean ) =>
          ( GOQueryParameters.enableCueingArrows && inputEnabled && !wasDragged ) )
    } );
    this.addChild( cueingArrowsNode );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragBoundsProperty = new DerivedProperty(
      [ sceneBoundsProperty, dragLockedProperty ],
      ( sceneBounds: Bounds2, dragLocked: boolean ) => {

        const minX = sceneBounds.minX + modelViewTransform.viewToModelDeltaX( arrowNode.width ) / 2;
        const maxX = optic.positionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {
          minY = arrowObject.positionProperty.value.y;
          maxY = arrowObject.positionProperty.value.y;
        }
        else {
          minY = sceneBounds.minY;
          maxY = sceneBounds.maxY;
        }
        return new Bounds2( minX, minY, maxX, maxY );
      } );

    // Keep the arrow inside the model bounds.
    dragBoundsProperty.link( dragBounds => {
      arrowObject.positionProperty.value = dragBounds.closestPointTo( arrowObject.positionProperty.value );
    } );

    // When dragging is completed, snap arrow to its minimum length.
    const end = () => {
      const arrowLength = arrowObject.positionProperty.value.y - optic.positionProperty.value.y;
      if ( Math.abs( arrowLength ) < SNAP_TO_MIN_MAGNITUDE ) {
        const x = arrowObject.positionProperty.value.x;
        const y = Math.sign( arrowLength ) * SNAP_TO_MIN_MAGNITUDE;
        arrowObject.positionProperty.value = new Vector2( x, y );
      }
    };

    const dragListener = new DragListener( {
      positionProperty: arrowObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: drag,
      end: end,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when KeyboardDragListenerOptions exists
    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: arrowObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      drag: drag,
      end: end
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the framed object.
    Property.multilink( [ arrowNode.boundsProperty, cueingArrowsNode.boundsProperty ],
      ( arrowNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        cueingArrowsNode.right = arrowNodeBounds.left - 5;
        cueingArrowsNode.centerY = arrowNodeBounds.centerY;
      } );

    // Update cursor and cueing arrows to reflect how this Node is draggable.
    dragLockedProperty.link( locked => {
      this.cursor = locked ? 'ew-resize' : 'pointer';
      cueingArrowsNode.setDirection( locked ? 'horizontal' : 'both' );
    } );

    this.addLinkedElement( arrowObject, {
      tandem: options.tandem.createTandem( 'arrowObject' )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ArrowObjectNode', ArrowObjectNode );
export default ArrowObjectNode;