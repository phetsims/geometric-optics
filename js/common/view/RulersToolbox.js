// Copyright 2021, University of Colorado Boulder

/**
 * RulersToolbox is the toolbox that holds the rulers.
 * A maximum of one horizontal ruler and one vertical ruler can be dragged out from this toolbox panel.
 * The toolbox panel shows a miniature version of these rulers.
 * Appears in the top right corner of the simulation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Panel from '../../../../sun/js/Panel.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticRulersLayer from './GeometricOpticsRulersLayer.js';

class RulersToolbox extends Panel {

  /**
   * @param {GeometricOpticRulersLayer} rulersLayer
   * @param {Object} [options]
   */
  constructor( rulersLayer, options ) {

    assert && assert( rulersLayer instanceof GeometricOpticRulersLayer );

    options = merge( {
      align: 'center',
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey',
      touchAreaDilationX: 50,
      touchAreaDilationY: 50,
      mouseAreaDilationX: 50,
      mouseAreaDilationY: 50
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
     * @param {Node} iconNode
     * @param {GeometricOpticsRulerNode} rulerNode
     */
    const createForwardListener = ( iconNode, rulerNode ) => {

      // ruler node and icon node have opposite visibilities
      rulerNode.visibleProperty.link( visible => {
        iconNode.visible = !visible;
      } );

      iconNode.addInputListener( DragListener.createForwardingListener( event => {

        // we can add a ruler only if the ruler Node is not visible
        if ( !rulerNode.visible ) {

          // set the visibility of ruler Node to true
          rulerNode.visible = true;

          // position the center of the rulerNode to the cursor
          rulerNode.center = this.globalToParentPoint( event.pointer.point );

          // forward events
          rulerNode.startDrag( event );
        }
      } ) );
    };

    // attach a create a Forward listener on each icon
    createForwardListener( horizontalRulerIconNode, rulersLayer.horizontalRulerNode );
    createForwardListener( verticalRulerIconNode, rulersLayer.verticalRulerNode );
  }
}

/**
 * Returns a small ruler icon
 * @private
 * @param {boolean} isVertical - is the ruler icon along the vertical axis
 * @param {boolean} tickMarksOnBottom
 * @returns {RulerNode} rulerIconNode
 */
function createRulerIcon( isVertical, tickMarksOnBottom ) {

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