// Copyright 2021, University of Colorado Boulder

/**
 * SecondPointNode is the view of the second point on the source object, and the second light source.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import Representation from '../model/Representation.js';
import SecondPoint from '../model/SecondPoint.js';

// constants
const POINT_RADIUS = 5;
const LIGHT_SOURCE_IMAGE_SCALE = 1;

// Point where the light comes out of the light PNG image, in model coordinates
//TODO why isn't this also used for the first light source? and can't use Representation.LIGHT.rightFacingUprightOffset ?
const LIGHT_SOURCE_OFFSET = new Vector2( 30, -20 );

//TODO no idea why this worked for https://github.com/phetsims/geometric-optics/issues/191, circle back
const LIGHT_SOURCE_DRAG_OFFSET = new Vector2( 2 * LIGHT_SOURCE_OFFSET.x, -2 * LIGHT_SOURCE_OFFSET.y );

const CUEING_ARROW_LENGTH = 20;
const CUEING_ARROW_OPTIONS = {
  fill: GeometricOpticsColors.secondPointFillProperty,
  tailWidth: 6,
  headWidth: 12,
  headHeight: 6
};

class SecondPointNode extends Node {

  private readonly cueingArrows: CueingArrows;

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {SecondPoint} secondPoint
   * @param {Property.<Bounds2>} sourceObjectDragBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( representationProperty: any, secondPoint: SecondPoint, sourceObjectDragBoundsProperty: Property<Bounds2>, //TODO-TS any
               modelViewTransform: ModelViewTransform2, options?: any ) { //TODO-TS any

    super( options );

    // The point that represents the position of the second source.
    const pointNode = new PointNode( POINT_RADIUS );

    // Cueing arrows
    this.cueingArrows = new CueingArrows( POINT_RADIUS + 10 );

    // Light image for the second source
    // @ts-ignore TODO-TS Property 'LIGHT' does not exist on type 'Enumeration'.
    const secondLightSourceImage = new Image( Representation.LIGHT.secondLightSourceImage, {
      scale: LIGHT_SOURCE_IMAGE_SCALE
    } );

    // Property for the position of the second source node
    const positionProperty = new Vector2Property( secondPoint.positionProperty.value );
    positionProperty.link( ( position: Vector2 ) => {
      secondPoint.setSecondPoint( representationProperty.value.isObject, position );
    } );

    // {DerivedProperty.<Bounds2|null> null when we are dealing with an Object, non-null for a Light Source
    const dragBoundsProperty = new DerivedProperty<Bounds2>(
      [ sourceObjectDragBoundsProperty, representationProperty ],
      ( sourceObjectDragBounds: Bounds2, representation: any ) => //TODO-TS any
        //TODO this is awful that we're having to undo the offset that is needed elsewhere
        representation.isObject ? null : sourceObjectDragBounds.withOffsets(
          -LIGHT_SOURCE_OFFSET.x, // left
          -LIGHT_SOURCE_OFFSET.y, // top
          LIGHT_SOURCE_OFFSET.x, // right
          LIGHT_SOURCE_OFFSET.y  // bottom
        )
    );

    // Keep the light source inside the drag bounds.
    dragBoundsProperty.link( ( dragBounds: Bounds2 ) => {
      const isObject = representationProperty.value.isObject;
      if ( !isObject ) {
        assert && assert( dragBounds );
        secondPoint.setSecondPoint( isObject, dragBounds.closestPointTo( secondPoint.positionProperty.value ) );
      }
    } );

    // create drag listener for second source
    const secondPointDragListener = new DragListener( {
      pressCursor: 'ns-resize',
      useInputListenerCursor: true,
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,

      //TODO this is awful, needed to fix https://github.com/phetsims/geometric-optics/issues/220
      offsetPosition: () => representationProperty.value.isObject ? Vector2.ZERO : LIGHT_SOURCE_DRAG_OFFSET,
      end: () => {
        if ( representationProperty.value.isObject ) {
          this.cueingArrows.visible = false;
        }
      }
    } );
    this.addInputListener( secondPointDragListener );

    const updatePosition = ( modelPosition: Vector2 ) => {
      const viewPosition = modelViewTransform.modelToViewPosition( modelPosition );
      if ( representationProperty.value.isObject ) {
        this.center = viewPosition;
      }
      else {
        this.leftTop = viewPosition.minus( modelViewTransform.modelToViewDelta( LIGHT_SOURCE_OFFSET ) );
      }
    };

    representationProperty.link( ( representation: any ) => { //TODO any

      // Remove all children from the second source.
      this.removeAllChildren();

      if ( representation.isObject ) {

        // add point and cueing arrows
        this.addChild( pointNode );
        this.addChild( this.cueingArrows );
        this.cueingArrows.center = pointNode.center;
        this.touchArea = Shape.circle( 0, 0, 2 * POINT_RADIUS + 10 );
      }
      else {

        // add second light source
        // @ts-ignore TODO-TS Argument of type 'Image' is not assignable to parameter of type 'Node'.
        this.addChild( secondLightSourceImage );
        // @ts-ignore TODO-TS Property 'localBounds' does not exist on type 'Image'.
        this.touchArea = secondLightSourceImage.localBounds.dilateXY( 5, 5 );
      }
      updatePosition( secondPoint.positionProperty.value );
    } );

    secondPoint.positionProperty.link( ( position: Vector2 ) => updatePosition( position ) );
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

  /**
   * Creates an icon to represent the second source.
   * @public
   * @returns {PointNode}
   */
  static createIcon() {
    return new PointNode( 5 );
  }
}

// The point that represents the position of the second source
class PointNode extends Circle {
  constructor( radius: number, options?: any ) { //TODO-TS any
    options = merge( {
      fill: GeometricOpticsColors.secondPointFillProperty,
      stroke: GeometricOpticsColors.secondPointStrokeProperty
    }, options );
    super( radius, options );
  }
}

// Arrows for cueing the user that this Node can be moved up and down
class CueingArrows extends VBox {
  constructor( spacing: number ) {
    super( {
      spacing: spacing,
      align: 'center',
      children: [
        new ArrowNode( 0, 0, 0, -CUEING_ARROW_LENGTH, CUEING_ARROW_OPTIONS ), // up arrow
        new ArrowNode( 0, 0, 0, +CUEING_ARROW_LENGTH, CUEING_ARROW_OPTIONS ) // down arrow
      ]
    } );
  }
}

geometricOptics.register( 'SecondPointNode', SecondPointNode );
export default SecondPointNode;