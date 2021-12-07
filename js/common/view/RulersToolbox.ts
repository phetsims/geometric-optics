// Copyright 2021, University of Colorado Boulder

/**
 * RulersToolbox is the toolbox that holds the rulers.
 * A maximum of one horizontal ruler and one vertical ruler can be dragged out from this toolbox.
 * The toolbox shows miniature versions of these rulers.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import { DragListener, HBox, Node, SceneryEvent } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';

class RulersToolbox extends Panel {

  /**
   * @param horizontalRulerNode
   * @param verticalRulerNode
   * @param options
   */
  constructor( horizontalRulerNode: GeometricOpticsRulerNode, verticalRulerNode: GeometricOpticsRulerNode, options?: any ) {

    options = merge( {

      // Pointer areas for ruler icons in the toolbox
      touchAreaDilationX: 50,
      touchAreaDilationY: 50,
      mouseAreaDilationX: 50,
      mouseAreaDilationY: 50,

      // Panel options
      align: 'center',
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // create two icons for rulers: A vertical and a Horizontal ruler
    const horizontalRulerIconNode = createRulerIcon( false, false );
    const verticalRulerIconNode = createRulerIcon( true, true );

    // increase touchArea and mouseArea for both rulers
    horizontalRulerIconNode.touchArea = horizontalRulerIconNode.localBounds.dilatedXY(
      options.touchAreaDilationX, options.touchAreaDilationY );
    horizontalRulerIconNode.mouseArea = horizontalRulerIconNode.localBounds.dilatedXY(
      options.mouseAreaDilationX, options.mouseAreaDilationY );
    verticalRulerIconNode.touchArea = verticalRulerIconNode.localBounds.dilatedXY(
      options.touchAreaDilationX, options.touchAreaDilationY );
    verticalRulerIconNode.mouseArea = verticalRulerIconNode.localBounds.dilatedXY(
      options.mouseAreaDilationX, options.mouseAreaDilationY );

    // create the content for the panel
    const toolbox = new HBox( {
      spacing: 30,
      children: [ verticalRulerIconNode, horizontalRulerIconNode ],
      excludeInvisibleChildrenFromBounds: false
    } );

    super( toolbox, options );

    /**
     * Add input listener on iconNode to forward events to rulerNode
     * @param iconNode
     * @param rulerNode
     */
    const addForwardingListener = ( iconNode: Node, rulerNode: GeometricOpticsRulerNode ): void => {

      // ruler node and icon node have opposite visibilities
      rulerNode.visibleProperty.link( ( visible: boolean ) => {
        iconNode.visible = !visible;
      } );

      iconNode.addInputListener( DragListener.createForwardingListener( ( event: SceneryEvent ) => {

        // we can add a ruler only if the ruler Node is not visible
        if ( !rulerNode.visible ) {

          // set the visibility of ruler Node to true
          rulerNode.visible = true;

          // position the center of the rulerNode to the cursor
          assert && assert( event.pointer.point ); // {Vector2|null}
          rulerNode.center = this.globalToParentPoint( event.pointer.point! );

          // forward events
          rulerNode.startDrag( event );
        }
      } ) );
    };

    // Add a forwarding listener for each ruler icon, to forward drag events from the icon to its associated ruler.
    addForwardingListener( horizontalRulerIconNode, horizontalRulerNode );
    addForwardingListener( verticalRulerIconNode, verticalRulerNode );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Returns a small ruler icon
 * @param isVertical - is the ruler icon along the vertical axis
 * @param tickMarksOnBottom
 */
function createRulerIcon( isVertical: boolean, tickMarksOnBottom: boolean ): RulerNode {

  const rulerWidth = 400;
  const rulerHeight = 0.35 * rulerWidth;

  const numberOfMajorTicks = 5;
  const majorTickLabels = [ '' ];
  for ( let i = 1; i < numberOfMajorTicks; i++ ) {
    majorTickLabels.push( '' );
  }
  const majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
  const units = ''; // empty string for units

  const rulerIconNode = new RulerNode( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, {
    backgroundLineWidth: 3,
    tickMarksOnBottom: tickMarksOnBottom,
    minorTicksPerMajorTick: 5,
    majorTickHeight: ( 0.6 * rulerHeight ) / 2,
    minorTickHeight: ( 0.4 * rulerHeight ) / 2,
    majorTickLineWidth: 5,
    minorTickLineWidth: 2,
    cursor: 'pointer'
  } );
  rulerIconNode.scale( 0.12 );

  // rotate to create vertical ruler
  if ( isVertical ) {
    rulerIconNode.rotate( -Math.PI / 2 );
  }

  return rulerIconNode;
}

geometricOptics.register( 'RulersToolbox', RulersToolbox );
export default RulersToolbox;