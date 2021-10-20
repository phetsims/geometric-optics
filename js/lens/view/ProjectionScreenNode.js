// Copyright 2021, University of Colorado Boulder

/**
 * ProjectionScreenNode is the view of of the projection screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import projectionScreenFrame_png from '../../../images/projectionScreenFrame_png.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from '../model/ProjectionScreen.js';

// constants
const IMAGE_SCALE = 0.5; // scaling factor applied to the projection screen image

class ProjectionScreenNode extends Node {

  /**
   * @param {ProjectionScreen} projectionScreen
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( projectionScreen, opticPositionProperty, modelBoundsProperty, modelViewTransform, options ) {

    assert && assert( projectionScreen instanceof ProjectionScreen );
    assert && assert( opticPositionProperty instanceof Property );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      cursor: 'pointer'
    }, options );

    // The frame part (top and bottom) of the projection screen is an image.
    const projectionScreenFrameImage = new Image( projectionScreenFrame_png, {
      scale: IMAGE_SCALE
    } );

    // The screen part of the projection screen is a Path, so that we can tweak its color in the Color Editor.
    // See https://github.com/phetsims/geometric-optics/issues/226
    const screenNode = new Path( null, {
      fill: GeometricOpticsColors.projectionScreenFillProperty,
      stroke: GeometricOpticsColors.projectionScreenStrokeProperty,
      lineWidth: 2
    } );

    assert && assert( !options.children );
    options.children = [ screenNode, projectionScreenFrameImage ];

    super( options );

    // TODO: the model should give its size to the view rather than the other way around (see #153)
    // determine the size of the projection screen in model coordinates
    const modelChildHeight = Math.abs( modelViewTransform.viewToModelDeltaY( projectionScreenFrameImage.height ) );
    const modelChildWidth = modelViewTransform.viewToModelDeltaX( projectionScreenFrameImage.width );

    // difference between the left top position of the image and the "center" of the screen in model coordinates
    const offset = new Vector2( -modelChildWidth, modelChildHeight ).divideScalar( 2 );

    // {DerivedProperty.<Bounds2>} Keep the projection screen fully within model bounds, and right of the optic.
    const dragBoundsProperty = new DerivedProperty(
      [ modelBoundsProperty, opticPositionProperty ],
      ( modelBounds, opticPosition ) =>
        new Bounds2(
          opticPosition.x,
          modelBounds.minY + modelChildHeight,
          modelBounds.maxX - modelChildWidth,
          modelBounds.maxY
        )
    );

    // @private left top position of the projection screen image
    this.imagePositionProperty = new Vector2Property( projectionScreen.positionProperty.value.plus( offset ) );

    // create a drag listener for the image
    projectionScreenFrameImage.addInputListener( new DragListener( {
      positionProperty: this.imagePositionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform
    } ) );

    // always keep projection screen within experiment area bounds when they are changed
    dragBoundsProperty.link( dragBounds => {
      this.imagePositionProperty.value = dragBounds.closestPointTo( this.imagePositionProperty.value );
    } );

    projectionScreen.positionProperty.link( position => {
      screenNode.shape = modelViewTransform.modelToViewShape( projectionScreen.getScreenShape() );
    } );

    // update the position of projectionScreen target
    this.imagePositionProperty.link( position => {
      projectionScreen.positionProperty.value = position.minus( offset );
      projectionScreenFrameImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );
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
   * Resets the view.
   * @public
   */
  reset() {
    this.imagePositionProperty.reset();
  }
}

geometricOptics.register( 'ProjectionScreenNode', ProjectionScreenNode );
export default ProjectionScreenNode;