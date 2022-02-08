// Copyright 2021-2022, University of Colorado Boulder

/**
 * SecondPointNode is the view of the second point on the source object, and the second light source.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Circle, DragListener, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import SecondPoint from '../model/SecondPoint.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import IProperty from '../../../../axon/js/IProperty.js';
import GOConstants from '../GOConstants.js';

type SecondPointNodeOptions = {
  visibleProperty: IProperty<boolean>,
  tandem: Tandem
};

class SecondPointNode extends Node {

  private readonly resetSecondPointNode: () => void;

  /**
   * @param secondPoint
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( secondPoint: SecondPoint, modelViewTransform: ModelViewTransform2, providedOptions: SecondPointNodeOptions ) {

    super( merge( {

      // second point can only be dragged vertically
      cursor: 'ns-resize',

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions ) );

    // The point that represents the position of the second source.
    const pointNode = new PointNode();
    this.addChild( pointNode );

    // Cueing arrows
    const cueingArrowsNode = new CueingArrowsNode( pointNode.width + 10, {
      center: pointNode.center
    } );
    this.addChild( cueingArrowsNode );

    this.touchArea = Shape.circle( 0, 0, 2 * pointNode.width + 10 );

    secondPoint.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    // The position of the second point cannot be set directly, because it is derived based on the vertical
    // offset from the framed object's position.  So create an adapter Property for use with DragListener.
    const positionProperty = new Vector2Property( secondPoint.positionProperty.value );
    positionProperty.link( position => secondPoint.setSecondPoint( position ) );

    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      transform: modelViewTransform,
      drag: () => {
        cueingArrowsNode.visible = false;
      }
    } );
    this.addInputListener( dragListener );

    Property.multilink(
      [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean ) => {
        cueingArrowsNode.visible = ( cueingArrowsEnabled && inputEnabled );
      }
    );

    this.resetSecondPointNode = (): void => {
      cueingArrowsNode.visible = ( GOGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };
  }

  /**
   * Creates an icon to represent the second point.
   */
  public static createIcon(): Node {
    return new PointNode();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetSecondPointNode();
  }
}

// Circle that denotes the second point
class PointNode extends Circle {
  constructor() {
    super( 7, {
      fill: GOColors.secondPointFillProperty,
      stroke: GOColors.secondPointStrokeProperty
    } );
  }
}

// Arrows for cueing the user that this Node can be moved up and down
class CueingArrowsNode extends VBox {
  constructor( spacing: number, providedOptions?: NodeOptions ) {

    const arrowLength = 20;
    const arrowNodeOptions = merge( {
      fill: GOColors.secondPointFillProperty
    }, GOConstants.CUEING_ARROW_SHAPE_OPTIONS );

    super( merge( {
      spacing: spacing,
      align: 'center',
      children: [
        new ArrowNode( 0, 0, 0, -arrowLength, arrowNodeOptions ), // up arrow
        new ArrowNode( 0, 0, 0, +arrowLength, arrowNodeOptions ) // down arrow
      ]
    }, providedOptions ) );
  }
}

geometricOptics.register( 'SecondPointNode', SecondPointNode );
export default SecondPointNode;