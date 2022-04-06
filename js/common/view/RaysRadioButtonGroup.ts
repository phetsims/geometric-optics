// Copyright 2021-2022, University of Colorado Boulder

/**
 * RaysRadioButtonGroup is the radio button group labeled 'Rays', for choosing a representation of rays.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import { RaysType } from '../model/RaysType.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IProperty from '../../../../axon/js/IProperty.js';

type RaysRadioButtonGroupOptions = PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

export default class RaysRadioButtonGroup extends VerticalAquaRadioButtonGroup<RaysType> {

  /**
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( raysTypeProperty: IProperty<RaysType>, providedOptions: RaysRadioButtonGroupOptions ) {

    const options = optionize<RaysRadioButtonGroupOptions, {}, VerticalAquaRadioButtonGroupOptions>( {

      // VerticalAquaRadioButtonGroupOptions
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, providedOptions );

    // items for ray Mode radio buttons
    const items = [
      createItem( 'marginal', geometricOpticsStrings.radioButton.marginal, options.tandem, 'marginalRadioButton' ),
      createItem( 'principal', geometricOpticsStrings.radioButton.principal, options.tandem, 'principalRadioButton' ),
      createItem( 'many', geometricOpticsStrings.radioButton.many, options.tandem, 'manyRadioButton' ),
      createItem( 'none', geometricOpticsStrings.radioButton.none, options.tandem, 'noneRadioButton' )
    ];

    super( raysTypeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value
 * @param text
 * @param groupTandem
 * @param itemTandemName
 */
function createItem( value: RaysType, text: string, groupTandem: Tandem, itemTandemName: string ): AquaRadioButtonGroupItem<RaysType> {
  return {
    value: value,
    node: new Text( text, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 65,
      tandem: groupTandem.createTandem( itemTandemName ).createTandem( 'labelText' ),
      phetioVisiblePropertyInstrumented: false
    } ),
    tandemName: itemTandemName
  };
}

geometricOptics.register( 'RaysRadioButtonGroup', RaysRadioButtonGroup );