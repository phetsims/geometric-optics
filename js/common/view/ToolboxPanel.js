// Copyright 2021, University of Colorado Boulder

/**
 * A maximum of 1 horizontal ruler and 1 vertical ruler can be dragged out from this toolbox panel.
 * The toolbox panel shows a miniature version of these rulers.
 * Appears in the top right corner of the simulation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Panel from '../../../../sun/js/Panel.js';
import geometricOptics from '../../geometricOptics.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';

class ToolboxPanel extends Panel {

  constructor( options ) {
    options = merge( {
      align: 'center',
      cornerRadius: 5,
      fill: 'grey',
      stroke: 'white'
    }, options );

    const icons = new Circle( 50, { fill: 'pink' } );

    super( icons, options );

  }
}

geometricOptics.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;
