// Copyright 2021, University of Colorado Boulder

/**
 * View of the source/object
 * The sourceObject is represented by an object or a source of light
 * The sourceObject can be dragged
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import SourceObject from '../model/SourceObject.js';

class SourceObjectNode extends Node {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * */
  constructor( representationProperty, sourceObject, modelBoundsProperty,
               opticPositionProperty, modelViewTransform ) {

    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( sourceObject instanceof SourceObject );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( opticPositionProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    super( {
      cursor: 'pointer'
    } );

    // Origin of this Node is at the upper-left corner of sourceObjectImage.
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright );
    this.addChild( sourceObjectImage );

    const cueingArrows = new ArrowNode( 0, 0, 0, 65, {
      doubleHead: true,
      tailWidth: 15,
      headWidth: 30,
      headHeight: 15,
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black',
      lineWidth: 1
    } );
    this.addChild( cueingArrows );

    // Keep cueing arrows next to the source object.
    sourceObjectImage.boundsProperty.link( bounds => {
      cueingArrows.right = sourceObjectImage.left - 10;
      cueingArrows.centerY = sourceObjectImage.centerY;
    } );

    // Scale the source object.
    const scaleSourceObject = () => {

      const initialWidth = sourceObjectImage.width;
      const initialHeight = sourceObjectImage.height;

      const bounds = sourceObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( bounds );

      const scaleX = viewBounds.width / initialWidth;
      const scaleY = viewBounds.height / initialHeight;
      sourceObjectImage.scale( scaleX, scaleY );
    };

    // Translate the source object to the specified position.
    // This Node's origin is at the left-top of sourceObjectImage, so set translation.
    const translateSourceObject = leftTop => {
      this.translation = modelViewTransform.modelToViewPosition( leftTop );
    };

    // {DerivedProperty.<Bounds2} keep at least half of the projector screen within visible bounds and right of the optic.
    // opticPositionProperty is not a dependency because it only moves in the y dimension, so x is constant.
    //TODO This is problematic. There's no dependency on representationProperty here. The actual dependency is on
    // sourceObject.boundsProperty, and we're relying on that changing before this value is derived. But changing
    // the dependency to sourceObject.boundsProperty results in a reentry assertion failure.
    const dragBoundsProperty = new DerivedProperty(
      [ modelBoundsProperty, representationProperty ],
      ( modelBounds, representation ) =>
        new Bounds2(
          modelBounds.minX,
          modelBounds.minY + sourceObject.boundsProperty.value.height,
          opticPositionProperty.value.x - sourceObject.boundsProperty.value.width,
          modelBounds.maxY
        )
    );
    dragBoundsProperty.link( dragBounds => {
      sourceObject.leftTopProperty.value = dragBounds.closestPointTo( sourceObject.leftTopProperty.value );
    } );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      positionProperty: sourceObject.leftTopProperty,
      transform: modelViewTransform,
      dragBoundsProperty: dragBoundsProperty,
      end: () => {
        cueingArrows.visible = false;
      }
    } );
    this.addInputListener( sourceObjectDragListener );

    sourceObject.leftTopProperty.link( leftTop => {
      scaleSourceObject();
      translateSourceObject( leftTop );
    } );

    representationProperty.link( representation => {
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