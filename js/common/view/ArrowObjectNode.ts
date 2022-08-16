// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
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
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import OpticalObjectNode, { OpticalObjectNodeOptions } from './OpticalObjectNode.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';

const SNAP_TO_MIN_MAGNITUDE = 20; // cm

type ArrowObjectNodeOptions = OpticalObjectNodeOptions;

export default class ArrowObjectNode extends OpticalObjectNode {

  /**
   * @param arrowObject - model element
   * @param optic - the associated optic
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param modelViewTransform
   * @param objectDragModeProperty - constrains how the object can be dragged
   * @param wasDraggedProperty - was any ArrowObjectNode dragged?
   * @param providedOptions
   */
  public constructor( arrowObject: ArrowObject,
                      optic: Optic,
                      sceneBoundsProperty: TReadOnlyProperty<Bounds2>,
                      modelViewTransform: ModelViewTransform2,
                      objectDragModeProperty: TReadOnlyProperty<ObjectDragMode>,
                      wasDraggedProperty: TProperty<boolean>,
                      providedOptions: ArrowObjectNodeOptions ) {

    super( arrowObject, objectDragModeProperty, wasDraggedProperty, providedOptions );

    const arrowNode = new ArrowNode( 0, 0, 0, 1,
      combineOptions<ArrowNodeOptions>( {}, GOConstants.ARROW_NODE_OPTIONS, {
        fill: arrowObject.fill,
        stroke: null
      } ) );
    this.addChild( arrowNode );
    this.setFocusHighlight( new FocusHighlightFromNode( arrowNode ) );

    Multilink.multilink( [ arrowObject.positionProperty, optic.positionProperty ],
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

    const dragBoundsProperty = new DerivedProperty(
      [ sceneBoundsProperty, objectDragModeProperty ],
      ( sceneBounds, objectDragMode ) => {

        const minX = sceneBounds.minX + modelViewTransform.viewToModelDeltaX( arrowNode.width ) / 2;
        const maxX = optic.positionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( objectDragMode === 'freeDragging' ) {

          // Constrain to the smaller of sceneBounds or MAX_MAGNITUDE. See https://github.com/phetsims/geometric-optics/issues/429
          minY = Math.max( sceneBounds.minY, optic.positionProperty.value.x - ArrowObject.MAX_MAGNITUDE );
          maxY = Math.min( sceneBounds.maxY, optic.positionProperty.value.x + ArrowObject.MAX_MAGNITUDE );
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
        const arrowSign = ( arrowLength >= 0 ) ? 1 : -1; // do not use Math.sign, because Math.sign(0) = 0
        const x = arrowObject.positionProperty.value.x;
        const y = sign * arrowSign * SNAP_TO_MIN_MAGNITUDE;
        arrowObject.positionProperty.value = new Vector2( x, y );
      }
    };

    const dragListener = new DragListener( {
      positionProperty: arrowObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: () => this.drag(),
      end: () => end( 1 ),
      tandem: providedOptions.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: arrowObject.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: modelViewTransform,
        drag: () => this.drag(),
        end: () => end( -1 ),
        tandem: providedOptions.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the arrow.
    Multilink.multilink( [ arrowNode.boundsProperty, this.cueingArrowsNode.boundsProperty ],
      ( arrowNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        this.cueingArrowsNode.right = arrowNodeBounds.left - 5;
        this.cueingArrowsNode.centerY = arrowNodeBounds.centerY;
      } );
  }
}

geometricOptics.register( 'ArrowObjectNode', ArrowObjectNode );