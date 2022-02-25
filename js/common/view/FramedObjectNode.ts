// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectNode is the view of a FramedObject, an object in a picture frame with 3D perspective.
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
import FramedObject from '../model/FramedObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import GOQueryParameters from '../GOQueryParameters.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { PickOptional } from '../../../../phet-core/js/types/PickOptional.js';

type FramedObjectNodeOptions = PickRequired<NodeOptions, 'tandem'> & PickOptional<NodeOptions, 'visibleProperty'>;

class FramedObjectNode extends Node {

  // Resets things that are specific to this class.
  private readonly resetFramedObjectNode: () => void;

  /**
   * @param framedObject
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty - is dragging locked to horizontal?
   * @param providedOptions
   */
  constructor( framedObject: FramedObject,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               providedOptions: FramedObjectNodeOptions ) {

    const options = optionize<FramedObjectNodeOptions, {}, NodeOptions>( {

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const imageNode = new Image( framedObject.objectHTMLImageElementsProperty.value.rightFacingUpright );

    // Wrap imageNode in a Node. We need to scale imageNode, but do not want its focus highlight to scale.
    const wrappedImageNode = new Node( {
      children: [ imageNode ]
    } );
    this.addChild( wrappedImageNode );
    this.setFocusHighlight( new FocusHighlightFromNode( wrappedImageNode ) );

    const wasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'wasDraggedProperty' ),
      phetioReadOnly: true
    } );

    const cueingArrowsNode = new CueingArrowsNode( {
      visibleProperty: new DerivedProperty(
        [ this.inputEnabledProperty, wasDraggedProperty ],
        ( inputEnabled: boolean, wasDragged: boolean ) =>
          ( GOQueryParameters.enableCueingArrows && inputEnabled && !wasDragged ) )
    } );
    this.addChild( cueingArrowsNode );

    const updateScale = () => {
      const sceneBounds = framedObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( sceneBounds );
      const scaleX = ( viewBounds.width / imageNode.width ) || GOConstants.MIN_SCALE; // prevent zero scale
      const scaleY = ( viewBounds.height / imageNode.height ) || GOConstants.MIN_SCALE; // prevent zero scale
      imageNode.scale( scaleX, scaleY );
    };

    // Change the PNG image.
    framedObject.objectHTMLImageElementsProperty.link( objectHTMLImageElements => {
      imageNode.image = objectHTMLImageElements.rightFacingUpright;
      updateScale();
    } );

    // Translate and scale
    framedObject.boundsProperty.link( bounds => {
      this.translation = modelViewTransform.modelToViewBounds( bounds ).leftTop;
      updateScale();
    } );

    // Drag bounds, in model coordinates. Keep the full object within the model bounds and to the left of the optic.
    // Use Math.floor herein to avoid floating-point rounding errors that result in unwanted changes and additional
    // reentrant Properties, see https://github.com/phetsims/geometric-optics/issues/317.
    const dragBoundsProperty = new DerivedProperty(
      [ framedObject.boundsProperty, sceneBoundsProperty, dragLockedProperty ],
      ( framedObjectBounds: Bounds2, sceneBounds: Bounds2, dragLocked: boolean ) => {

        const framedObjectPosition = framedObject.positionProperty.value;
        const minX = Math.floor( sceneBounds.minX + ( framedObjectPosition.x - framedObjectBounds.minX ) );
        const maxX = Math.floor( opticPositionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC );
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {

          // Dragging is 1D, constrained horizontally to object's current position.
          minY = framedObjectPosition.y;
          maxY = minY;
        }
        else {

          // Dragging is 2D.
          minY = Math.floor( sceneBounds.minY + ( framedObjectPosition.y - framedObjectBounds.minY ) );
          maxY = Math.floor( sceneBounds.maxY - ( framedObjectBounds.maxY - framedObjectPosition.y ) );
        }
        return new Bounds2( minX, minY, maxX, maxY );
      }, {

        // Because changing dragBoundsProperty may necessitate moving framedObject inside the new drag bounds,
        // therefore changing dependency framedObject.boundsProperty.
        reentrant: true
      } );
    dragBoundsProperty.link( dragBounds => {
      framedObject.positionProperty.value = dragBounds.closestPointTo( framedObject.positionProperty.value );
    } );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragListener = new DragListener( {
      positionProperty: framedObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: drag,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );
                                          
    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when KeyboardDragListenerOptions exists
    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: framedObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      drag: drag
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
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

    this.addLinkedElement( framedObject, {
      tandem: options.tandem.createTandem( 'framedObject' )
    } );

    this.resetFramedObjectNode = (): void => {
      wasDraggedProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetFramedObjectNode();
  }
}

geometricOptics.register( 'FramedObjectNode', FramedObjectNode );
export default FramedObjectNode;