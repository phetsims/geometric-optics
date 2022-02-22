// Copyright 2021-2022, University of Colorado Boulder

/**
 * ProjectionScreenNode is the view of the projection screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Color, DragListener, FocusHighlightFromNode, Image, KeyboardDragListener, Line, Node, Path } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectionScreenBottom_png from '../../../images/projectionScreenBottom_png.js';
import projectionScreenTop_png from '../../../images/projectionScreenTop_png.js';
import GOColors from '../../common/GOColors.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from '../model/ProjectionScreen.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OriginNode from './OriginNode.js';
import GOConstants from '../../common/GOConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type ProjectionScreenNodeOptions = {
  tandem: Tandem
};

class ProjectionScreenNode extends Node {

  // Resets things that are specific to this class.
  private readonly resetProjectionScreenNode: () => void;

  /**
   * @param projectionScreen
   * @param opticPositionProperty
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( projectionScreen: ProjectionScreen,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: ProjectionScreenNodeOptions ) {

    const options = merge( {

      // pdom providedOptions
      tagName: 'div',
      focusable: true,

      // phet-io options
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    // The screen part of the projection screen, drawn in perspective.
    const screenNode = new Path( modelViewTransform.modelToViewShape( projectionScreen.screenShape ), {
      fill: GOColors.projectionScreenFillProperty,
      stroke: phet.chipper.queryParameters.dev ? 'red' : GOColors.projectionScreenStrokeProperty,
      lineWidth: 2,

      // projectionScreen.positionProperty is at the center of screenNode
      centerX: 0,
      centerY: 0
    } );

    // Bar across the top edge of the screen. Aka the 'screen case', because the screen retracts into this part.
    const topBarNode = new Image( projectionScreenTop_png, {
      scale: 0.5,
      // offsets were adjusted empirically to align Image with screenNode
      left: screenNode.left - 14,
      bottom: screenNode.top + 25
    } );

    // Bar across the bottom edge of the screen
    const bottomBarNode = new Image( projectionScreenBottom_png, {
      scale: 0.5,
      // offsets were adjusted empirically to align Image with screenNode
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

    const parentNode = new Node( {
      children: [ pullStringNode, knobNode, topBarNode, bottomBarNode, screenNode ]
    } );
    this.addChild( parentNode );
    this.setFocusHighlight( new FocusHighlightFromNode( parentNode ) );

    const wasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'wasDraggedProperty' ),
      phetioReadOnly: true
    } );

    const cueingArrowsNode = new CueingArrowsNode( {
      left: parentNode.right,
      centerY: parentNode.centerY,
      visibleProperty: new DerivedProperty(
        [ this.inputEnabledProperty, wasDraggedProperty ],
        ( inputEnabled: boolean, wasDragged: boolean ) =>
          ( GOQueryParameters.enableCueingArrows && inputEnabled && !wasDragged ) )
    } );
    this.addChild( cueingArrowsNode );

    // Red dot at the origin
    if ( GOQueryParameters.debugOrigins ) {
      this.addChild( new OriginNode() );
    }

    projectionScreen.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    const modelScreenWidth = modelViewTransform.viewToModelDeltaX( screenNode.width );
    const modelScreenHeight = Math.abs( modelViewTransform.viewToModelDeltaY( screenNode.height ) );

    // Drag bounds, in model coordinates - within model bounds, and right of the optic.
    const dragBoundsProperty = new DerivedProperty(
      [ sceneBoundsProperty, opticPositionProperty ],
      ( sceneBounds: Bounds2, opticPosition: Vector2 ) =>
        new Bounds2(
          opticPosition.x + GOConstants.MIN_DISTANCE_FROM_OPTIC_TO_PROJECTION_SCREEN,
          sceneBounds.minY + modelScreenHeight / 2,
          sceneBounds.maxX - modelScreenWidth / 2,
          sceneBounds.maxY - modelScreenHeight / 2
        )
    );

    // Keep the projection screen within drag bounds.
    dragBoundsProperty.link( dragBounds => {
      projectionScreen.positionProperty.value = dragBounds.closestPointTo( projectionScreen.positionProperty.value );
    } );

    // Drag action that is common to DragListener and KeyboardDragListener
    const drag = () => {
      wasDraggedProperty.value = true;
    };

    this.addInputListener( new DragListener( {
      cursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: projectionScreen.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform,
      drag: drag,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // pdom - dragging using the keyboard
    const keyboardDragListener = new KeyboardDragListener( merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
      positionProperty: projectionScreen.positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      drag: drag,
      transform: modelViewTransform
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } ) );
    this.addInputListener( keyboardDragListener );

    this.resetProjectionScreenNode = () => {
      wasDraggedProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetProjectionScreenNode();
  }
}

geometricOptics.register( 'ProjectionScreenNode', ProjectionScreenNode );
export default ProjectionScreenNode;