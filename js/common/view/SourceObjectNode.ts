// Copyright 2021-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/217 factor out LightSourceNode and rename this FramedObjectNode
/**
 * SourceObjectNode is the view of the source object and first light source.
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
import SourceObject from '../model/SourceObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Representation from '../model/Representation.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../GOConstants.js';
import IProperty from '../../../../axon/js/IProperty.js';

// Closest that source object can be moved to the optic, in cm. This avoids problems that occur when the object is
// too close to a mirror. See https://github.com/phetsims/geometric-optics/issues/73
const MIN_X_DISTANCE_TO_OPTIC = 40;

type SourceObjectNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class SourceObjectNode extends Node {

  // so that 1st and 2nd light source can share drag bounds
  public readonly dragBoundsProperty: IReadOnlyProperty<Bounds2>;
  private readonly resetSourceObjectNode: () => void;

  /**
   * @param representationProperty
   * @param sourceObject
   * @param modelBoundsProperty
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty
   * @param providedOptions
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, sourceObject: SourceObject,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>, opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2, dragLockedProperty: IReadOnlyProperty<boolean>,
               providedOptions: SourceObjectNodeOptions ) {

    const imageNode = new Image( representationProperty.value.rightFacingUpright );

    // Wrap imageNode in a Node. We need to scale imageNode, but do not want its focus highlight to scale.
    const sourceObjectNode = new Node( {
      children: [ imageNode ]
    } );

    const cueingArrowsNode = new CueingArrowsNode();

    const options = merge( {
      children: [ sourceObjectNode, cueingArrowsNode ],

      // pdom options
      tagName: 'div',
      focusable: true,
      focusHighlight: new FocusHighlightFromNode( sourceObjectNode ),

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const updateScale = () => {
      const modelBounds = sourceObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
      const scaleX = viewBounds.width / imageNode.width;
      const scaleY = viewBounds.height / imageNode.height;
      imageNode.scale( scaleX, scaleY );
    };

    // Change the PNG image.
    representationProperty.link( representation => {
      imageNode.image = representation.rightFacingUpright;
      updateScale();
    } );

    // Translate and scale
    sourceObject.boundsProperty.link( bounds => {
      this.translation = modelViewTransform.modelToViewBounds( bounds ).leftTop;
      updateScale();
    } );

    // Drag bounds, in model coordinates. Keep the full object within the model bounds and to the left of the optic.
    this.dragBoundsProperty = new DerivedProperty(
      [ sourceObject.boundsProperty, modelBoundsProperty, dragLockedProperty ],
      ( sourceObjectBounds: Bounds2, modelBounds: Bounds2, dragLocked: boolean ) => {

        const sourceObjectPosition = sourceObject.positionProperty.value;
        const minX = modelBounds.minX + ( sourceObjectPosition.x - sourceObjectBounds.minX );
        const maxX = opticPositionProperty.value.x - MIN_X_DISTANCE_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {

          // Dragging is 1D, constrained horizontally to object's current position.
          minY = sourceObjectPosition.y;
          maxY = minY;
        }
        else {

          // Dragging is 2D.
          minY = modelBounds.minY + ( sourceObjectPosition.y - sourceObjectBounds.minY );
          maxY = modelBounds.maxY - ( sourceObjectBounds.maxY - sourceObjectPosition.y );
        }
        return new Bounds2( minX, minY, maxX, maxY );
      }, {

        // Because changing dragBoundsProperty may necessitate moving sourceObject inside the new drag bounds,
        // therefore changing dependency sourceObject.boundsProperty.
        reentrant: true
      } );
    this.dragBoundsProperty.link( dragBounds => {
      sourceObject.positionProperty.value = dragBounds.closestPointTo( sourceObject.positionProperty.value );
    } );

    const dragListener = new DragListener( {
      positionProperty: sourceObject.positionProperty,
      dragBoundsProperty: this.dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: () => {
        cueingArrowsNode.visible = false;
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: sourceObject.positionProperty,
      dragBoundsProperty: this.dragBoundsProperty,
      transform: modelViewTransform
    } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the source object.
    Property.multilink( [ sourceObjectNode.boundsProperty, cueingArrowsNode.boundsProperty ],
      ( sourceObjectBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        cueingArrowsNode.right = sourceObjectNode.left - 10;
        cueingArrowsNode.centerY = sourceObjectNode.centerY;
      } );

    Property.multilink(
      [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean ) => {
        cueingArrowsNode.visible = ( cueingArrowsEnabled && inputEnabled );
      }
    );

    // Update cursor and cueing arrows to reflect how this Node is draggable.
    dragLockedProperty.link( locked => {
      this.cursor = locked ? 'ew-resize' : 'pointer';
      cueingArrowsNode.setDirection( locked ? 'horizontal' : 'both' );
    } );

    this.resetSourceObjectNode = (): void => {
      cueingArrowsNode.visible = ( GOGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetSourceObjectNode();
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;