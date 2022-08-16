// Copyright 2021-2022, University of Colorado Boulder

/**
 * HTMLImageElementObjectNode is the view of an object that uses an HTMLImageElement for its visual representation.
 * Framed objects and light objects are subclasses of this object type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, FocusHighlightFromNode, Image, KeyboardDragListener, KeyboardDragListenerOptions, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import GOConstants from '../GOConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HTMLImageElementObject from '../model/HTMLImageElementObject.js';
import TProperty from '../../../../axon/js/TProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import OpticalObjectNode, { OpticalObjectNodeOptions } from './OpticalObjectNode.js';
import Multilink from '../../../../axon/js/Multilink.js';

export type HTMLImageElementObjectNodeOptions = OpticalObjectNodeOptions;

export default class HTMLImageElementObjectNode extends OpticalObjectNode {

  /**
   * @param htmlImageElementObject - model element
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty - position of the optic
   * @param modelViewTransform
   * @param objectDragModeProperty - constrains how the optical object can be dragged
   * @param wasDraggedProperty - was this optical object dragged?
   * @param providedOptions
   */
  public constructor( htmlImageElementObject: HTMLImageElementObject,
                      sceneBoundsProperty: TReadOnlyProperty<Bounds2>,
                      opticPositionProperty: TReadOnlyProperty<Vector2>,
                      modelViewTransform: ModelViewTransform2,
                      objectDragModeProperty: TReadOnlyProperty<ObjectDragMode>,
                      wasDraggedProperty: TProperty<boolean>,
                      providedOptions: HTMLImageElementObjectNodeOptions ) {

    super( htmlImageElementObject, objectDragModeProperty, wasDraggedProperty, providedOptions );

    const imageNode = new Image( htmlImageElementObject.htmlImageElementProperty.value );

    // Wrap imageNode in a Node. We need to scale imageNode, but do not want its focus highlight to scale.
    const wrappedImageNode = new Node( {
      children: [ imageNode ]
    } );
    this.addChild( wrappedImageNode );
    this.setFocusHighlight( new FocusHighlightFromNode( wrappedImageNode ) );

    const updateScale = () => {
      const sceneBounds = htmlImageElementObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( sceneBounds );
      const scaleX = ( viewBounds.width / imageNode.width ) || GOConstants.MIN_SCALE; // prevent zero scale
      const scaleY = ( viewBounds.height / imageNode.height ) || GOConstants.MIN_SCALE; // prevent zero scale
      imageNode.scale( scaleX, scaleY );
    };

    // Change the PNG image.
    htmlImageElementObject.htmlImageElementProperty.link( htmlImageElement => {
      imageNode.image = htmlImageElement;
      updateScale();
    } );

    // Translate and scale
    htmlImageElementObject.boundsProperty.link( bounds => {
      this.translation = modelViewTransform.modelToViewBounds( bounds ).leftTop;
      updateScale();
    } );

    // Drag bounds, in model coordinates. Keep the full object within the model bounds and to the left of the optic.
    // Use Math.floor herein to avoid floating-point rounding errors that result in unwanted changes and additional
    // reentrant Properties, see https://github.com/phetsims/geometric-optics/issues/317.
    const dragBoundsProperty = new DerivedProperty(
      [ htmlImageElementObject.boundsProperty, sceneBoundsProperty, objectDragModeProperty ],
      ( htmlImageElementObjectBounds, sceneBounds, objectDragMode ) => {

        const htmlImageElementObjectPosition = htmlImageElementObject.positionProperty.value;
        const minX = Math.floor( sceneBounds.minX + ( htmlImageElementObjectPosition.x - htmlImageElementObjectBounds.minX ) );
        const maxX = Math.floor( opticPositionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC );
        let minY: number;
        let maxY: number;

        if ( objectDragMode === 'freeDragging' ) {

          // free dragging
          minY = Math.floor( sceneBounds.minY + ( htmlImageElementObjectPosition.y - htmlImageElementObjectBounds.minY ) );
          maxY = Math.floor( sceneBounds.maxY - ( htmlImageElementObjectBounds.maxY - htmlImageElementObjectPosition.y ) );
        }
        else {

          // horizontal dragging, locked to the object's current y position
          minY = htmlImageElementObjectPosition.y;
          maxY = minY;
        }
        return new Bounds2( minX, minY, maxX, maxY );
      } );

    // Keep the object inside the drag bounds. This is done in the next animation frame to prevent problems with
    // reentrant Properties, as in https://github.com/phetsims/geometric-optics/issues/325.  dragBoundsProperty is
    // derived from htmlImageElementObject.boundsProperty, and will change htmlImageElementObject.boundsProperty by
    // setting htmlImageElementObject.positionProperty.
    dragBoundsProperty.link( dragBounds => {
      const closestPoint = dragBounds.closestPointTo( htmlImageElementObject.positionProperty.value );
      if ( !closestPoint.equals( htmlImageElementObject.positionProperty.value ) ) {
        stepTimer.setTimeout( () => {
          htmlImageElementObject.positionProperty.value = closestPoint;
        }, 0 );
      }
    } );

    const dragListener = new DragListener( {
      positionProperty: htmlImageElementObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: () => this.drag(),
      tandem: providedOptions.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: htmlImageElementObject.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: modelViewTransform,
        drag: () => this.drag(),
        tandem: providedOptions.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the framed object.
    Multilink.multilink( [ wrappedImageNode.boundsProperty, this.cueingArrowsNode.boundsProperty ],
      ( wrappedImageNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        this.cueingArrowsNode.right = wrappedImageNode.left - 5;
        this.cueingArrowsNode.centerY = wrappedImageNode.centerY;
      } );
  }
}

geometricOptics.register( 'HTMLImageElementObjectNode', HTMLImageElementObjectNode );