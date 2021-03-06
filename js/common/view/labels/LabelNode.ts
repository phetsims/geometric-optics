// Copyright 2021-2022, University of Colorado Boulder

/**
 * LabelNode renders a label below something of interest in the user interface. It is responsible for adjusting its
 * position when that something's position changes.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import BackgroundNode, { BackgroundNodeOptions } from '../../../../../scenery-phet/js/BackgroundNode.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { RichText } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import GOColors from '../../GOColors.js';
import GOConstants from '../../GOConstants.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Multilink from '../../../../../axon/js/Multilink.js';

type XAlign = 'left' | 'center' | 'right';
type YAlign = 'top' | 'center' | 'bottom';

type SelfOptions = {
  xAlign?: XAlign;
  yAlign?: YAlign;
  xOffset?: number; // from center, in view coordinates
  yOffset?: number; // in view coordinates
  phetioReadOnlyText?: boolean; // should the RichText be phetioReadOnly?
};

export type LabelNodeOptions = SelfOptions & PickRequired<BackgroundNodeOptions, 'visibleProperty' | 'tandem'>;

export default class LabelNode extends BackgroundNode {

  private readonly textNode: RichText;

  /**
   * @param text - the label's text
   * @param positionProperty - position of the thing that we're labeling, in model coordinates
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  public constructor( text: string,
                      positionProperty: IReadOnlyProperty<Vector2>,
                      zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
                      providedOptions: LabelNodeOptions ) {

    const options = optionize<LabelNodeOptions, SelfOptions, BackgroundNodeOptions>()( {

      // SelfOptions
      xAlign: 'center',
      yAlign: 'top',
      xOffset: 0,
      yOffset: 2,
      phetioReadOnlyText: false,

      // BackgroundNodeOptions
      xMargin: 5,
      yMargin: 5,
      rectangleOptions: {
        fill: GOColors.screenBackgroundColorProperty,
        cornerRadius: 4,
        opacity: 0.5
      }
    }, providedOptions );

    const textNode = new RichText( text, {
      align: 'center',
      fill: GOColors.labelFillProperty,
      font: GOConstants.LABEL_FONT,
      maxWidth: 85,
      tandem: providedOptions.tandem.createTandem( 'textNode' ),
      phetioVisiblePropertyInstrumented: false,
      textPropertyOptions: {
        phetioReadOnly: options.phetioReadOnlyText
      }
    } );

    super( textNode, options );

    this.textNode = textNode;

    Multilink.multilink(
      [ zoomTransformProperty, positionProperty, textNode.boundsProperty ],
      ( zoomTransform, position, textBounds ) => {
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public setText( text: string ): void {
    this.textNode.text = text;
  }
}

geometricOptics.register( 'LabelNode', LabelNode );