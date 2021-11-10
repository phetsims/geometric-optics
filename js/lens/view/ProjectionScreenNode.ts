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
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectionScreenBottom_png from '../../../images/projectionScreenBottom_png.js';
import projectionScreenTop_png from '../../../images/projectionScreenTop_png.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from '../model/ProjectionScreen.js';
import UnconstrainedCueingArrowsNode from '../../common/view/UnconstrainedCueingArrowsNode.js';
import GeometricOpticsGlobalOptions from '../../common/GeometricOpticsGlobalOptions.js';

class ProjectionScreenNode extends Node {

  private readonly resetProjectionScreenNode: () => void;

  /**
   * @param {ProjectionScreen} projectionScreen
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( projectionScreen: ProjectionScreen, opticPositionProperty: Property<Vector2>,
               modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      tandem: Tandem.REQUIRED,
      phetioInputEnabledPropertyInstrumented: true
    }, options );

    // The screen part of the projection screen, drawn in perspective.
    const screenNode = new Path( modelViewTransform.modelToViewShape( projectionScreen.screenShape ), {
      fill: GeometricOpticsColors.projectionScreenFillProperty,
      stroke: GeometricOpticsColors.projectionScreenStrokeProperty,
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
      left: screenNode.left - 7,
      top: screenNode.bottom - 32
    } );

    // The pull string, attached to the bottom bar
    const pullStringNode = new Line( 0, 0, 0, 50, {
      stroke: GeometricOpticsColors.projectionScreenStrokeProperty,
      lineWidth: 3,
      centerX: screenNode.centerX,
      // @ts-ignore TYPESCRIPT property 'top' does not exist on type 'Image'
      top: bottomBarNode.top
    } );

    // The knob attached to the pull string
    const knobNode = new Circle( 5, {
      stroke: GeometricOpticsColors.projectionScreenStrokeProperty,
      fill: Color.grayColor( 180 ),
      center: pullStringNode.centerBottom
    } );

    const cueingArrowsNode = new UnconstrainedCueingArrowsNode( {
      right: screenNode.left - 10,
      centerY: screenNode.centerY
    } );

    assert && assert( !options.children );
    options.children = [ pullStringNode, knobNode, screenNode, topBarNode, bottomBarNode, cueingArrowsNode ];

    super( options );

    projectionScreen.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    const modelScreenWidth = modelViewTransform.viewToModelDeltaX( screenNode.width );
    const modelScreenHeight = Math.abs( modelViewTransform.viewToModelDeltaY( screenNode.height ) );

    // {DerivedProperty.<Bounds2>} Keep the projection screen fully within model bounds, and right of the optic.
    const dragBoundsProperty = new DerivedProperty<Bounds2>(
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
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: projectionScreen.positionProperty,
      dragBounds: dragBoundsProperty.value,
      transform: modelViewTransform,
      dragVelocity: 75, // velocity - change in position per second
      shiftDragVelocity: 20 // finer-grained
      //TODO https://github.com/phetsims/scenery/issues/1313 KeyboardDragListener is not instrumented yet
    } );
    this.addInputListener( keyboardDragListener );

    //TODO https://github.com/phetsims/scenery/issues/1307 should be handled by KeyboardDragListener
    dragBoundsProperty.link( dragBounds => {
      keyboardDragListener.dragBounds = dragBounds;
    } );

    Property.multilink(
      [ GeometricOpticsGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean ) => {
        cueingArrowsNode.visible = ( cueingArrowsEnabled && inputEnabled );
      }
    );

    this.resetProjectionScreenNode = () => {
      cueingArrowsNode.visible = ( GeometricOpticsGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };
  }

  /**
   * @override
   */
  public dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Reset this node
   */
  public reset() {
    this.resetProjectionScreenNode();
  }
}

geometricOptics.register( 'ProjectionScreenNode', ProjectionScreenNode );
export default ProjectionScreenNode;