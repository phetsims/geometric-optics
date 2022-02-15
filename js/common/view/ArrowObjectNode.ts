// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, FocusHighlightFromNode, KeyboardDragListener, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowObject from '../model/ArrowObject.js';
import Optic from '../model/Optic.js';
import GOConstants from '../GOConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const SNAP_TO_MIN_MAGNITUDE = 20; // cm

type ArrowObjectNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class ArrowObjectNode extends Node {

  // For use by ArrowImageNode
  readonly arrowNode: Node;

  /**
   * @param arrowObject
   * @param optic
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param dragLockedProperty
   * @param wasDraggedProperty - was any ArrowObjectNode dragged?
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               wasDraggedProperty: Property<boolean>,
               providedOptions: ArrowObjectNodeOptions ) {

    const options = merge( {

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const arrowNode = new ArrowNode( 0, 0, 0, 1, merge( {}, GOConstants.ARROW_NODE_OPTIONS, {
      fill: arrowObject.fill,
      stroke: null
    } ) );
    this.addChild( arrowNode );
    this.arrowNode = arrowNode;
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
        [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty, wasDraggedProperty ],
        ( cueingArrowsEnabled: boolean, inputEnabled: boolean, wasDragged: boolean ) =>
          ( cueingArrowsEnabled && inputEnabled && !wasDragged ) )
    } );
    this.addChild( cueingArrowsNode );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragBoundsProperty = new DerivedProperty(
      [ modelBoundsProperty, dragLockedProperty ],
      ( modelBounds: Bounds2, dragLocked: boolean ) => {

        const minX = modelBounds.minX + modelViewTransform.viewToModelDeltaX( arrowNode.width ) / 2;
        const maxX = optic.positionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {
          minY = arrowObject.positionProperty.value.y;
          maxY = arrowObject.positionProperty.value.y;
        }
        else {
          minY = modelBounds.minY;
          maxY = modelBounds.maxY;
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