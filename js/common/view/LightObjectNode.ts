// Copyright 2021-2022, University of Colorado Boulder

//TODO lots of duplication with FramedObjectNode
/**
 * LightObjectNode is the view of a LightObject.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener, FocusHighlightFromNode, Image, KeyboardDragListener, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import GOGlobalOptions from '../../common/GOGlobalOptions.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../../common/GOConstants.js';
import IProperty from '../../../../axon/js/IProperty.js';
import LightObject from '../model/LightObject.js';

type LightObjectNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class LightObjectNode extends Node {

  /**
   * @param lightObject
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty
   * @param wasDraggedProperty - was any LightObjectNode dragged?
   * @param providedOptions
   */
  constructor( lightObject: LightObject,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               wasDraggedProperty: Property<boolean>,
               providedOptions: LightObjectNodeOptions ) {

    const options = merge( {

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const imageNode = new Image( lightObject.htmlImageElement );

    // Wrap imageNode in a Node. We need to scale imageNode, but do not want its focus highlight to scale.
    const wrappedImageNode = new Node( {
      children: [ imageNode ]
    } );
    this.addChild( wrappedImageNode );
    this.setFocusHighlight( new FocusHighlightFromNode( wrappedImageNode ) );

    const cueingArrowsNode = new CueingArrowsNode( {
      visibleProperty: new DerivedProperty(
        [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty, wasDraggedProperty ],
        ( cueingArrowsEnabled: boolean, inputEnabled: boolean, wasDragged: boolean ) =>
          ( cueingArrowsEnabled && inputEnabled && !wasDragged ) )
    } );
    this.addChild( cueingArrowsNode );

    const updateScale = () => {
      const sceneBounds = lightObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( sceneBounds );
      const scaleX = ( viewBounds.width / imageNode.width ) || GOConstants.MIN_SCALE; // prevent zero scale
      const scaleY = ( viewBounds.height / imageNode.height ) || GOConstants.MIN_SCALE; // prevent zero scale
      imageNode.scale( scaleX, scaleY );
    };

    // Translate and scale
    lightObject.boundsProperty.link( bounds => {
      this.translation = modelViewTransform.modelToViewBounds( bounds ).leftTop;
      updateScale();
    } );

    // Drag bounds, in model coordinates. Keep the full object within the model bounds and to the left of the optic.
    const dragBoundsProperty = new DerivedProperty(
      [ lightObject.boundsProperty, sceneBoundsProperty, dragLockedProperty ],
      ( lightObjectBounds: Bounds2, sceneBounds: Bounds2, dragLocked: boolean ) => {

        const lightObjectPosition = lightObject.positionProperty.value;
        const minX = sceneBounds.minX + ( lightObjectPosition.x - lightObjectBounds.minX );
        const maxX = opticPositionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {

          // Dragging is 1D, constrained horizontally to object's current position.
          minY = lightObjectPosition.y;
          maxY = minY;
        }
        else {

          // Dragging is 2D.
          minY = sceneBounds.minY + ( lightObjectPosition.y - lightObjectBounds.minY );
          maxY = sceneBounds.maxY - ( lightObjectBounds.maxY - lightObjectPosition.y );
        }
        return new Bounds2( minX, minY, maxX, maxY );
      }, {

        // Because changing dragBoundsProperty may necessitate moving light inside the new drag bounds,
        // therefore changing dependency lightObject.boundsProperty.
        reentrant: true
      } );
    dragBoundsProperty.link( dragBounds => {
      lightObject.positionProperty.value = dragBounds.closestPointTo( lightObject.positionProperty.value );
    } );

    this.addLinkedElement( wasDraggedProperty, {
      tandem: options.tandem.createTandem( 'wasDraggedProperty' )
    } );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragListener = new DragListener( {
      positionProperty: lightObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: drag,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: lightObject.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      drag: drag,
      transform: modelViewTransform
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the light image
    Property.multilink( [ wrappedImageNode.boundsProperty, cueingArrowsNode.boundsProperty ],
      ( wrappedImageNodeNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
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

geometricOptics.register( 'LightObjectNode', LightObjectNode );
export default LightObjectNode;