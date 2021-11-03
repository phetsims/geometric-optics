// Copyright 2021, University of Colorado Boulder

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
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import SourceObject from '../model/SourceObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Representation from '../model/Representation.js';

class SourceObjectNode extends Node {

  // so that 1st and 2nd light source can share drag bounds
  public readonly dragBoundsProperty: Property<Bounds2>;
  private readonly cueingArrows: ArrowNode;

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * */
  constructor( representationProperty: Property<Representation>, sourceObject: SourceObject,
               modelBoundsProperty: Property<Bounds2>, opticPositionProperty: Property<Vector2>,
               modelViewTransform: ModelViewTransform2 ) {

    // Origin of this Node is at the upper-left corner of sourceObjectImage.
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright );

    const cueingArrows = new ArrowNode( 0, 0, 0, 65, {
      doubleHead: true,
      tailWidth: 15,
      headWidth: 30,
      headHeight: 15,
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black',
      lineWidth: 1
    } );

    super( {
      children: [ sourceObjectImage, cueingArrows ]
    } );

    // Keep cueing arrows next to the source object.
    // @ts-ignore TODO-TS Property 'boundsProperty' does not exist on type 'Image'.
    sourceObjectImage.boundsProperty.link( ( bounds: Bounds2 ) => {
      // @ts-ignore TODO-TS Property 'left' does not exist on type 'Image'.
      cueingArrows.right = sourceObjectImage.left - 10;
      // @ts-ignore TODO-TS Property 'centerY' does not exist on type 'Image'.
      cueingArrows.centerY = sourceObjectImage.centerY;
    } );

    // Scale the source object.
    const scaleSourceObject = () => {

      // @ts-ignore TODO-TS Property 'width' does not exist on type 'Image'.
      const initialWidth = sourceObjectImage.width;
      // @ts-ignore TODO-TS Property 'height' does not exist on type 'Image'.
      const initialHeight = sourceObjectImage.height;

      const bounds = sourceObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( bounds );

      const scaleX = viewBounds.width / initialWidth;
      const scaleY = viewBounds.height / initialHeight;
      // @ts-ignore TODO-TS Property 'scale' does not exist on type 'Image'.
      sourceObjectImage.scale( scaleX, scaleY );
    };

    // Translate the source object to the specified position.
    // This Node's origin is at the left-top of sourceObjectImage, so set translation.
    const translateSourceObject = ( leftTop: Vector2 ) => {
      this.translation = modelViewTransform.modelToViewPosition( leftTop );
    };

    // {DerivedProperty.<Bounds2} keep at least half of the projection screen within visible bounds and right of the optic.
    // opticPositionProperty is not a dependency because it only moves in the y dimension, so x is constant.
    //TODO This is problematic. There's no dependency on representationProperty here. The actual dependency is on
    // sourceObject.boundsProperty, and we're relying on that changing before this value is derived. But changing
    // the dependency to sourceObject.boundsProperty results in a reentry assertion failure.
    this.dragBoundsProperty = new DerivedProperty<Bounds2>(
      [ modelBoundsProperty, representationProperty ],
      ( modelBounds: Bounds2, representation: Representation ) =>
        new Bounds2(
          modelBounds.minX,
          modelBounds.minY + sourceObject.boundsProperty.value.height,
          opticPositionProperty.value.x - sourceObject.boundsProperty.value.width,
          modelBounds.maxY
        )
    );
    this.dragBoundsProperty.link( ( dragBounds: Bounds2 ) => {
      sourceObject.leftTopProperty.value = dragBounds.closestPointTo( sourceObject.leftTopProperty.value );
    } );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: sourceObject.leftTopProperty,
      transform: modelViewTransform,
      dragBoundsProperty: this.dragBoundsProperty,
      end: () => {
        cueingArrows.visible = false;
      }
    } );
    this.addInputListener( sourceObjectDragListener );

    sourceObject.leftTopProperty.link( ( leftTop: Vector2 ) => {
      scaleSourceObject();
      translateSourceObject( leftTop );
    } );

    representationProperty.link( ( representation: Representation ) => {
      sourceObjectImage.image = representation.rightFacingUpright;
      scaleSourceObject();
      translateSourceObject( sourceObject.leftTopProperty.value );
    } );

    // @private
    this.cueingArrows = cueingArrows;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Reset this node
   * @public
   */
  reset() {
    this.cueingArrows.visible = true;
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;