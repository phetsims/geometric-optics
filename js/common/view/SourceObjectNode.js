// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const OVERALL_SCALE_FACTOR = 0.5;
const OFFSET_VECTOR = new Vector2( 0.15, -0.18 );

class SourceObjectNode extends Node {

  /**
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} visibleMovablePointProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * */
  constructor( sourceObject, visibleMovablePointProperty, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    super();
    const sourceObjectImage = new Image( sourceObject.representationProperty.value.source, { scale: OVERALL_SCALE_FACTOR } );

    const leftTopModelPositionProperty = new Vector2Property( sourceObject.positionProperty.value.minus( OFFSET_VECTOR ) );

    const sourceObjectDragListener = new DragListener( {
      positionProperty: leftTopModelPositionProperty,
      transform: modelViewTransform
    } );


    sourceObjectImage.addInputListener( sourceObjectDragListener );

    leftTopModelPositionProperty.link( position => {
      const offsetPosition = position.plus( OFFSET_VECTOR );
      sourceObject.setMovablePoint( offsetPosition.plusXY( 0, sourceObject.getVerticalOffset() ) );
      sourceObject.positionProperty.value = offsetPosition;
      sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    const movablePoint = new Circle( 10, { fill: 'yellow' } );

    const movablePointDragListener = new DragListener( {
      positionProperty: sourceObject.movablePositionProperty,
      transform: modelViewTransform
    } );

    movablePoint.addInputListener( movablePointDragListener );

    sourceObject.representationProperty.link( type => {
      sourceObjectImage.image = type.source;
    } );

    sourceObject.movablePositionProperty.link( position => {
      const freeVerticalOffset = position.y - sourceObject.positionProperty.value.y;
      sourceObject.clampVerticalOffset( freeVerticalOffset );
      movablePoint.center = modelViewTransform.modelToViewPosition( sourceObject.getMovablePosition() );
    } );

    visibleMovablePointProperty.linkAttribute( movablePoint, 'visible' );

    this.addChild( sourceObjectImage );
    this.addChild( movablePoint );
  }

}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;
