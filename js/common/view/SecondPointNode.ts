// Copyright 2021-2022, University of Colorado Boulder

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
import { Circle, DragListener, Image, Node, VBox } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import SecondPoint from '../model/SecondPoint.js';
import lamp2_png from '../../../images/lamp2_png.js';
import Representation from '../model/Representation.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';
import GOConstants from '../GOConstants.js';

// constants
const POINT_RADIUS = 5;
const LIGHT_SOURCE_IMAGE_SCALE = 1;

// Point where the light comes out of the light PNG image, in model coordinates
//TODO why isn't this also used for the first light source? and can't use Representation.LIGHT.rightFacingUprightOffset ?
const LIGHT_SOURCE_OFFSET = new Vector2( 30, -20 );

//TODO no idea why this worked for https://github.com/phetsims/geometric-optics/issues/191, circle back
const LIGHT_SOURCE_DRAG_OFFSET = new Vector2( 2 * LIGHT_SOURCE_OFFSET.x, -2 * LIGHT_SOURCE_OFFSET.y );

type Options = {
  visibleProperty: IProperty<boolean>,
  tandem: Tandem
};

class SecondPointNode extends Node {

  private readonly resetSecondPointNode: () => void;

  /**
   * @param representationProperty
   * @param secondPoint
   * @param sourceObjectDragBoundsProperty
   * @param modelViewTransform
   * @param dragLockedProperty
   * @param providedOptions
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, secondPoint: SecondPoint,
               sourceObjectDragBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2, dragLockedProperty: IReadOnlyProperty<boolean>,
               providedOptions: Options ) {

    super( merge( {

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions ) );

    // The point that represents the position of the second source.
    const pointNode = new PointNode( POINT_RADIUS );

    // Cueing arrows
    const cueingArrowsNode = new CueingArrowsNode( POINT_RADIUS + 10 );

    // Light image for the second source
    const secondLightSourceImage = new Image( lamp2_png, {
      scale: LIGHT_SOURCE_IMAGE_SCALE
    } );

    // Property for the position of the second source node
    const positionProperty = new Vector2Property( secondPoint.positionProperty.value );
    positionProperty.link( position => {
      secondPoint.setSecondPoint( representationProperty.value.isObject, position );
    } );

    // Drag bounds, in model coordinates.
    // null when we are dealing with an Object, non-null for a Light Source
    const dragBoundsProperty = new DerivedProperty(
      [ sourceObjectDragBoundsProperty, representationProperty, dragLockedProperty ],
      ( sourceObjectDragBounds: Bounds2, representation: Representation, dragLocked: boolean ) => {
        let dragBounds;
        if ( representation.isObject ) {
          dragBounds = null;
        }
        else {
          //TODO this is awful that we're having to undo the offset that is needed elsewhere
          const offsetBounds = sourceObjectDragBounds.withOffsets(
            -LIGHT_SOURCE_OFFSET.x, // left
            -LIGHT_SOURCE_OFFSET.y, // top
            LIGHT_SOURCE_OFFSET.x, // right
            LIGHT_SOURCE_OFFSET.y  // bottom
          );
          if ( dragLocked ) {
            //TODO this is off slightly for 2nd light source, makes it snap up a couple a bit.
            const yFudgeFactor = -0.1;
            const y = positionProperty.value.y + yFudgeFactor;
            dragBounds = new Bounds2( offsetBounds.minX, y, offsetBounds.maxX, y );
          }
          else {
            dragBounds = offsetBounds;
          }
        }
        return dragBounds;
      } );

    // Keep the light source inside the drag bounds.
    dragBoundsProperty.link( dragBounds => {
      const isObject = representationProperty.value.isObject;
      if ( !isObject ) {
        assert && assert( dragBounds ); // {Bounds2|null}
        secondPoint.setSecondPoint( isObject, dragBounds!.closestPointTo( secondPoint.positionProperty.value ) );
      }
    } );

    // create drag listener for second source
    const secondPointDragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,

      //TODO this is awful, needed to fix https://github.com/phetsims/geometric-optics/issues/220
      offsetPosition: () => representationProperty.value.isObject ? Vector2.ZERO : LIGHT_SOURCE_DRAG_OFFSET,
      drag: () => {
        if ( representationProperty.value.isObject ) {
          cueingArrowsNode.visible = false;
        }
      }
    } );
    this.addInputListener( secondPointDragListener );

    const updatePosition = ( modelPosition: Vector2 ): void => {
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
        this.addChild( cueingArrowsNode );
        cueingArrowsNode.center = pointNode.center;
        this.touchArea = Shape.circle( 0, 0, 2 * POINT_RADIUS + 10 );
      }
      else {

        // add second light source
        this.addChild( secondLightSourceImage );
        this.touchArea = secondLightSourceImage.localBounds.dilateXY( 5, 5 );
      }
      updatePosition( secondPoint.positionProperty.value );
    } );

    secondPoint.positionProperty.link( position => updatePosition( position ) );

    Property.multilink(
      [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean ) => {
        cueingArrowsNode.visible = ( cueingArrowsEnabled && inputEnabled );
      }
    );

    Property.multilink( [ representationProperty, dragLockedProperty ],
      ( representation: Representation, dragLocked: boolean ) => {
        if ( representation.isObject ) {

          // second point of interest on source object can only be drag vertically
          this.cursor = 'ns-resize';
        }
        else {

          // 2nd light source
          if ( dragLocked ) {
            this.cursor = 'ew-resize';
          }
          else {
            this.cursor = 'pointer';
          }
        }
      } );

    this.resetSecondPointNode = (): void => {
      cueingArrowsNode.visible = ( GOGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };
  }

  /**
   * Creates an icon to represent the second source.
   */
  public static createIcon(): PointNode { //TODO should this return Node?
    return new PointNode( 5 );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetSecondPointNode();
  }
}

// The point that represents the position of the second source
class PointNode extends Circle {
  constructor( radius: number ) {
    super( radius, {
      fill: GOColors.secondPointFillProperty,
      stroke: GOColors.secondPointStrokeProperty
    } );
  }
}

// Arrows for cueing the user that this Node can be moved up and down
class CueingArrowsNode extends VBox {
  constructor( spacing: number ) {

    const arrowLength = 20;
    const arrowNodeOptions = merge( {
      fill: GOColors.secondPointFillProperty
    }, GOConstants.CUEING_ARROW_SHAPE_OPTIONS );

    super( {
      spacing: spacing,
      align: 'center',
      children: [
        new ArrowNode( 0, 0, 0, -arrowLength, arrowNodeOptions ), // up arrow
        new ArrowNode( 0, 0, 0, +arrowLength, arrowNodeOptions ) // down arrow
      ]
    } );
  }
}

geometricOptics.register( 'SecondPointNode', SecondPointNode );
export default SecondPointNode;