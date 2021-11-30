// Copyright 2021, University of Colorado Boulder

/**
 * LabelNode renders a label below something of interest in the user interface. It is responsible for adjusting its
 * position when that something's position changes.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class LabelNode extends Node {

  private readonly textNode: Text;

  /**
   * @param text
   * @param positionProperty - position of the thing that we're labeling
   * @param modelViewTransformProperty
   * @param options
   */
  constructor( text: string, positionProperty: Property<Vector2>,
               modelViewTransformProperty: Property<ModelViewTransform2>, options?: any ) {

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

        // We generally want the label's background to match the screen's background.
        // See https://github.com/phetsims/geometric-optics/issues/239
        fill: GeometricOpticsColors.screenBackgroundColorProperty,
        cornerRadius: 4,
        opacity: 0.5
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
      ( textNodeBounds: Bounds2, modelViewTransform: ModelViewTransform2, position: Vector2 ) => {

        // Size the background to fit the text.
        backgroundRectangle.setRectWidth( textNodeBounds.width + options.xMargin * 2 );
        backgroundRectangle.setRectHeight( textNodeBounds.height + options.yMargin * 2 );

        // Center the text in the background.
        backgroundRectangle.center = textNode.center;

        // Center under the things that we're labeling.
        this.centerTop = modelViewTransform.modelToViewPosition( position ).plusXY( 0, options.labelOffset );
      } );

    this.textNode = textNode;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public setText( text: string ): void {
    this.textNode.text = text;
  }
}

geometricOptics.register( 'LabelNode', LabelNode );
export default LabelNode;