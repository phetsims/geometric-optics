// Copyright 2021-2022, University of Colorado Boulder

/**
 * RulersToolbox is the toolbox that holds the rulers.
 * It has no responsibility for the behavior of its contents (icons) or the rulers.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, NodeOptions } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import geometricOptics from '../../geometricOptics.js';
import GORulerNode from './GORulerNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../PickRequired.js';
import { PickOptional } from '../PickOptional.js';

//TODO https://github.com/phetsims/geometric-optics/issues/315 should be PanelOptions
type RulersToolboxOptions = PickRequired<NodeOptions, 'tandem'>
  & PickOptional<NodeOptions, 'left' | 'right' | 'centerX' | 'top' | 'bottom' | 'centerY'>;

class RulersToolbox extends Panel {

  /**
   * @param rulerNodes - in the order that they appear in the toolbox, left to right
   * @param providedOptions
   */
  constructor( rulerNodes: GORulerNode[], providedOptions: RulersToolboxOptions ) {

    const options = optionize<RulersToolboxOptions, {}, PanelOptions>( {

      // Panel options
      align: 'center',
      cornerRadius: 5,
      xMargin: 20,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey'
    }, providedOptions );

    const toolboxContent = new HBox( {
      spacing: 20,
      children: rulerNodes.map( rulerNode => rulerNode.iconNode ),
      excludeInvisibleChildrenFromBounds: false
    } );

    super( toolboxContent, options );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'RulersToolbox', RulersToolbox );
export default RulersToolbox;