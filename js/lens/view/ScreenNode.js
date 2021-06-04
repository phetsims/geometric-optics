// Copyright 2021, University of Colorado Boulder

/**
 * View of of the screen
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import screen3dImage from '../../../images/screen-3d_png.js';
import GeometricOpticsColorProfile from '../../common/GeometricOpticsColorProfile.js';
import geometricOptics from '../../geometricOptics.js';

const SPOTLIGHT_FILL = GeometricOpticsColorProfile.screenSpotlightFillProperty;

class ScreenNode extends Node {

  /**
   * @param {Screen} screen
   * @param {Property.<Representation>} representationProperty
   * @param {Property.<boolean>} visibleMovablePointProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( screen, representationProperty, visibleMovablePointProperty, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( options );

    // create screen target
    const screenImage = new Image( screen3dImage, { scale: 0.5 } );

    // difference between the left top position of the image and the "center" of the blackboard
    const offset = new Vector2( -0.3, 0.75 );

    // @private {Property.<Vector2} create a property for the left top position of the screen target
    this.imagePositionProperty = new Vector2Property( screen.positionProperty.value.plus( offset ) );

    // create a drag listener for the image
    const dragListener = new DragListener(
      {
        positionProperty: this.imagePositionProperty,
        transform: modelViewTransform,
        mapPosition: position => {
          // horizontal position of the lens
          const xLens = screen.opticPositionProperty.value.x;

          // image position is bounded on the left by the lens
          return ( position.x < xLens ) ? new Vector2( xLens, position.y ) : position;
        }
      } );

    // update the position of screen target
    this.imagePositionProperty.link( position => {
      screen.positionProperty.value = position.minus( offset );
      screenImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    // add input listener to screen target
    screenImage.addInputListener( dragListener );

    // add screen image to scene graph
    this.addChild( screenImage );

    representationProperty.link( representation => {
      // display this node if this is a source, that is not an object
      this.visible = !representation.isObject;
    } );

    /**
     * Create and add a spotlight on screen
     * Returns the added scenery node as a reference
     * @param {Spotlight} spotlight
     * @returns {Node}
     */
    const addSpotLightNode = spotlight => {

      // create spotlight
      const spotlightNode = new Path( new Shape( spotlight.shapeProperty.value ),
        { fill: SPOTLIGHT_FILL } );

      // update the intensity of light to the opacity of the scenery node
      spotlight.intensityProperty.link( intensity => {
        spotlightNode.opacity = intensity;
      } );

      // update the shape of the spotlight
      spotlight.shapeProperty.link( shape => {
        spotlightNode.shape = modelViewTransform.modelToViewShape( shape );
      } );

      // add the spotlight to this node
      this.addChild( spotlightNode );

      // return the scenery node as a reference
      return spotlightNode;
    };

    // add spotlight due to always present source
    addSpotLightNode( screen.spotlightOne );

    // add second spotlight for the "movable point"
    const movableSpotlightNode = addSpotLightNode( screen.spotlightTwo );

    // link the visibility of the movable spot light node to the visible point property
    visibleMovablePointProperty.linkAttribute( movableSpotlightNode, 'visible' );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.imagePositionProperty.reset();
  }
}

geometricOptics.register( 'ScreenNode', ScreenNode );
export default ScreenNode;
