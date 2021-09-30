// Copyright 2021, University of Colorado Boulder

/**
 * SecondSourceNode displays the second source, which is either an object or a source of light.
 * It is draggable, and has cueing arrows to show that it can be dragged up and down.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
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
import SecondSource from '../model/SecondSource.js';

// constants
const POINT_RADIUS = 5;
const OVERALL_SCALE_FACTOR = 1;

// Point where the light comes out of the light PNG image, in model coordinates
//TODO why isn't this also used for the first light source? and can't use Representation.LIGHT.rightFacingUprightOffset ?
const LIGHT_SOURCE_OFFSET = new Vector2( 34, -15 );

//TODO no idea why this worked for https://github.com/phetsims/geometric-optics/issues/191, circle back
const LIGHT_SOURCE_DRAG_OFFSET = new Vector2( 2 * LIGHT_SOURCE_OFFSET.x, -2 * LIGHT_SOURCE_OFFSET.y );

const CUEING_ARROW_LENGTH = 20;
const CUEING_ARROW_OPTIONS = {
  fill: 'rgb(255,0,0)',
  tailWidth: 6,
  headWidth: 12,
  headHeight: 6
};

class SecondSourceNode extends Node {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {SecondSource} secondSource
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( representationProperty, secondSource, modelViewTransform, options ) {

    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( secondSource instanceof SecondSource );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    super( options );

    // The point that represents the position of the second source.
    const pointNode = new PointNode( POINT_RADIUS );

    // Cueing arrows
    const cueingArrows = new CueingArrows( POINT_RADIUS + 10, {
      center: pointNode.center
    } );

    // Light image for the second source
    const secondSourceImage = new Image( Representation.LIGHT.secondSourceImage, { scale: OVERALL_SCALE_FACTOR } );

    // Property for the position of the second source node
    const positionProperty = new Vector2Property( secondSource.positionProperty.value );
    positionProperty.link( position => {
      secondSource.setSecondPoint( representationProperty, position );
    } );

    // create drag listener for second source
    const secondSourceDragListener = new DragListener( {
      pressCursor: 'ns-resize',
      useInputListenerCursor: true,
      positionProperty: positionProperty,
      transform: modelViewTransform,
      offsetPosition: () => LIGHT_SOURCE_DRAG_OFFSET,
      end: () => {
        if ( representationProperty.value.isObject ) {
          cueingArrows.visible = false;
        }
      }
    } );
    this.addInputListener( secondSourceDragListener );

    const updatePosition = modelPosition => {
      const viewPosition = modelViewTransform.modelToViewPosition( modelPosition );
      if ( representationProperty.value.isObject ) {
        this.center = viewPosition;
      }
      else {
        this.leftTop = viewPosition.minus( modelViewTransform.modelToViewDelta( LIGHT_SOURCE_OFFSET ) );
      }
    };

    representationProperty.link( representation => {

      // Remove all children from the second source.
      this.removeAllChildren();

      if ( representation.isObject ) {

        // add point and cueing arrows
        this.addChild( pointNode );
        this.addChild( cueingArrows );
        cueingArrows.center = pointNode.center;
        this.touchArea = Shape.circle( 0, 0, 2 * POINT_RADIUS + 10 );
      }
      else {

        // add second light source
        this.addChild( secondSourceImage );
        this.touchArea = secondSourceImage.localBounds.dilateXY( 5, 5 );
      }
      updatePosition( secondSource.positionProperty.value );
    } );

    secondSource.positionProperty.link( position => updatePosition( position ) );

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
  constructor( radius, options ) {
    options = merge( {
      fill: GeometricOpticsColors.secondPointFillProperty,
      stroke: GeometricOpticsColors.secondPointStrokeProperty
    }, options );
    super( radius, options );
  }
}

// Arrows for cueing the user that this Node can be moved up and down
class CueingArrows extends VBox {
  constructor( spacing ) {
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

geometricOptics.register( 'SecondSourceNode', SecondSourceNode );
export default SecondSourceNode;