// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOToolbox is the toolbox that holds the tools - rulers and position markers.
 * It has no responsibility for the behavior of its contents (tools icons) or the tools themselves.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox } from '../../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../../sun/js/Panel.js';
import geometricOptics from '../../../geometricOptics.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOToolNode from './GOToolNode.js';
import Property from '../../../../../axon/js/Property.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';

type RulersToolboxOptions = PickRequired<PanelOptions, 'tandem'>;

class GOToolbox extends Panel {

  /**
   * @param toolNodes - in the order that they appear in the toolbox, left to right
   * @param providedOptions
   */
  constructor( toolNodes: GOToolNode[], providedOptions: RulersToolboxOptions ) {

    const options = optionize<RulersToolboxOptions, {}, PanelOptions>( {

      // PanelOptions
      align: 'center',
      cornerRadius: 5,
      xMargin: 20,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey'
    }, providedOptions );

    const toolboxContent = new HBox( {
      spacing: 20,
      children: toolNodes.map( toolNode => toolNode.icon )
    } );

    super( toolboxContent, options );

    // Tell the tools where the toolbox is, in global view coordinates.
    // This allows tools to determine when they have been dragged back to the toolbox.
    Property.multilink( [ this.boundsProperty, this.visibleProperty ],
      ( bounds: Bounds2, visible: boolean ) => {
        const toolboxBounds = visible ? this.parentToGlobalBounds( bounds ) : Bounds2.NOTHING;
        toolNodes.forEach( toolNode => toolNode.setToolboxBounds( toolboxBounds ) );
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOToolbox', GOToolbox );
export default GOToolbox;