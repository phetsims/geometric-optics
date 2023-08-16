// Copyright 2021-2023, University of Colorado Boulder

/**
 * SecondPointNode is the view of the second point-of-interest on a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Circle, DragListener, HighlightFromNode, InteractiveHighlighting, KeyboardDragListener, KeyboardDragListenerOptions, Node, NodeOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import SecondPoint from '../model/SecondPoint.js';
import GOConstants from '../GOConstants.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TProperty from '../../../../axon/js/TProperty.js';
import CueingArrowsNode from './CueingArrowsNode.js';

type SelfOptions = EmptySelfOptions;

type SecondPointNodeOptions = SelfOptions &
  PickRequired<NodeOptions, 'visibleProperty' | 'tandem' | 'phetioDocumentation'>;

export default class SecondPointNode extends InteractiveHighlighting( Node ) {

  /**
   * @param secondPoint - model element
   * @param modelViewTransform
   * @param wasDraggedProperty - was the second point dragged?
   * @param providedOptions
   */
  public constructor( secondPoint: SecondPoint, modelViewTransform: ModelViewTransform2, wasDraggedProperty: TProperty<boolean>,
                      providedOptions: SecondPointNodeOptions ) {

    const options = optionize<SecondPointNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      cursor: 'ns-resize', // second point can only be dragged vertically
      tagName: 'div',
      focusable: true,
      isDisposable: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const pointNode = new PointNode();
    this.addChild( pointNode );
    this.setFocusHighlight( new HighlightFromNode( pointNode ) );

    // Cueing arrows
    const cueingArrowsNode = new SecondPointCueingArrowsNode( pointNode.width + 10, {
      center: pointNode.center,
      visibleProperty: CueingArrowsNode.createVisibleProperty( this.inputEnabledProperty, wasDraggedProperty )
    } );
    this.addChild( cueingArrowsNode );

    this.touchArea = Shape.circle( 0, 0, 2 * pointNode.width + 10 );

    secondPoint.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = ( modelDeltaY: number ) => {
      wasDraggedProperty.value = true;
      const verticalOffset = secondPoint.positionProperty.value.y + modelDeltaY - secondPoint.framedObjectPositionProperty.value.y;
      secondPoint.verticalOffsetProperty.value = SecondPoint.VERTICAL_OFFSET_RANGE.constrainValue( verticalOffset );
    };

    const dragListener = new DragListener( {
      transform: modelViewTransform,
      drag: ( event, listener ) => drag( listener.modelDelta.y ),
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    const keyboardDragListener = new KeyboardDragListener(
      combineOptions<KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        transform: modelViewTransform,
        drag: modelDelta => drag( modelDelta.y ),
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    this.addLinkedElement( secondPoint );
  }

  /**
   * Creates an icon to represent the second point.
   */
  public static createIcon(): Node {
    return new PointNode();
  }
}

// Circle that denotes the second point
class PointNode extends Circle {
  public constructor() {
    super( 7, {
      fill: GOColors.secondPointFillProperty,
      stroke: GOColors.secondPointStrokeProperty
    } );
  }
}

// Cueing arrow constants
const ARROW_LENGTH = 20;
const ARROW_NODE_OPTIONS = {
  fill: GOColors.secondPointFillProperty,
  headWidth: 12,
  headHeight: 8,
  tailWidth: 3
};

/**
 * SecondPointNode has its own cueing arrows that are very different from the CueingArrowNode used for other UI elements.
 * These arrows point up and down, and are separated by a gap where the second point will appear.
 */
class SecondPointCueingArrowsNode extends VBox {

  public constructor( spacing: number, providedOptions?: NodeOptions ) {
    super( optionize<NodeOptions, EmptySelfOptions, VBoxOptions>()( {
      spacing: spacing,
      align: 'center',
      children: [
        new ArrowNode( 0, 0, 0, -ARROW_LENGTH, ARROW_NODE_OPTIONS ), // up arrow
        new ArrowNode( 0, 0, 0, +ARROW_LENGTH, ARROW_NODE_OPTIONS ) // down arrow
      ]
    }, providedOptions ) );
  }
}

geometricOptics.register( 'SecondPointNode', SecondPointNode );