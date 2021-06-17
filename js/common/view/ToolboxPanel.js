// Copyright 2021, University of Colorado Boulder

/**
 * A maximum of 1 horizontal ruler and 1 vertical ruler can be dragged out from this toolbox panel.
 * The toolbox panel shows a miniature version of these rulers.
 * Appears in the top right corner of the simulation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Panel from '../../../../sun/js/Panel.js';
import geometricOptics from '../../geometricOptics.js';

class ToolboxPanel extends Panel {
  /**
   *
   * @param {GeometricOpticsRulerNode} horizontalRulerNode
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( horizontalRulerNode, tandem, options ) {

    options = merge( {
      align: 'center',
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey'
    }, options );

    /**
     * Returns a small ruler icon
     * @param {boolean} isVertical
     * @returns {RulerNode} rulerIconNode
     */
    const getRulerIcon = isVertical => {

      const rulerWidth = 397;
      const rulerHeight = 0.175 * rulerWidth;
      const majorTickLabels = [ '' ];
      for ( let i = 1; i < 5; i++ ) { // create 5 empty strings for labels
        majorTickLabels.push( '' );
      }
      const majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
      const rulerIconNode = new RulerNode(
        rulerWidth,
        rulerHeight,
        majorTickWidth,
        majorTickLabels,
        '',
        {
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
    };

    const horizontalRulerIconNode = getRulerIcon( false );
    const verticalRulerIconNode = getRulerIcon( true );

    const toolbox = new HBox( {
      spacing: 30,
      children: [ verticalRulerIconNode, horizontalRulerIconNode ],
      excludeInvisibleChildrenFromBounds: false
    } );

    super( toolbox, options );

    const horizontalRulerVisibleProperty = new BooleanProperty( false );

    // icon disappears when ruler appears
    horizontalRulerVisibleProperty.link( visible => {
      horizontalRulerNode.visible = visible;
      horizontalRulerIconNode.visible = !visible;
    } );

    horizontalRulerIconNode.addInputListener( DragListener.createForwardingListener( event => {
      if ( horizontalRulerVisibleProperty.value === false ) {
        horizontalRulerVisibleProperty.value = true;
        //horizontalRulerNode.startBaseDrag( event );
      }

    } ) );

  }
}

geometricOptics.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;
