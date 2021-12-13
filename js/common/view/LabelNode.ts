// Copyright 2021, University of Colorado Boulder

/**
 * LabelNode renders a label below something of interest in the user interface. It is responsible for adjusting its
 * position when that something's position changes.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import GOConstants from '../GOConstants.js';

const X_MARGIN = 5;
const Y_MARGIN = 5;
const LABEL_Y_OFFSET = 12;
const TEXT_OPTIONS = {
  fill: GOColors.labelFillProperty,
  font: GOConstants.LABEL_FONT,
  maxWidth: 85
};
const RECTANGLE_OPTIONS = {
  fill: GOColors.screenBackgroundColorProperty,
  cornerRadius: 4,
  opacity: 0.5
};

type Options = {
  visibleProperty?: IProperty<boolean>
};

class LabelNode extends Node {

  private readonly textNode: Text;

  /**
   * @param text
   * @param positionProperty - position of the thing that we're labeling
   * @param modelViewTransformProperty
   * @param options
   */
  constructor( text: string, positionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransformProperty: Property<ModelViewTransform2>, options?: Options ) {

    const textNode = new Text( text, TEXT_OPTIONS );

    // Background for the text, update the size and position later.
    const backgroundRectangle = new Rectangle( 0, 0, 1, 1, RECTANGLE_OPTIONS );

    super( merge( {
      children: [ backgroundRectangle, textNode ]
    }, options ) );

    Property.multilink(
      [ textNode.boundsProperty, modelViewTransformProperty, positionProperty ],
      ( textNodeBounds: Bounds2, modelViewTransform: ModelViewTransform2, position: Vector2 ) => {

        // Size the background to fit the text.
        backgroundRectangle.setRectWidth( textNodeBounds.width + X_MARGIN * 2 );
        backgroundRectangle.setRectHeight( textNodeBounds.height + Y_MARGIN * 2 );

        // Center the text in the background.
        backgroundRectangle.center = textNode.center;

        // Center under the things that we're labeling.
        this.centerTop = modelViewTransform.modelToViewPosition( position ).plusXY( 0, LABEL_Y_OFFSET );
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