// Copyright 2021, University of Colorado Boulder

/**
 * View of the source/object
 * The sourceObject is represented by an object or a source of light
 * The sourceObject can be dragged
 * A secondary object can be dragged as a point or source of light
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import SecondSourceNode from './SecondSourceNode.js';

class SourceObjectNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} secondSourceVisibleProperty
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * */
  constructor( representationProperty, sourceObject, secondSourceVisibleProperty, visibleModelBoundsProperty,
               opticPositionProperty, modelViewTransform ) {

    super( {
      cursor: 'pointer'
    } );

    // representation (image)  of the source/object. the source/object is upright and right facing
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
    const translateSourceObject = leftTopModel => {
      sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( leftTopModel );
    };

    // Keep cueing arrows next to the source object.
    sourceObjectImage.boundsProperty.link( bounds => {
      cueingArrows.right = sourceObjectImage.left - 10;
      cueingArrows.centerY = sourceObjectImage.centerY;
    } );

    // {DerivedProperty.<Bounds2} keep at least half of the projector screen within visible bounds and right of the optic.
    // opticPositionProperty is not a dependency because it only moves in the y dimension, so x is constant.
    const dragBoundsProperty = new DerivedProperty(
      [ visibleModelBoundsProperty, representationProperty ],
      ( visibleBounds, representation ) =>
        new Bounds2( visibleBounds.minX,
          visibleBounds.minY + sourceObject.boundsProperty.value.height,
          opticPositionProperty.value.x - sourceObject.boundsProperty.value.width,
          visibleBounds.maxY )
    );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      positionProperty: sourceObject.leftTopProperty,
      transform: modelViewTransform,
      dragBoundsProperty: dragBoundsProperty,
      end: () => {
        cueingArrows.visible = false;
      }
    } );
    sourceObjectImage.addInputListener( sourceObjectDragListener );

    sourceObject.leftTopProperty.link( position => {
      scaleSourceObject();
      translateSourceObject( position );
    } );

    dragBoundsProperty.link( dragBounds => {
      sourceObject.leftTopProperty.value = dragBounds.closestPointTo( sourceObject.leftTopProperty.value );
    } );

    // create a node to hold the second source
    const secondSourceNode = new SecondSourceNode( representationProperty, sourceObject, modelViewTransform, {
      visibleProperty: secondSourceVisibleProperty
    } );
    this.addChild( secondSourceNode );

    representationProperty.link( representation => {
      sourceObjectImage.image = representation.rightFacingUpright;
      scaleSourceObject();
      translateSourceObject( sourceObject.leftTopProperty.value );
    } );

    // @private
    this.cueingArrows = cueingArrows;
    this.secondSourceNode = secondSourceNode;
  }

  /**
   * Reset this node
   * @public
   */
  reset() {
    this.cueingArrows.visible = true;
    this.secondSourceNode.reset();
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;