// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, FocusHighlightFromNode, KeyboardDragListener, KeyboardDragListenerOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowObject from '../model/ArrowObject.js';
import Optic from '../model/Optic.js';
import GOConstants from '../GOConstants.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import OpticalObjectNode, { OpticalObjectNodeOptions } from './OpticalObjectNode.js';

const SNAP_TO_MIN_MAGNITUDE = 20; // cm

type ArrowObjectNodeOptions = OpticalObjectNodeOptions;

class ArrowObjectNode extends OpticalObjectNode {

  /**
   * @param arrowObject
   * @param optic
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param modelViewTransform
   * @param objectDragModeProperty
   * @param wasDraggedProperty - was any ArrowObjectNode dragged?
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               objectDragModeProperty: IReadOnlyProperty<ObjectDragMode>,
               wasDraggedProperty: Property<boolean>,
               providedOptions: ArrowObjectNodeOptions ) {

    super( arrowObject, objectDragModeProperty, wasDraggedProperty, providedOptions );

    const arrowNode = new ArrowNode( 0, 0, 0, 1,
      optionize<ArrowNodeOptions, {}, ArrowNodeOptions>( {}, GOConstants.ARROW_NODE_OPTIONS, {
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

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragBoundsProperty = new DerivedProperty(
      [ sceneBoundsProperty, objectDragModeProperty ],
      ( sceneBounds: Bounds2, objectDragMode: ObjectDragMode ) => {

        const minX = sceneBounds.minX + modelViewTransform.viewToModelDeltaX( arrowNode.width ) / 2;
        const maxX = optic.positionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( objectDragMode === 'freeDragging' ) {
          minY = sceneBounds.minY;
          maxY = sceneBounds.maxY;
        }
        else {

          // horizontal dragging, locked to the object's current y position
          minY = arrowObject.positionProperty.value.y;
          maxY = arrowObject.positionProperty.value.y;
        }
        return new Bounds2( minX, minY, maxX, maxY );
      } );

    // Keep the arrow inside the drag bounds.
    dragBoundsProperty.link( dragBounds => {
      arrowObject.positionProperty.value = dragBounds.closestPointTo( arrowObject.positionProperty.value );
    } );

    // When mouse/touch dragging is completed, check the magnitude of the arrow. If it is less than the minimum
    // magnitude, snap it to the minimum length. Optionally invert the sign, to facilitate keyboard dragging.
    const end = ( sign: 1 | -1 ) => {
      const arrowLength = arrowObject.positionProperty.value.y - optic.positionProperty.value.y;
      if ( Math.abs( arrowLength ) < SNAP_TO_MIN_MAGNITUDE ) {
        const x = arrowObject.positionProperty.value.x;
        const y = sign * Math.sign( arrowLength ) * SNAP_TO_MIN_MAGNITUDE;
        arrowObject.positionProperty.value = new Vector2( x, y );
      }
    };

    const dragListener = new DragListener( {
      positionProperty: arrowObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: drag,
      end: () => end( 1 ),
      tandem: providedOptions.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      optionize<KeyboardDragListenerOptions, {}, KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: arrowObject.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: modelViewTransform,
        drag: drag,
        end: () => end( -1 ),
        tandem: providedOptions.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the arrow.
    Property.multilink( [ arrowNode.boundsProperty, this.cueingArrowsNode.boundsProperty ],
      ( arrowNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        this.cueingArrowsNode.right = arrowNodeBounds.left - 5;
        this.cueingArrowsNode.centerY = arrowNodeBounds.centerY;
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ArrowObjectNode', ArrowObjectNode );
export default ArrowObjectNode;