// Copyright 2021, University of Colorado Boulder

/**
 * RaysRadioButtonGroup is the radio button group labeled 'Rays', for choosing a representation of rays.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import RaysMode from '../model/RaysMode.js';

class RaysRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<RaysMode>} raysModeProperty
   * @param {Object} [options]
   */
  constructor( raysModeProperty, options ) {

    assert && assert( raysModeProperty instanceof EnumerationProperty );

    options = merge( {
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, options );

    // items for ray Mode radio buttons
    const items = [
      createItem( RaysMode.MARGINAL, geometricOpticsStrings.marginal ),
      createItem( RaysMode.PRINCIPAL, geometricOpticsStrings.principal ),
      createItem( RaysMode.MANY, geometricOpticsStrings.many ),
      createItem( RaysMode.NONE, geometricOpticsStrings.none )
    ];

    super( raysModeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param {RaysMode} mode
 * @param {string} string
 * @returns {{node: Text, value: RaysMode}} item
 */
function createItem( mode, string ) {
  return {
    value: mode,
    node: new Text( string, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxWidth: 100
    } )
  };
}

geometricOptics.register( 'RaysRadioButtonGroup', RaysRadioButtonGroup );
export default RaysRadioButtonGroup;