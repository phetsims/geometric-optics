// Copyright 2021-2022, University of Colorado Boulder

/**
 * SecondPointNode is the view of the second point-of-interest on a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Circle, DragListener, FocusHighlightFromNode, KeyboardDragListener, Node, NodeOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import SecondPoint from '../model/SecondPoint.js';
import GOConstants from '../GOConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import GOQueryParameters from '../GOQueryParameters.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type SecondPointNodeOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem' | 'phetioDocumentation'>;

class SecondPointNode extends Node {

  // Resets things that are specific to this class.
  private readonly resetSecondPointNode: () => void;

  /**
   * @param secondPoint
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( secondPoint: SecondPoint, modelViewTransform: ModelViewTransform2, providedOptions: SecondPointNodeOptions ) {

    const options = optionize<SecondPointNodeOptions, {}, NodeOptions>( {

      // second point can only be dragged vertically
      cursor: 'ns-resize',

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const pointNode = new PointNode();
    this.addChild( pointNode );
    this.setFocusHighlight( new FocusHighlightFromNode( pointNode ) );

    const wasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'wasDraggedProperty' ),
      phetioReadOnly: true
    } );

    // Cueing arrows
    const cueingArrowsNode = new CueingArrowsNode( pointNode.width + 10, {
      center: pointNode.center,
      visibleProperty: new DerivedProperty(
        [ this.inputEnabledProperty, wasDraggedProperty ],
        ( inputEnabled: boolean, wasDragged: boolean ) =>
          ( GOQueryParameters.enableCueingArrows && inputEnabled && !wasDragged ) )
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

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      transform: modelViewTransform,
      drag: drag,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: positionProperty,
      transform: modelViewTransform,
      drag: drag
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } ) );
    this.addInputListener( keyboardDragListener );

    this.addLinkedElement( secondPoint, {
      tandem: options.tandem.createTandem( 'secondPoint' )
    } );

    this.resetSecondPointNode = (): void => {
      wasDraggedProperty.reset();
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

  /**
   * @param spacing
   * @param providedOptions
   */
  constructor( spacing: number, providedOptions?: NodeOptions ) {

    const arrowLength = 20;

    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when ArrowNodeOptions exists
    const arrowNodeOptions = merge( {
      fill: GOColors.secondPointFillProperty
    }, GOConstants.CUEING_ARROW_SHAPE_OPTIONS );

    super( optionize<NodeOptions, {}, VBoxOptions>( {
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