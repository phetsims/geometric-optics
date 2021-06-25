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
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const MOVABLE_POINT_OPTIONS = GeometricOpticsConstants.MOVABLE_POINT_OPTIONS;
const MOVABLE_POINT_FILL = GeometricOpticsColorProfile.movablePointFillProperty;
const MOVABLE_POINT_STROKE = GeometricOpticsColorProfile.movablePointStrokeProperty;

const OVERALL_SCALE_FACTOR = 0.5;
const OFFSET_VECTOR = new Vector2( 0.16, -0.19 );

class SourceObjectNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} visibleMovablePointProperty
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * */
  constructor( representationProperty,
               sourceObject,
               visibleMovablePointProperty,
               visibleModelBoundsProperty,
               modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    super();

    // representation (image)  of the source/object. the source/object is upright and right facing
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright, { scale: OVERALL_SCALE_FACTOR } );

    this.leftTopModelPositionProperty = new Vector2Property( sourceObject.getPosition().minus( OFFSET_VECTOR ) );

    this.addChild( sourceObjectImage );

    // TODO: the model should give its size to the view rather than the other way around.
    // determine the size  in model coordinates

    const modelChildHeight = Math.abs( modelViewTransform.viewToModelDeltaY( this.height ) );
    const modelChildWidth = modelViewTransform.viewToModelDeltaX( this.width );

    // keep at least half of the projector screen within visible bounds and right of the optic
    const dragBoundsProperty = new DerivedProperty( [ visibleModelBoundsProperty ],
      visibleBounds => {
        const viewBounds = new Bounds2( visibleBounds.minX,
          visibleBounds.minY + modelChildHeight / 2,
          sourceObject.getOpticPosition().x - modelChildWidth,
          visibleBounds.maxY + modelChildHeight / 2 );
        return viewBounds;
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


    function setMovableNodePosition( position ) {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      if ( representationProperty.value.isObject ) {
        movableNode.center = viewPosition;
      }
      else {
        movableNode.leftTop = viewPosition.minus( modelViewTransform.modelToViewDelta( OFFSET_VECTOR ) );
      }
    }

    representationProperty.link( representation => {
      sourceObjectImage.image = representation.rightFacingUpright;

      movableNode.removeAllChildren();
      if ( representation.isObject ) {
        movableNode.addChild( SourceObjectNode.createMovablePointIcon() );
      }
      else {
        movableNode.addChild( new Image( representation.source, { scale: OVERALL_SCALE_FACTOR } ) );
      }
      setMovableNodePosition( sourceObject.movablePositionProperty.value );
    } );

    movableCirclePositionProperty.link( position => {
      sourceObject.setMovablePoint( representationProperty, position );
    } );

    sourceObject.movablePositionProperty.link( position => {
      setMovableNodePosition( position );
    } );

    visibleMovablePointProperty.linkAttribute( movableNode, 'visible' );

    this.addChild( movableNode );
  }

  /**
   * @public
   * @param {Object} [options]
   * @returns {Circle}
   */
  static createMovablePointIcon( options ) {
    options = merge( MOVABLE_POINT_OPTIONS, {
      fill: MOVABLE_POINT_FILL,
      stroke: MOVABLE_POINT_STROKE
    }, options );

    return new Circle( options );
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
