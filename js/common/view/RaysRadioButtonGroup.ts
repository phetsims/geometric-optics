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
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import { RaysType } from '../model/RaysType.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type RaysRadioButtonGroupOptions = SelfOptions & PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

export default class RaysRadioButtonGroup extends VerticalAquaRadioButtonGroup<RaysType> {

  public constructor( raysTypeProperty: Property<RaysType>, providedOptions: RaysRadioButtonGroupOptions ) {

    const options = optionize<RaysRadioButtonGroupOptions, SelfOptions, VerticalAquaRadioButtonGroupOptions>()( {

      // VerticalAquaRadioButtonGroupOptions
      spacing: 4,
      align: 'left',
      radioButtonOptions: { radius: 7 },
      touchAreaXDilation: 10,
      mouseAreaXDilation: 10
    }, providedOptions );

    // items for ray Mode radio buttons
    const items = [
      createItem( 'marginal', GeometricOpticsStrings.radioButton.marginalStringProperty, options.tandem, 'marginalRadioButton' ),
      createItem( 'principal', GeometricOpticsStrings.radioButton.principalStringProperty, options.tandem, 'principalRadioButton' ),
      createItem( 'many', GeometricOpticsStrings.radioButton.manyStringProperty, options.tandem, 'manyRadioButton' ),
      createItem( 'none', GeometricOpticsStrings.radioButton.noneStringProperty, options.tandem, 'noneRadioButton' )
    ];

    super( raysTypeProperty, items, options );
  }
}

/**
 * Creates an item for the radio button group.
 * @param value - value associated with the radio button
 * @param labelStringProperty - label that appears on the radio button
 * @param groupTandem - used to associate the item's tandem with the radio-button group
 * @param itemTandemName - used to create the item's tandem
 */
function createItem( value: RaysType,
                     labelStringProperty: TReadOnlyProperty<string>,
                     groupTandem: Tandem,
                     itemTandemName: string ): AquaRadioButtonGroupItem<RaysType> {
  return {
    value: value,
    createNode: tandem => new Text( labelStringProperty, {
      font: GOConstants.CONTROL_FONT,
      maxWidth: 65,
      tandem: tandem.createTandem( 'labelText' )
    } ),
    tandemName: itemTandemName
  };
}

geometricOptics.register( 'RaysRadioButtonGroup', RaysRadioButtonGroup );