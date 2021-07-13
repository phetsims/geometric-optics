// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for a label that appear below each element in the simulation when toggled.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';

const BACKGROUND_COLOR = GeometricOpticsColorProfile.labelBackgroundFillProperty;

class LabelNode extends Node {
  /**
   * Create and add a label node
   *
   * @param {string} string
   * @param {Property.<Vector2>} positionProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Object} [options]
   */
  constructor( string, positionProperty, visibleProperty, modelViewTransformProperty, options ) {

    options = merge( {
      text: { fill: 'white' },
      background: {
        fill: BACKGROUND_COLOR,
        opacity: 0.5,
        cornerRadius: 4
      },
      labelOffset: 20, /// vertical offset (in view coordinates) wrt positionProperty
      xMargin: 10,
      yMargin: 10
    }, options );

    super( options );

    // @private
    this.options = options;

    // @private create text
    this.text = new Text( string, options.text );

    // @private create background for label, update the size and position later.
    this.backgroundRectangle = new Rectangle( 0, 0, 1, 1, options.background );

    // set the size of background rectangle and relative position wrt to text
    this.setRectangleSize();

    // @private
    this.positionProperty = positionProperty;

    // @private
    this.modelViewTransformProperty = modelViewTransformProperty;

    // add the children to this node
    this.addChild( this.backgroundRectangle );
    this.addChild( this.text );

    // update the position of the labels when the zoom level changes
    modelViewTransformProperty.link( () => {
      this.setLabelPosition();
    } );

    // update the position of the text and background
    positionProperty.link( () => {
      this.setLabelPosition();
    } );

    // add a listener to the visibility of this node
    visibleProperty.linkAttribute( this, 'visible' );
  }


  /**
   * Set a string for the label
   * @private
   * @param {string} label
   */
  setText( label ) {
    this.text.setText( label );
    this.setRectangleSize();
    this.setLabelPosition();
  }

  /**
   * set position and size of label
   * @private
   */
  setLabelPosition() {
    this.centerTop = this.modelViewTransformProperty.value.modelToViewPosition( this.positionProperty.value ).plusXY( 0, this.options.labelOffset );
  }

  /**
   * set rectangle size and position based on text size
   * @private
   */
  setRectangleSize() {
    this.backgroundRectangle.setRectWidth( this.text.width + this.options.xMargin * 2 );
    this.backgroundRectangle.setRectHeight( this.text.height + this.options.yMargin * 2 );
    this.backgroundRectangle.center = this.text.center;
  }
}

geometricOptics.register( 'LabelNode', LabelNode );
export default LabelNode;
