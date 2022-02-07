// Copyright 2021-2022, University of Colorado Boulder

//TODO lots of duplication with FramedObjectNode
/**
 * LightSourceNode is the view of a LightSource.
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
import CueingArrowsNode from '../../common/view/CueingArrowsNode.js';
import GOGlobalOptions from '../../common/GOGlobalOptions.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import GOConstants from '../../common/GOConstants.js';
import IProperty from '../../../../axon/js/IProperty.js';
import LightSource from '../model/LightSource.js';

// Closest that source object can be moved to the optic, in cm. This avoids problems that occur when the object is
// too close to a mirror. See https://github.com/phetsims/geometric-optics/issues/73
const MIN_X_DISTANCE_TO_OPTIC = 40; //TODO duplicated in in FramedObjectNode

type LightSourceNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class LightSourceNode extends Node {

  private readonly resetLightSourceNode: () => void;

  /**
   * @param lightSource
   * @param modelBoundsProperty
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty
   * @param providedOptions
   */
  constructor( lightSource: LightSource,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               providedOptions: LightSourceNodeOptions ) {

    const imageNode = new Image( lightSource.htmlImageElement );

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
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const updateScale = () => {
      const modelBounds = lightSource.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
      const scaleX = viewBounds.width / imageNode.width;
      const scaleY = viewBounds.height / imageNode.height;
      imageNode.scale( scaleX, scaleY );
    };

    // Translate and scale
    lightSource.boundsProperty.link( bounds => {
      this.translation = modelViewTransform.modelToViewBounds( bounds ).leftTop;
      updateScale();
    } );

    // Drag bounds, in model coordinates. Keep the full object within the model bounds and to the left of the optic.
    const dragBoundsProperty = new DerivedProperty(
      [ lightSource.boundsProperty, modelBoundsProperty, dragLockedProperty ],
      ( lightSourceBounds: Bounds2, modelBounds: Bounds2, dragLocked: boolean ) => {

        const lightSourcePosition = lightSource.positionProperty.value;
        const minX = modelBounds.minX + ( lightSourcePosition.x - lightSourceBounds.minX );
        const maxX = opticPositionProperty.value.x - MIN_X_DISTANCE_TO_OPTIC;
        let minY: number;
        let maxY: number;

        if ( dragLocked ) {

          // Dragging is 1D, constrained horizontally to object's current position.
          minY = lightSourcePosition.y;
          maxY = minY;
        }
        else {

          // Dragging is 2D.
          minY = modelBounds.minY + ( lightSourcePosition.y - lightSourceBounds.minY );
          maxY = modelBounds.maxY - ( lightSourceBounds.maxY - lightSourcePosition.y );
        }
        return new Bounds2( minX, minY, maxX, maxY );
      }, {

        // Because changing dragBoundsProperty may necessitate moving light source inside the new drag bounds,
        // therefore changing dependency lightSource.boundsProperty.
        reentrant: true
      } );
    dragBoundsProperty.link( dragBounds => {
      lightSource.positionProperty.value = dragBounds.closestPointTo( lightSource.positionProperty.value );
    } );

    const dragListener = new DragListener( {
      positionProperty: lightSource.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      drag: () => {
        cueingArrowsNode.visible = false;
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: lightSource.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform
    } ) );
    this.addInputListener( keyboardDragListener );

    // Keep cueing arrows next to the source object.
    Property.multilink( [ wrappedImageNode.boundsProperty, cueingArrowsNode.boundsProperty ],
      ( wrappedImageNodeNodeBounds: Bounds2, cueingArrowsNodeBounds: Bounds2 ) => {
        cueingArrowsNode.right = wrappedImageNode.left - 10;
        cueingArrowsNode.centerY = wrappedImageNode.centerY;
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

    this.resetLightSourceNode = (): void => {
      cueingArrowsNode.visible = ( GOGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetLightSourceNode();
  }
}

geometricOptics.register( 'LightSourceNode', LightSourceNode );
export default LightSourceNode;