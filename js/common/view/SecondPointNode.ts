// Copyright 2021-2022, University of Colorado Boulder

/**
 * SecondPointNode is the view of the second point-of-interest on a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { Circle, DragListener, FocusHighlightFromNode, KeyboardDragListener, Node, NodeOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import SecondPoint from '../model/SecondPoint.js';
import GOConstants from '../GOConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { KeyboardDragListenerOptions } from '../GOCommonOptions.js';
import IProperty from '../../../../axon/js/IProperty.js';
import GOGlobalOptions from '../GOGlobalOptions.js';

type SecondPointNodeOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem' | 'phetioDocumentation'>;

class SecondPointNode extends Node {

  /**
   * @param secondPoint
   * @param modelViewTransform
   * @param wasDraggedProperty
   * @param providedOptions
   */
  constructor( secondPoint: SecondPoint, modelViewTransform: ModelViewTransform2, wasDraggedProperty: IProperty<boolean>,
               providedOptions: SecondPointNodeOptions ) {

    const options = optionize<SecondPointNodeOptions, {}, NodeOptions>( {

      // NodeOptions
      cursor: 'ns-resize', // second point can only be dragged vertically
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    const pointNode = new PointNode();
    this.addChild( pointNode );
    this.setFocusHighlight( new FocusHighlightFromNode( pointNode ) );

    // Cueing arrows
    const cueingArrowsNode = new SecondPointCueingArrowsNode( pointNode.width + 10, {
      center: pointNode.center,
      visibleProperty: new DerivedProperty(
        [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty, wasDraggedProperty ],
        ( cueingArrowsEnabled: boolean, inputEnabled: boolean, wasDragged: boolean ) =>
          ( cueingArrowsEnabled && inputEnabled && !wasDragged ) )
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

    const keyboardDragListener = new KeyboardDragListener(
      optionize<KeyboardDragListenerOptions, {}, KeyboardDragListenerOptions>( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: positionProperty,
        transform: modelViewTransform,
        drag: drag,
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      } ) );
    this.addInputListener( keyboardDragListener );

    this.addLinkedElement( secondPoint, {
      tandem: options.tandem.createTandem( secondPoint.tandem.name )
    } );
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

/**
 * SecondPointNode has its own cueing arrows that are very different from the CueingArrowNode used for other UI elements.
 * These arrows point up and down, and are separated by a gap where the second point will appear.
 */
class SecondPointCueingArrowsNode extends VBox {

  /**
   * @param spacing
   * @param providedOptions
   */
  constructor( spacing: number, providedOptions?: NodeOptions ) {

    const arrowLength = 20;
    const arrowNodeOptions = optionize<ArrowNodeOptions, {}, ArrowNodeOptions>( {
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