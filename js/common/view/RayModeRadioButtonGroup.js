// Copyright 2021, University of Colorado Boulder

/**
 * RayModeRadioButtonGroup is the radio button group for choosing a LightRayMode.
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
import LightRayMode from '../model/LightRayMode.js';

class RayModeRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<LightRayMode>} lightRayModeProperty
   * @param {Object} [options]
   */
  constructor( lightRayModeProperty, options ) {

    assert && assert( lightRayModeProperty instanceof EnumerationProperty );

    options = merge( {
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, options );

    // items for ray Mode radio buttons
    const items = [
      createItem( LightRayMode.MARGINAL, geometricOpticsStrings.marginal ),
      createItem( LightRayMode.PRINCIPAL, geometricOpticsStrings.principal ),
      createItem( LightRayMode.MANY, geometricOpticsStrings.many ),
      createItem( LightRayMode.NONE, geometricOpticsStrings.none )
    ];

    super( lightRayModeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param {LightRayMode} mode
 * @param {string} string
 * @returns {{node: Text, value: LightRayMode}} item
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

geometricOptics.register( 'RayModeRadioButtonGroup', RayModeRadioButtonGroup );
export default RayModeRadioButtonGroup;