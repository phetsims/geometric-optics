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
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import Representation from '../model/Representation.js';

// constants
const OVERALL_SCALE_FACTOR = 1;
const LIGHT_OFFSET_VECTOR = new Vector2( 50, -23 ); // in model coordinates
const CUEING_ARROW_LENGTH = 20;
const CUEING_ARROW_OPTIONS = {
  fill: 'rgb(255,0,0)',
  tailWidth: 6,
  headWidth: 12,
  headHeight: 6
};

class SourceObjectNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} secondSourceVisibleProperty
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * */
  constructor( representationProperty, sourceObject, secondSourceVisibleProperty, visibleModelBoundsProperty,
               modelViewTransform ) {

    super( {
      cursor: 'pointer'
    } );

    // representation (image)  of the source/object. the source/object is upright and right facing
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright );
    this.addChild( sourceObjectImage );

    // @private
    this.sourceCueingArrowsNode = new ArrowNode( 0, 0, 0, 65, {
      doubleHead: true,
      tailWidth: 15,
      headWidth: 30,
      headHeight: 15,
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black',
      lineWidth: 1
    } );
    this.addChild( this.sourceCueingArrowsNode );

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
    const translateSourceObject = modelPosition => {
      sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( modelPosition );
    };

    // Keep cueing arrows next to the source object.
    sourceObjectImage.boundsProperty.link( bounds => {
      this.sourceCueingArrowsNode.right = sourceObjectImage.left - 10;
      this.sourceCueingArrowsNode.centerY = sourceObjectImage.centerY;
    } );

    // {DerivedProperty.<Bounds2} keep at least half of the projector screen within visible bounds and right of the optic
    const dragBoundsProperty = new DerivedProperty(
      [ visibleModelBoundsProperty, representationProperty ],
      visibleBounds => new Bounds2( visibleBounds.minX,
        visibleBounds.minY + sourceObject.boundsProperty.value.height,

        // REVIEW: This feels like a code smell to get the optic position from the source here. The optic position is important to the model, but it seems weird that we get the position from the source object. Does it feel like too close of coupling to you?
        sourceObject.getOpticPosition().x - sourceObject.boundsProperty.value.width,
        visibleBounds.maxY )
    );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      positionProperty: sourceObject.leftTopProperty,
      transform: modelViewTransform,
      dragBoundsProperty: dragBoundsProperty,
      drag: () => {
        this.sourceCueingArrowsNode.visible = false;
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
    const secondSourceNode = new Node();
    this.addChild( secondSourceNode );

    // Property for the position of the second source node
    const secondSourcePositionProperty = new Vector2Property( sourceObject.secondPositionProperty.value );

    // create the icon for second source (for object source)
    const secondSourcePointIcon = SourceObjectNode.createSecondSourcePointIcon();

    // create a layer to host the cueing arrows
    this.secondSourceCueingArrowsLayer = new Node();

    // create and add cueing arrow
    const upArrowNode = new ArrowNode( 0, 0, 0, -CUEING_ARROW_LENGTH, CUEING_ARROW_OPTIONS );
    const downArrowNode = new ArrowNode( 0, 0, 0, +CUEING_ARROW_LENGTH, CUEING_ARROW_OPTIONS );
    upArrowNode.bottom = secondSourcePointIcon.top - 5;
    downArrowNode.top = secondSourcePointIcon.bottom + 5;
    this.secondSourceCueingArrowsLayer.addChild( upArrowNode );
    this.secondSourceCueingArrowsLayer.addChild( downArrowNode );

    // create the light image for the second source
    const secondSourceImage = new Image( Representation.LIGHT.secondSourceImage, { scale: OVERALL_SCALE_FACTOR } );

    // create drag listener for second source
    const secondSourceDragListener = new DragListener( {
      pressCursor: 'ns-resize',
      useInputListenerCursor: true,
      positionProperty: secondSourcePositionProperty,
      transform: modelViewTransform,
      drag: () => {
        if ( representationProperty.value.isObject ) {
          this.secondSourceCueingArrowsLayer.visible = false;
        }
      }
    } );

    secondSourceNode.addInputListener( secondSourceDragListener );

    /**
     * Set the position of the second source based on the position.
     * @param {Vector2} position - model position of the second source
     */
    function setSecondSourcePosition( position ) {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      if ( representationProperty.value.isObject ) {
        secondSourceNode.center = viewPosition;
      }
      else {
        secondSourceNode.leftTop = viewPosition.minus( modelViewTransform.modelToViewDelta( LIGHT_OFFSET_VECTOR ) );
      }
    }

    representationProperty.link( representation => {
      sourceObjectImage.image = representation.rightFacingUpright;

      scaleSourceObject();
      translateSourceObject( sourceObject.leftTopProperty.value );

      // Remove all children from the second source.
      secondSourceNode.removeAllChildren();

      if ( representation.isObject ) {

        // add circle and cueing arrows
        secondSourceNode.addChild( secondSourcePointIcon );
        secondSourceNode.touchArea = secondSourcePointIcon.bounds.dilated( 10 );
        secondSourceNode.addChild( this.secondSourceCueingArrowsLayer );

        //TODO https://github.com/phetsims/geometric-optics/issues/82 address position of source of light
      }
      else {

        // add second light source
        secondSourceNode.addChild( secondSourceImage );
      }
      setSecondSourcePosition( sourceObject.secondPositionProperty.value );
    } );

    secondSourcePositionProperty.link( position => {
      sourceObject.setSecondPoint( representationProperty, position );
    } );

    sourceObject.secondPositionProperty.link( position => {
      setSecondSourcePosition( position );
    } );

    secondSourceVisibleProperty.linkAttribute( secondSourceNode, 'visible' );
  }

  /**
   * Creates an icon for the second source
   * @public
   * @param {Object} [options]
   * @returns {Node}
   */
  static createSecondSourcePointIcon( options ) {
    options = merge( {
      fill: GeometricOpticsColors.secondSourcePointFillProperty,
      stroke: GeometricOpticsColors.secondSourcePointStrokeProperty
    }, options );

    return new Circle( 5, options );
  }

  /**
   * Reset this node
   * @public
   */
  reset() {
    this.sourceCueingArrowsNode.visible = true;
    this.secondSourceCueingArrowsLayer.visible = true;
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;