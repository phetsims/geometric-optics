// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const OVERALL_SCALE_FACTOR = 0.5;
const OFFSET_VECTOR = new Vector2( 0.15, -0.18 );

class SourceObjectNode extends Node {

  /**
   * @param {EnumerationProperty.<SourceObjectRepresentation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} visibleMovablePointProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * */
  constructor( representationProperty, sourceObject, visibleMovablePointProperty, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    super();

    const sourceObjectImage = new Image( representationProperty.value.objectUpright, { scale: OVERALL_SCALE_FACTOR } );

    this.leftTopModelPositionProperty = new Vector2Property( sourceObject.getPosition().minus( OFFSET_VECTOR ) );

    const sourceObjectDragListener = new DragListener( {
      positionProperty: this.leftTopModelPositionProperty,
      transform: modelViewTransform
    } );

    sourceObjectImage.addInputListener( sourceObjectDragListener );

    this.leftTopModelPositionProperty.link( position => {
      const offsetPosition = position.plus( OFFSET_VECTOR );
      sourceObject.setPosition( offsetPosition );
      sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    const movableNode = new Node();

    const movableCirclePositionProperty = new Vector2Property( sourceObject.movablePositionProperty.value );

    const movablePointDragListener = new DragListener( {
      positionProperty: movableCirclePositionProperty,
      transform: modelViewTransform
    } );

    movableNode.addInputListener( movablePointDragListener );

    representationProperty.link( representation => {
      sourceObjectImage.image = representation.objectUpright;
      movableNode.removeAllChildren();
      movableNode.addChild( representation.source );
      movableNode.leftTop = modelViewTransform.modelToViewPosition( sourceObject.movablePositionProperty.value );
    } );

    movableCirclePositionProperty.link( position => {
      sourceObject.setMovablePoint( representationProperty, position );
    } );

    sourceObject.movablePositionProperty.link( position => {
      movableNode.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    visibleMovablePointProperty.linkAttribute( movableNode, 'visible' );

    this.addChild( sourceObjectImage );
    this.addChild( movableNode );
  }

  /**
   * @public
   */
  reset() {
    this.leftTopModelPositionProperty.reset();
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;
