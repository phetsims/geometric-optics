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
import { DragListener, HBox, SceneryEvent } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';
import { RulerOrientation } from '../model/GeometricOpticsRuler.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';

class RulersToolbox extends Panel {

  /**
   * @param horizontalRulerNode
   * @param verticalRulerNode
   * @param options
   */
  constructor( horizontalRulerNode: GeometricOpticsRulerNode, verticalRulerNode: GeometricOpticsRulerNode, options?: any ) {

    options = merge( {

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

    // create icons for the 2 rulers
    // @ts-ignore DerivedProperty.not has incorrect param type
    const horizontalRulerIconNode = createRulerIcon( 'horizontal', DerivedProperty.not( horizontalRulerNode.visibleProperty ) );
    // @ts-ignore DerivedProperty.not has incorrect param type
    const verticalRulerIconNode = createRulerIcon( 'vertical', DerivedProperty.not( verticalRulerNode.visibleProperty ) );

    // create the content for the panel
    const toolboxContent = new HBox( {
      spacing: 30,
      children: [ verticalRulerIconNode, horizontalRulerIconNode ],
      excludeInvisibleChildrenFromBounds: false
    } );

    super( toolboxContent, options );

    // Add a forwarding listener to each icon, to forward drag events from the icon to its associated ruler.
    const createForwardingListener = ( rulerNode: GeometricOpticsRulerNode ) => {
      return DragListener.createForwardingListener( ( event: SceneryEvent ) => {
        assert && assert( !rulerNode.ruler.visibleProperty.value );

        // Make the ruler visible.
        rulerNode.ruler.visibleProperty.value = true;

        // Position the center of the rulerNode at the pointer.
        assert && assert( event.pointer.point ); // {Vector2|null}
        rulerNode.center = this.globalToParentPoint( event.pointer.point! );

        // Forward events to the RulerNode.
        rulerNode.startDrag( event );
      } );
    };
    horizontalRulerIconNode.addInputListener( createForwardingListener( horizontalRulerNode ) );
    verticalRulerIconNode.addInputListener( createForwardingListener( verticalRulerNode ) );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Returns a small ruler icon
 * @param orientation
 * @param visibleProperty
 */
function createRulerIcon( orientation: RulerOrientation, visibleProperty: IProperty<boolean> ): RulerNode {

  const rulerWidth = 400;
  const rulerHeight = 0.35 * rulerWidth;

  const options = {

    // pointer areas
    touchAreaDilationX: 50,
    touchAreaDilationY: 50,
    mouseAreaDilationX: 50,
    mouseAreaDilationY: 50,

    // RulerNode options
    backgroundLineWidth: 3,
    minorTicksPerMajorTick: 5,
    majorTickHeight: ( 0.6 * rulerHeight ) / 2,
    minorTickHeight: ( 0.4 * rulerHeight ) / 2,
    majorTickLineWidth: 5,
    minorTickLineWidth: 2,
    cursor: 'pointer',
    visibleProperty: visibleProperty
  };

  const numberOfMajorTicks = 5;
  const majorTickLabels = [ '' ];
  for ( let i = 1; i < numberOfMajorTicks; i++ ) {
    majorTickLabels.push( '' );
  }
  const majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
  const units = ''; // empty string for units

  const rulerIconNode = new RulerNode( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options );
  rulerIconNode.scale( 0.12 );

  rulerIconNode.touchArea = rulerIconNode.localBounds.dilatedXY( options.touchAreaDilationX, options.touchAreaDilationY );
  rulerIconNode.mouseArea = rulerIconNode.localBounds.dilatedXY( options.mouseAreaDilationX, options.mouseAreaDilationY );

  // rotate to create vertical ruler
  if ( orientation === 'vertical' ) {
    rulerIconNode.rotate( -Math.PI / 2 );
  }

  return rulerIconNode;
}

geometricOptics.register( 'RulersToolbox', RulersToolbox );
export default RulersToolbox;