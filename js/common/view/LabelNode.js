// Copyright 2021, University of Colorado Boulder

/**
 * LabelNode renders a label below something of interest in the user interface. It is responsible for adjusting its
 * position when that something's position changes.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class LabelNode extends Node {

  /**
   * @param {string} text
   * @param {Property.<Vector2>} positionProperty - position of the thing that we're labeling
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Object} [options]
   */
  constructor( text, positionProperty, modelViewTransformProperty, options ) {

    assert && assert( typeof text === 'string' );
    assert && assert( positionProperty instanceof Property );
    assert && assert( modelViewTransformProperty instanceof Property );

    options = merge( {

      labelOffset: 12, // vertical offset (in view coordinates) wrt positionProperty
      xMargin: 5,
      yMargin: 5,

      // Text options
      textOptions: {
        fill: GeometricOpticsColors.labelFillProperty,
        font: GeometricOpticsConstants.LABEL_FONT,
        maxWidth: 85
      },

      // Rectangle options, for the Rectangle behind the text
      rectangleOptions: {
        fill: GeometricOpticsColors.labelBackgroundFillProperty,
        cornerRadius: 4
      }
    }, options );

    const textNode = new Text( text, options.textOptions );

    // Background for the text, update the size and position later.
    const backgroundRectangle = new Rectangle( 0, 0, 1, 1, options.rectangleOptions );

    assert && assert( !options.children );
    options.children = [ backgroundRectangle, textNode ];

    super( options );

    Property.multilink(
      [ textNode.boundsProperty, modelViewTransformProperty, positionProperty ],
      ( textNodeBounds, modelViewTransform, position ) => {

        // Size the background to fit the text.
        backgroundRectangle.setRectWidth( textNodeBounds.width + options.xMargin * 2 );
        backgroundRectangle.setRectHeight( textNodeBounds.height + options.yMargin * 2 );

        // Center the text in the background.
        backgroundRectangle.center = textNode.center;

        // Center under the things that we're labeling.
        this.centerTop = modelViewTransform.modelToViewPosition( position ).plusXY( 0, options.labelOffset );
      } );

    // @private
    this.textNode = textNode;
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
   * Sets a string for the label.
   * @public
   * @param {string} text
   */
  setText( text ) {
    this.textNode.text = text;
  }
}

geometricOptics.register( 'LabelNode', LabelNode );
export default LabelNode;