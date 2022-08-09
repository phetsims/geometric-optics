// Copyright 2021-2022, University of Colorado Boulder

/**
 * GORulerIcon is a ruler icon that appears in the toolbox. It is associated with a specific ruler Node,
 * and forwards events to that Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import RulerNode from '../../../../../scenery-phet/js/RulerNode.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import geometricOptics from '../../../geometricOptics.js';
import GORuler from '../../model/tools/GORuler.js';
import GORulerNode from './GORulerNode.js';
import GOToolIcon from './GOToolIcon.js';

// constants
const ICON_WIDTH = 48;
const ICON_HEIGHT = 17;
const NUMBER_OF_MAJOR_TICKS = 5;

export default class GORulerIcon extends GOToolIcon {

  /**
   * @param ruler - model element associated with this icon
   * @param rulerNode - view element associated with this icon
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   */
  public constructor( ruler: GORuler,
                      rulerNode: GORulerNode,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    // GOToolIconOptions
    const options = {
      rotation: ( ruler.orientation === 'vertical' ) ? ( -Math.PI / 2 ) : 0,
      touchAreaDilationX: 4,
      touchAreaDilationY: 4,
      mouseAreaDilationX: 4,
      mouseAreaDilationY: 4
    };

    // The ruler icon has no ticks labels, it would be too much detail in an icon.
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < NUMBER_OF_MAJOR_TICKS; i++ ) {
      majorTickLabels.push( '' );
    }
    const majorTickWidth = ICON_WIDTH / ( majorTickLabels.length - 1 );

    // The ruler icon has no units, it would be too much detail in an icon.
    const units = '';

    const contentNode = new RulerNode( ICON_WIDTH, ICON_HEIGHT, majorTickWidth, majorTickLabels, units, {
      backgroundLineWidth: 0.5,
      majorTickLineWidth: 0.5,
      minorTickLineWidth: 0.25,
      minorTicksPerMajorTick: 5,
      majorTickHeight: ( 0.6 * ICON_HEIGHT ) / 2,
      minorTickHeight: ( 0.4 * ICON_HEIGHT ) / 2,
      insetsWidth: 0,
      tandem: Tandem.OPT_OUT // because RulerNode is Tandem.REQUIRED by default
    } );

    const pointerPositionToToolPosition = ( pointerPosition: Vector2 ) => {
      const zoomTransform = zoomTransformProperty.value;
      const viewPosition = rulerNode.globalToParentPoint( pointerPosition );
      let x;
      let y;
      if ( ruler.orientation === 'vertical' ) {
        x = viewPosition.x - rulerNode.width / 2;
        y = viewPosition.y - zoomTransform.modelToViewDeltaY( ruler.length ) / 2;
      }
      else {
        x = viewPosition.x - zoomTransform.modelToViewDeltaX( ruler.length ) / 2;
        y = viewPosition.y - rulerNode.height / 2;
      }
      return zoomTransform.viewToModelXY( x, y );
    };

    super( contentNode, ruler, rulerNode, zoomTransformProperty, pointerPositionToToolPosition, options );
  }
}

geometricOptics.register( 'GORulerIcon', GORulerIcon );