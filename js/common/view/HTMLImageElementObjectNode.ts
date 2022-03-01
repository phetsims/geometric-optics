// Copyright 2021-2022, University of Colorado Boulder

/**
 * HTMLImageElementObjectNode is the view of an object that uses an HTMLImageElement for its visual representation.
 * Framed objects and light objects are subclasses of this object type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, FocusHighlightFromNode, Image, KeyboardDragListener, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GOConstants from '../GOConstants.js';
import GOQueryParameters from '../GOQueryParameters.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { PickOptional } from '../../../../phet-core/js/types/PickOptional.js';
import { KeyboardDragListenerOptions } from '../GOCommonOptions.js';
import HTMLImageElementObject from '../model/HTMLImageElementObject.js';
import IProperty from '../../../../axon/js/IProperty.js';

type HTMLImageElementObjectNodeOptions = PickRequired<NodeOptions, 'tandem'> & PickOptional<NodeOptions, 'visibleProperty'>;

class HTMLImageElementObjectNode extends Node {

  /**
   * @param opticalObjectNode
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty - is dragging locked to horizontal?
   * @param wasDraggedProperty
   * @param providedOptions
   */
  constructor( opticalObjectNode: HTMLImageElementObject,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               wasDraggedProperty: IProperty<boolean>,
               providedOptions: HTMLImageElementObjectNodeOptions ) {

    const options = optionize<HTMLImageElementObjectNodeOptions, {}, NodeOptions>( {

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const imageNode = new Image( opticalObjectNode.htmlImageElementProperty.value );

    // Wrap imageNode in a Node. We need to scale imageNode, but do not want its focus highlight to scale.
    const wrappedImageNode = new Node( {
      children: [ imageNode ]
    } );
    this.addChild( wrappedImageNode );
    this.setFocusHighlight( new FocusHighlightFromNode( wrappedImageNode ) );

    const cueingArrowsNode = new CueingArrowsNode( {
      visibleProperty: new DerivedProperty(
        [ this.inputEnabledProperty, wasDraggedProperty ],
        ( inputEnabled: boolean, wasDragged: boolean ) =>
          ( GOQueryParameters.enableCueingArrows && inputEnabled && !wasDragged ) )
    } );
    this.addChild( cueingArrowsNode );

    const updateScale = () => {
      const sceneBounds = opticalObjectNode.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( sceneBounds );
      const scaleX = ( viewBounds.width / imageNode.width ) || GOConstants.MIN_SCALE; // prevent zero scale
      const scaleY = ( viewBounds.height / imageNode.height ) || GOConstants.MIN_SCALE; // prevent zero scale
      imageNode.scale( scaleX, scaleY );
    };

    // Change the PNG image.
    opticalObjectNode.htmlImageElementProperty.link( htmlImageElement => {
      imageNode.image = htmlImageElement;
      updateScale();
    } );

    // Translate and scale
    opticalObjectNode.boundsProperty.link( bounds => {
      this.translation = modelViewTransform.modelToViewBounds( bounds ).leftTop;
      updateScale();
    } );

    // Drag bounds, in model coordinates. Keep the full object within the model bounds and to the left of the optic.
    // Use Math.floor herein to avoid floating-point rounding errors that result in unwanted changes and additional
    // reentrant Properties, see https://github.com/phetsims/geometric-optics/issues/317.
    const dragBoundsProperty = new DerivedProperty(
      [ opticalObjectNode.boundsProperty, sceneBoundsProperty, dragLockedProperty ],
      ( opticalObjectNodeBounds: Bounds2, sceneBounds: Bounds2, dragLocked: boolean ) => {

        const opticalObjectNodePosition = opticalObjectNode.positionProperty.value;
        const minX = Math.floor( sceneBounds.minX + ( opticalObjectNodePosition.x - opticalObjectNodeBounds.minX ) );
        const maxX = Math.floor( opticPositionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC );
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {

          // Dragging is 1D, constrained horizontally to object's current position.
          minY = opticalObjectNodePosition.y;
          maxY = minY;
        }
        else {

          // Dragging is 2D.
          minY = Math.floor( sceneBounds.minY + ( opticalObjectNodePosition.y - opticalObjectNodeBounds.minY ) );
          maxY = Math.floor( sceneBounds.maxY - ( opticalObjectNodeBounds.maxY - opticalObjectNodePosition.y ) );
        }
        return new Bounds2( minX, minY, maxX, maxY );
      }, {

        // Because changing dragBoundsProperty may necessitate moving opticalObjectNode inside the new drag bounds,
        // therefore changing dependency opticalObjectNode.boundsProperty.
        reentrant: true //TODO https://github.com/phetsims/geometric-optics/issues/349 is this needed?
      } );
    dragBoundsProperty.link( dragBounds => {
      opticalObjectNode.positionProperty.value = dragBounds.closestPointTo( opticalObjectNode.positionProperty.value );
    } );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragListener = new DragListener( {
      positionProperty: opticalObjectNode.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: drag,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      optionize<KeyboardDragListenerOptions, {}, KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: opticalObjectNode.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: modelViewTransform,
        drag: drag,
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the framed object.
    Property.multilink( [ wrappedImageNode.boundsProperty, cueingArrowsNode.boundsProperty ],
      ( wrappedImageNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        cueingArrowsNode.right = wrappedImageNode.left - 5;
        cueingArrowsNode.centerY = wrappedImageNode.centerY;
      } );

    // Update cursor and cueing arrows to reflect how this Node is draggable.
    dragLockedProperty.link( locked => {
      this.cursor = locked ? 'ew-resize' : 'pointer';
      cueingArrowsNode.setDirection( locked ? 'horizontal' : 'both' );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'HTMLImageElementObjectNode', HTMLImageElementObjectNode );
export default HTMLImageElementObjectNode;
export type { HTMLImageElementObjectNodeOptions };