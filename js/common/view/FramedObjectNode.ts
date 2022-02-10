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
import { DragListener, FocusHighlightFromNode, Image, KeyboardDragListener, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import FramedObject from '../model/FramedObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import IProperty from '../../../../axon/js/IProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

// Closest that optical object can be moved to the optic, in cm. This avoids problems that occur when the object is
// too close to a mirror. See https://github.com/phetsims/geometric-optics/issues/73
const MIN_X_DISTANCE_TO_OPTIC = 40;

type FramedObjectNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class FramedObjectNode extends Node {

  private readonly resetFramedObjectNode: () => void;

  /**
   * @param framedObject
   * @param modelBoundsProperty
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty
   * @param providedOptions
   */
  constructor( framedObject: FramedObject,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               providedOptions: FramedObjectNodeOptions ) {

    const imageNode = new Image( framedObject.objectHTMLImageElementsProperty.value.rightFacingUpright );

    // Wrap imageNode in a Node. We need to scale imageNode, but do not want its focus highlight to scale.
    const wrappedImageNode = new Node( {
      children: [ imageNode ]
    } );

    const cueingArrowsNode = new CueingArrowsNode();

    const options = merge( {
      children: [ wrappedImageNode, cueingArrowsNode ],

      // pdom options
      tagName: 'div',
      focusable: true,
      focusHighlight: new FocusHighlightFromNode( wrappedImageNode ),

      // phet-io options
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const updateScale = () => {
      const modelBounds = framedObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
      const scaleX = viewBounds.width / imageNode.width;
      const scaleY = viewBounds.height / imageNode.height;
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
    const dragBoundsProperty = new DerivedProperty(
      [ framedObject.boundsProperty, modelBoundsProperty, dragLockedProperty ],
      ( framedObjectBounds: Bounds2, modelBounds: Bounds2, dragLocked: boolean ) => {

        const framedObjectPosition = framedObject.positionProperty.value;
        const minX = modelBounds.minX + ( framedObjectPosition.x - framedObjectBounds.minX );
        const maxX = opticPositionProperty.value.x - MIN_X_DISTANCE_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {

          // Dragging is 1D, constrained horizontally to object's current position.
          minY = framedObjectPosition.y;
          maxY = minY;
        }
        else {

          // Dragging is 2D.
          minY = modelBounds.minY + ( framedObjectPosition.y - framedObjectBounds.minY );
          maxY = modelBounds.maxY - ( framedObjectBounds.maxY - framedObjectPosition.y );
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

    const wasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'wasDraggedProperty' ),
      phetioReadOnly: true
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

    cueingArrowsNode.setVisibleProperty( new DerivedProperty(
      [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty, wasDraggedProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean, wasDragged: boolean ) =>
        ( cueingArrowsEnabled && inputEnabled && !wasDragged ) ) );

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