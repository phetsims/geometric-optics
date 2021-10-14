// Copyright 2021, University of Colorado Boulder

/**
 * ProjectorScreenNode is the view of of the projector screen.
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
import projectorScreenFrame_png from '../../../images/projectorScreenFrame_png.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../../common/GeometricOpticsQueryParameters.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectorScreen from '../model/ProjectorScreen.js';

class ProjectorScreenNode extends Node {

  /**
   * @param {ProjectorScreen} projectorScreen
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( projectorScreen, opticPositionProperty, modelBoundsProperty, modelViewTransform, options ) {

    assert && assert( projectorScreen instanceof ProjectorScreen );
    assert && assert( opticPositionProperty instanceof Property );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      cursor: 'pointer'
    }, options );

    // The frame part (top and bottom) of the projector screen is an image.
    const projectorScreenFrameImage = new Image( projectorScreenFrame_png, {
      scale: GeometricOpticsConstants.PROJECTOR_SCREEN_SCALE
    } );

    // The screen part of the projector screen is a Path, so that we can tweak its color in the Color Editor.
    // See https://github.com/phetsims/geometric-optics/issues/226
    const screenNode = new Path( null, {
      fill: GeometricOpticsColors.projectorScreenFillProperty,
      stroke: GeometricOpticsColors.projectorScreenStrokeProperty,
      lineWidth: 2
    } );

    assert && assert( !options.children );
    options.children = [ screenNode, projectorScreenFrameImage ];

    super( options );

    // TODO: the model should give its size to the view rather than the other way around (see #153)
    // determine the size of the projector in model coordinates
    const modelChildHeight = Math.abs( modelViewTransform.viewToModelDeltaY( projectorScreenFrameImage.height ) );
    const modelChildWidth = modelViewTransform.viewToModelDeltaX( projectorScreenFrameImage.width );

    // difference between the left top position of the image and the "center" of the screen in model coordinates
    const offset = new Vector2( -modelChildWidth, modelChildHeight ).divideScalar( 2 );

    // {DerivedProperty.<Bounds2>} Keep the projector screen fully within model bounds, and right of the optic.
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

    // @private left top position of the projector screen image
    this.imagePositionProperty = new Vector2Property( projectorScreen.positionProperty.value.plus( offset ) );

    // create a drag listener for the image
    projectorScreenFrameImage.addInputListener( new DragListener( {
      positionProperty: this.imagePositionProperty,
      dragBoundsProperty: dragBoundsProperty,
      transform: modelViewTransform
    } ) );

    // always keep projector screen within playarea bounds when they are changed
    dragBoundsProperty.link( dragBounds => {
      this.imagePositionProperty.value = dragBounds.closestPointTo( this.imagePositionProperty.value );
    } );

    projectorScreen.positionProperty.link( position => {
      screenNode.shape = modelViewTransform.modelToViewShape( projectorScreen.getScreenShape() );
    } );

    // update the position of projectorScreen target
    this.imagePositionProperty.link( position => {
      projectorScreen.positionProperty.value = position.minus( offset );
      projectorScreenFrameImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    // Show the mask that corresponds to the area where light can be seen on the projector screen.
    // The Shape is described clockwise, from leftTop.
    if ( GeometricOpticsQueryParameters.showProjectorScreenMask ) {
      const screenMaskNode = new Path( null, { stroke: 'red' } );
      this.addChild( screenMaskNode );
      projectorScreen.positionProperty.link( position => {
        screenMaskNode.shape = modelViewTransform.modelToViewShape( projectorScreen.getScreenShape() );
      } );
    }
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

geometricOptics.register( 'ProjectorScreenNode', ProjectorScreenNode );
export default ProjectorScreenNode;