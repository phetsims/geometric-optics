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
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsColorProfile from '../geometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Representation from '../model/Representation.js';

const SECOND_SOURCE_POINT_OPTIONS = GeometricOpticsConstants.SECOND_SOURCE_POINT_OPTIONS;
const SECOND_SOURCE_POINT_FILL = geometricOpticsColorProfile.secondSourcePointFillProperty;
const SECOND_SOURCE_POINT_STROKE = geometricOpticsColorProfile.secondSourcePointStrokeProperty;

const OVERALL_SCALE_FACTOR = 0.5;
const OBJECT_OFFSET_VECTOR = new Vector2( 16, -19 ); /// in model coordinates
const LIGHT_OFFSET_VECTOR = new Vector2( 50, -23 ); // in model coordinates
const CUEING_ARROW_LENGTH = 20;
const CUEING_ARROW_OPTIONS = {
  fill: 'rgb(255,0,0)',
  tailWidth: 6,
  headWidth: 12,
  headHeight: 7,
  cursor: 'pointer'
};

class SourceObjectNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} visibleSecondSourceProperty
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * */
  constructor( representationProperty,
               sourceObject,
               visibleSecondSourceProperty,
               visibleModelBoundsProperty,
               modelViewTransform,
               tandem ) {

    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    // representation (image)  of the source/object. the source/object is upright and right facing
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright, { scale: OVERALL_SCALE_FACTOR } );

    // {Property.<Vector2>} position to track the left top position of this node in model coordinates.
    this.leftTopModelPositionProperty = new Vector2Property( sourceObject.getPosition().minus( OBJECT_OFFSET_VECTOR ) );

    // add the representation to this node
    this.addChild( sourceObjectImage );

    // TODO: the model should give its size to the view rather than the other way around.
    // determine the size  in model coordinates

    const modelChildHeight = Math.abs( modelViewTransform.viewToModelDeltaY( this.height ) );
    const modelChildWidth = modelViewTransform.viewToModelDeltaX( this.width );

    // keep at least half of the projector screen within visible bounds and right of the optic
    const dragBoundsProperty = new DerivedProperty( [ visibleModelBoundsProperty ],
      visibleBounds => {
        return new Bounds2( visibleBounds.minX,
          visibleBounds.minY + modelChildHeight / 2,
          sourceObject.getOpticPosition().x - modelChildWidth,
          visibleBounds.maxY + modelChildHeight / 2 );
      } );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      positionProperty: this.leftTopModelPositionProperty,
      transform: modelViewTransform,
      dragBoundsProperty: dragBoundsProperty
    } );

    // always keep image screen in visible/drag bounds when visible bounds are changed
    dragBoundsProperty.link( dragBounds => {
      this.leftTopModelPositionProperty.value = dragBounds.closestPointTo( this.leftTopModelPositionProperty.value );
    } );

    // add the drag listener to the image representation
    sourceObjectImage.addInputListener( sourceObjectDragListener );


    this.leftTopModelPositionProperty.link( position => {

      if ( representationProperty.value.isObject ) {
        const offsetPosition = position.plus( OBJECT_OFFSET_VECTOR );
        sourceObject.setPosition( offsetPosition );
        sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( position );
      }
      else {
        // address position of source of light #79
        const offsetPosition = position.plus( LIGHT_OFFSET_VECTOR );
        sourceObject.setPosition( offsetPosition );
        sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( position );
      }
    } );

    // create a node to hold the second source
    const secondNode = new Node();

    // Property for the position of the second source node
    const secondSourcePositionProperty = new Vector2Property( sourceObject.secondPositionProperty.value );

    // create the icon for second source (for object source)
    const circleIcon = SourceObjectNode.createSecondSourcePointIcon();

    // create a layer to host the cueing arrows
    this.cueingArrowsLayer = new Node();

    // create and add curing arrow
    const upArrowNode = new ArrowNode( 0, 0, 0, -CUEING_ARROW_LENGTH, CUEING_ARROW_OPTIONS );
    const downArrowNode = new ArrowNode( 0, 0, 0, +CUEING_ARROW_LENGTH, CUEING_ARROW_OPTIONS );
    upArrowNode.bottom = circleIcon.top - 5;
    downArrowNode.top = circleIcon.bottom + 5;
    this.cueingArrowsLayer.addChild( upArrowNode );
    this.cueingArrowsLayer.addChild( downArrowNode );

    // create the light image for the second source
    const secondImage = new Image( Representation.LIGHT.source, { scale: OVERALL_SCALE_FACTOR } );

    // create drag listener for second source
    const secondSourceDragListener = new DragListener( {
      positionProperty: secondSourcePositionProperty,
      transform: modelViewTransform,
      end: () => {
        if ( representationProperty.value.isObject ) {

          // turn off visibility of cueing arrow (see #81) after end event
          this.cueingArrowsLayer.visible = false;
        }
      }
    } );

    secondNode.addInputListener( secondSourceDragListener );


    /**
     * set the position of the second node based on the position
     *
     * @param {Vector2} position - model position of the second source
     */
    function setSecondSourcePosition( position ) {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      if ( representationProperty.value.isObject ) {
        secondNode.center = viewPosition;
      }
      else {
        secondNode.leftTop = viewPosition.minus( modelViewTransform.modelToViewDelta( LIGHT_OFFSET_VECTOR ) );

      }
    }


    representationProperty.link( representation => {
      sourceObjectImage.image = representation.rightFacingUpright;

      // remove all children to the second node
      secondNode.removeAllChildren();

      if ( representation.isObject ) {

        // add circle and cueing arrows
        secondNode.addChild( circleIcon );
        secondNode.touchArea = circleIcon.bounds.dilated( 10 );
        secondNode.addChild( this.cueingArrowsLayer );

        sourceObjectImage.setScaleMagnitude( OVERALL_SCALE_FACTOR );

        // address position of source of light #79
        const offsetPosition = this.leftTopModelPositionProperty.value.plus( OBJECT_OFFSET_VECTOR );
        sourceObject.setPosition( offsetPosition );
        sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( this.leftTopModelPositionProperty.value );
      }
      else {

        // add second light source
        secondNode.addChild( secondImage );

        // set size of source of lights
        sourceObjectImage.setScaleMagnitude( 1.5 );
        secondImage.setScaleMagnitude( 1.5 );

        // address position of source of light #79
        const offsetPosition = this.leftTopModelPositionProperty.value.plus( LIGHT_OFFSET_VECTOR );
        sourceObject.setPosition( offsetPosition );
        sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( this.leftTopModelPositionProperty.value );


      }
      setSecondSourcePosition( sourceObject.secondPositionProperty.value );
    } );

    secondSourcePositionProperty.link( position => {
      sourceObject.setSecondPoint( representationProperty, position );
    } );

    sourceObject.secondPositionProperty.link( position => {
      setSecondSourcePosition( position );
    } );

    visibleSecondSourceProperty.linkAttribute( secondNode, 'visible' );

    this.addChild( secondNode );
  }

  /**
   * create an icon for the second source
   * @public
   * @param {Object} [options]
   * @returns {Node}
   */
  static createSecondSourcePointIcon( options ) {
    options = merge( {}, SECOND_SOURCE_POINT_OPTIONS, {
      fill: SECOND_SOURCE_POINT_FILL,
      stroke: SECOND_SOURCE_POINT_STROKE
    }, options );

    return new Circle( options );
  }

  /**
   * @public
   */
  reset() {
    this.leftTopModelPositionProperty.reset();
    this.cueingArrowsLayer.visible = true;
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;
