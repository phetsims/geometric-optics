// Copyright 2021, University of Colorado Boulder

/**
 * RulersToolbox is the toolbox that holds the rulers.
 * It has no responsibility for the behavior of its contents (icons) or the rulers.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';
import RulerIconNode from './RulerIconNode.js';

class RulersToolbox extends Panel {

  /**
   * @param rulerNodes - in the order that they appear in the toolbox, left to right
   * @param options
   */
  constructor( rulerNodes: GeometricOpticsRulerNode[], options?: any ) {

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

    const toolboxContent = new HBox( {
      spacing: 30,
      children: rulerNodes.map( rulerNode => new RulerIconNode( rulerNode ) ),
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