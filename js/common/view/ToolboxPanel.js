// Copyright 2021, University of Colorado Boulder

/**
 * A maximum of 1 horizontal ruler and 1 vertical ruler can be dragged out from this toolbox panel.
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

class ToolboxPanel extends Panel {
  /**
   * @param {GeometricOpticRulersLayer} rulersLayer
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( rulersLayer, tandem, options ) {


    options = merge( {
      align: 'center',
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey',
      touchAreaDilationX: 80,
      touchAreaDilationY: 80,
      mouseAreaDilationX: 80,
      mouseAreaDilationY: 80
    }, options );

    // create two icons for rulers: A vertical and a Horizontal ruler
    const horizontalRulerIconNode = ToolboxPanel.getRulerIcon( false );
    const verticalRulerIconNode = ToolboxPanel.getRulerIcon( true );

    // increase touchArea and mouseArea for both rulers
    horizontalRulerIconNode.touchArea = horizontalRulerIconNode.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    horizontalRulerIconNode.mouseArea = horizontalRulerIconNode.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );
    verticalRulerIconNode.touchArea = verticalRulerIconNode.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
    verticalRulerIconNode.mouseArea = verticalRulerIconNode.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

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
     * @param {Property.<boolean>} visibleRulerProperty
     */
    const createForwardListener = ( iconNode, rulerNode, visibleRulerProperty ) => {

      // ruler node and icon node have opposite visibilities
      visibleRulerProperty.link( visible => {
        iconNode.visible = !visible;
      } );

      iconNode.addInputListener( DragListener.createForwardingListener( event => {
        if ( !visibleRulerProperty.value ) {
          visibleRulerProperty.value = true;
          rulerNode.center = this.globalToParentPoint( event.pointer.point );
          rulerNode.startDrag( event );
        }
      } ) );
    };

    createForwardListener( horizontalRulerIconNode, rulersLayer.horizontalRulerNode, rulersLayer.visibleHorizontalProperty );
    createForwardListener( verticalRulerIconNode, rulersLayer.verticalRulerNode, rulersLayer.visibleVerticalProperty );
  }

  /**
   * Returns a small ruler icon
   * @private
   * @param {boolean} isVertical
   * @returns {RulerNode} rulerIconNode
   */
  static getRulerIcon( isVertical ) {

    const rulerWidth = 400;
    const rulerHeight = 0.18 * rulerWidth;
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < 5; i++ ) { // create 5 empty strings for labels
      majorTickLabels.push( '' );
    }
    const majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    const units = ''; // empty string for units

    const rulerIconNode = new RulerNode( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, {
        tickMarksOnBottom: false,
        minorTicksPerMajorTick: 1,
        majorTickHeight: ( 0.6 * rulerHeight ) / 2,
        minorTickHeight: ( 0.4 * rulerHeight ) / 2,
        majorTickLineWidth: 2
      }
    );
    rulerIconNode.scale( 0.12 );

    // rotate to create vertical ruler
    if ( isVertical ) {
      rulerIconNode.rotate( -Math.PI / 2 );
    }

    return rulerIconNode;
  }
}

geometricOptics.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;
