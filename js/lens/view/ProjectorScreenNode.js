// Copyright 2021, University of Colorado Boulder

/**
 * ProjectorScreenNode is the view of of the projector screen.
 *
 * @author Martin Veillette
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
import projectorScreen_png from '../../../images/projectorScreen_png.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../../common/GeometricOpticsQueryParameters.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectorScreen from '../model/ProjectorScreen.js';

class ProjectorScreenNode extends Node {

  /**
   * @param {ProjectorScreen} projectorScreen
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Bounds2>} visibleModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( projectorScreen, opticPositionProperty, visibleModelBoundsProperty, modelViewTransform, options ) {

    assert && assert( projectorScreen instanceof ProjectorScreen );
    assert && assert( opticPositionProperty instanceof Property );
    assert && assert( visibleModelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      cursor: 'pointer'
    }, options );

    // The screen
    const projectorScreenImage = new Image( projectorScreen_png, {
      scale: GeometricOpticsConstants.PROJECTOR_SCALE
    } );

    assert && assert( !options.children );
    options.children = [ projectorScreenImage ];

    super( options );

    // TODO: the model should give its size to the view rather than the other way around (see #153)
    // determine the size of the projector in model coordinates
    const modelChildHeight = Math.abs( modelViewTransform.viewToModelDeltaY( projectorScreenImage.height ) );
    const modelChildWidth = modelViewTransform.viewToModelDeltaX( projectorScreenImage.width );

    // difference between the left top position of the image and the "center" of the screen in model coordinates
    const offset = new Vector2( -modelChildWidth, modelChildHeight ).divideScalar( 2 );

    // {DerivedProperty.<Bounds2>} keep at least half of the projector screen within visible bounds and right of the optic
    const projectorScreenDragBoundsProperty = new DerivedProperty(
      [ visibleModelBoundsProperty, opticPositionProperty ],
      ( visibleBounds, opticPosition ) =>
        new Bounds2( opticPosition.x,
          visibleBounds.minY + modelChildHeight / 2,
          visibleBounds.maxX - modelChildWidth / 2,
          visibleBounds.maxY + modelChildHeight / 2 )
    );

    // @private left top position of the projector screen image
    this.imagePositionProperty = new Vector2Property( projectorScreen.positionProperty.value.plus( offset ) );

    // create a drag listener for the image
    const dragListener = new DragListener( {
      positionProperty: this.imagePositionProperty,
      dragBoundsProperty: projectorScreenDragBoundsProperty,
      transform: modelViewTransform
    } );
    projectorScreenImage.addInputListener( dragListener );

    // always keep projector screen within playarea bounds when they are changed
    projectorScreenDragBoundsProperty.link( dragBounds => {
      this.imagePositionProperty.value = dragBounds.closestPointTo( this.imagePositionProperty.value );
    } );

    // update the position of projectorScreen target
    this.imagePositionProperty.link( position => {
      projectorScreen.positionProperty.value = position.minus( offset );
      projectorScreenImage.leftTop = modelViewTransform.modelToViewPosition( position );
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