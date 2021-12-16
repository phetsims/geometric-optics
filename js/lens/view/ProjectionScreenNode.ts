// Copyright 2021, University of Colorado Boulder

/**
 * ProjectionScreenNode is the view of of the projection screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { KeyboardDragListener } from '../../../../scenery/js/imports.js';
import { Circle } from '../../../../scenery/js/imports.js';
import { Image } from '../../../../scenery/js/imports.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectionScreenBottom_png from '../../../images/projectionScreenBottom_png.js';
import projectionScreenTop_png from '../../../images/projectionScreenTop_png.js';
import GOColors from '../../common/GOColors.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from '../model/ProjectionScreen.js';
import UnconstrainedCueingArrowsNode from '../../common/view/UnconstrainedCueingArrowsNode.js';
import GOGlobalOptions from '../../common/GOGlobalOptions.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OriginNode from '../../common/view/OriginNode.js';
import GOConstants from '../../common/GOConstants.js';

type Options = {
  tandem: Tandem
};

class ProjectionScreenNode extends Node {

  private readonly resetProjectionScreenNode: () => void;
  private projectorScreenNode: Node;

  /**
   * @param projectionScreen
   * @param opticPositionProperty
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( projectionScreen: ProjectionScreen, opticPositionProperty: Property<Vector2>,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, options: Options ) {

    // The screen part of the projection screen, drawn in perspective.
    const screenNode = new Path( modelViewTransform.modelToViewShape( projectionScreen.screenShape ), {
      fill: GOColors.projectionScreenFillProperty,
      stroke: phet.chipper.queryParameters.dev ? 'red' : GOColors.projectionScreenStrokeProperty,
      lineWidth: 2,
      centerX: 0,
      centerY: 0
    } );

    // Bar across the top edge of the screen. Aka the 'screen case', because the screen retracts into this part.
    const topBarNode = new Image( projectionScreenTop_png, {
      scale: 0.5,
      // offsets were adjusted empirically to align image with screenNode
      left: screenNode.left - 14,
      bottom: screenNode.top + 25
    } );

    // Bar across the bottom edge of the screen
    const bottomBarNode = new Image( projectionScreenBottom_png, {
      scale: 0.5,
      // offsets were adjusted empirically to align image with screenNode
      right: screenNode.right + 9,
      bottom: screenNode.bottom + 18
    } );

    // The pull string, attached to the bottom bar
    const pullStringNode = new Line( 0, 0, 0, 50, {
      stroke: GOColors.projectionScreenStrokeProperty,
      lineWidth: 3,
      centerX: screenNode.centerX,
      top: bottomBarNode.top
    } );

    // The knob attached to the pull string
    const knobNode = new Circle( 5, {
      stroke: GOColors.projectionScreenStrokeProperty,
      fill: Color.grayColor( 180 ),
      center: pullStringNode.centerBottom
    } );

    const cueingArrowsNode = new UnconstrainedCueingArrowsNode( {
      right: screenNode.left - 10,
      centerY: screenNode.centerY
    } );

    const projectorScreenNode = new Node( {
      children: [ pullStringNode, knobNode, topBarNode, bottomBarNode, screenNode ],

      // pdom options
      tagName: 'div',
      focusable: true
    } );

    const children: Node[] = [ projectorScreenNode, cueingArrowsNode ];

    // Red dot at the origin
    if ( GOQueryParameters.showPositions ) {
      children.push( new OriginNode() );
    }

    super( merge( {
      children: children,

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, options ) );

    projectionScreen.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    const modelScreenWidth = modelViewTransform.viewToModelDeltaX( screenNode.width );
    const modelScreenHeight = Math.abs( modelViewTransform.viewToModelDeltaY( screenNode.height ) );

    // Drag bounds, in model coordinates - within model bounds, and right of the optic.
    const dragBoundsProperty = new DerivedProperty(
      [ modelBoundsProperty, opticPositionProperty ],
      ( modelBounds: Bounds2, opticPosition: Vector2 ) =>
        new Bounds2(
          opticPosition.x + ( modelScreenWidth / 2 ) + 20,
          modelBounds.minY + modelScreenHeight / 2,
          modelBounds.maxX - modelScreenWidth / 2,
          modelBounds.maxY - modelScreenHeight / 2
        )
    );

    // Keep the projection screen within drag bounds.
    dragBoundsProperty.link( dragBounds => {
      projectionScreen.positionProperty.value = dragBounds.closestPointTo( projectionScreen.positionProperty.value );
    } );

    this.addInputListener( new DragListener( {
      cursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: projectionScreen.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      drag: () => {
        cueingArrowsNode.visible = false;
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // pdom - dragging using the keyboard
    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: projectionScreen.positionProperty,
      dragBounds: dragBoundsProperty.value,
      transform: modelViewTransform
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } ) );
    this.addInputListener( keyboardDragListener );

    //TODO https://github.com/phetsims/scenery/issues/1307 should be handled by KeyboardDragListener
    dragBoundsProperty.link( dragBounds => {
      keyboardDragListener.dragBounds = dragBounds;
    } );

    Property.multilink(
      [ GOGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean ) => {
        cueingArrowsNode.visible = ( cueingArrowsEnabled && inputEnabled );
      }
    );

    this.resetProjectionScreenNode = (): void => {
      cueingArrowsNode.visible = ( GOGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };

    this.projectorScreenNode = projectorScreenNode;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetProjectionScreenNode();
  }

  // This ensures that focus excludes the cueing arrows.
  public focus(): void {
    this.projectorScreenNode.focus();
  }
}

geometricOptics.register( 'ProjectionScreenNode', ProjectionScreenNode );
export default ProjectionScreenNode;