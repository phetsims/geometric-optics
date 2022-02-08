// Copyright 2021-2022, University of Colorado Boulder

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

type LabelNodeOptions = {
  xAlign?: string,
  yOffset?: number,
  visibleProperty?: IProperty<boolean>
};

class LabelNode extends Node {

  private readonly textNode: Text;

  /**
   * @param text
   * @param positionProperty - position of the thing that we're labeling
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( text: string,
               positionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions?: LabelNodeOptions ) {

    const textNode = new Text( text, TEXT_OPTIONS );

    // Background for the text, update the size and position later.
    const backgroundRectangle = new Rectangle( 0, 0, 1, 1, RECTANGLE_OPTIONS );

    const options = merge( {
      xAlign: 'center',
      yOffset: 10, // in view coordinates
      children: [ backgroundRectangle, textNode ]
    }, providedOptions );

    super( options );

    Property.multilink(
      [ textNode.boundsProperty, zoomTransformProperty, positionProperty ],
      ( textNodeBounds: Bounds2, zoomTransform: ModelViewTransform2, position: Vector2 ) => {

        // Size the background to fit the text.
        backgroundRectangle.setRectWidth( textNodeBounds.width + X_MARGIN * 2 );
        backgroundRectangle.setRectHeight( textNodeBounds.height + Y_MARGIN * 2 );

        // Center the text in the background.
        backgroundRectangle.center = textNode.center;

        // Position under the thing that we're labeling, with specified x alignment
        const viewPosition = zoomTransform.modelToViewPosition( position ).plusXY( 0, options.yOffset );
        if ( options.xAlign === 'center' ) {
          this.centerTop = viewPosition;
        }
        else if ( options.xAlign === 'left' ) {
          this.leftTop = viewPosition;
        }
        else {
          this.rightTop = viewPosition;
        }
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