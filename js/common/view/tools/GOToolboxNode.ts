// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOToolboxNode is the toolbox that holds the tools - rulers and position markers.
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
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';

type RulersToolboxOptions = PickRequired<PanelOptions, 'tandem'>;

class GOToolboxNode extends Panel {

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

    // Tell the tools that they are associated with this toolbox.
    // This allows tools to determine when they have been dragged back to the toolbox.
    toolNodes.forEach( toolNode => toolNode.setToolboxNode( this ) );
  }

  /**
   * Given a point in the global coordinate frame, is it inside the visible bounds of the toolbox?
   * @param globalPoint
   */
  public containsGlobalPoint( globalPoint: Vector2 ): boolean {
    return this.getGlobalVisibleBounds().containsPoint( globalPoint );
  }

  /**
   * Given bounds in the global coordinate frame, do they intersect the visible bounds of the toolbox?
   * @param globalBounds
   */
  public intersectsGlobalBounds( globalBounds: Bounds2 ): boolean {
    return this.getGlobalVisibleBounds().intersectsBounds( globalBounds );
  }

  /**
   * Gets the visible bounds of the toolbox in the global coordinate frame.
   * While we do not move the toolbox, this cannot be considered static because of pan-&-zoom.
   * See https://github.com/phetsims/geometric-optics/issues/388
   */
  private getGlobalVisibleBounds(): Bounds2 {
    return this.visible ? this.getGlobalBounds() : Bounds2.NOTHING;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOToolboxNode', GOToolboxNode );
export default GOToolboxNode;