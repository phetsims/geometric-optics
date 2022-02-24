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
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Text } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import GOConstants from '../GOConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';

type XAlign = 'left' | 'center' | 'right';
type YAlign = 'top' | 'center' | 'bottom';

type LabelNodeOptions = {
  xAlign?: XAlign,
  yAlign?: YAlign,
  xOffset?: number,
  yOffset?: number,
  visibleProperty?: IProperty<boolean>
};

class LabelNode extends BackgroundNode {

  private readonly textNode: Text;

  /**
   * @param text
   * @param positionProperty - position of the thing that we're labeling, in model coordinates
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( text: string,
               positionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions?: LabelNodeOptions ) {

    const textNode = new Text( text, {
      fill: GOColors.labelFillProperty,
      font: GOConstants.LABEL_FONT,
      maxWidth: 85
    } );

    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when BackgroundNodeOptions exists
    const options = merge( {

      // LabelNode options
      xAlign: 'center',
      yAlign: 'top',
      xOffset: 0, // from center, in view coordinates
      yOffset: 2, // in view coordinates

      // BackgroundNode options
      xMargin: 5,
      yMargin: 5,
      rectangleOptions: {
        fill: GOColors.screenBackgroundColorProperty,
        cornerRadius: 4,
        opacity: 0.5
      }
    }, providedOptions );

    super( textNode, options );

    this.textNode = textNode;

    Property.multilink(
      [ zoomTransformProperty, positionProperty, textNode.boundsProperty ],
      ( zoomTransform: ModelViewTransform2, position: Vector2, textBounds: Bounds2 ) => {
        const viewPosition = zoomTransform.modelToViewPosition( position ).plusXY( options.xOffset, options.yOffset );

        // x
        if ( options.xAlign === 'center' ) {
          this.centerX = viewPosition.x;
        }
        else if ( options.xAlign === 'left' ) {
          this.left = viewPosition.x;
        }
        else {
          this.right = viewPosition.x;
        }

        // y
        if ( options.yAlign === 'center' ) {
          this.centerY = viewPosition.y;
        }
        else if ( options.yAlign === 'top' ) {
          this.top = viewPosition.y;
        }
        else {
          this.bottom = viewPosition.y;
        }
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  setText( text: string ) {
    this.textNode.text = text;
  }
}

geometricOptics.register( 'LabelNode', LabelNode );
export default LabelNode;
export type { LabelNodeOptions };