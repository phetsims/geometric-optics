// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalObjectChoiceComboBox is the combo box for selecting the object representation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { AlignBox, AlignGroup, HBox, Image, Node, NodeTranslationOptions, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import OpticalObjectChoice from '../model/OpticalObjectChoice.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type OpticalObjectChoiceComboBoxOptions = SelfOptions &
  PickRequired<ComboBoxOptions, 'tandem'> &
  NodeTranslationOptions;

export default class OpticalObjectChoiceComboBox extends ComboBox<OpticalObjectChoice> {

  /**
   * @param opticalObjectChoiceProperty
   * @param listParent - parent for the listbox popup
   * @param providedOptions
   */
  public constructor( opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>, listParent: Node,
                      providedOptions: OpticalObjectChoiceComboBoxOptions ) {

    const options = optionize<OpticalObjectChoiceComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      highlightFill: 'rgb( 168, 192, 245 )',
      listPosition: 'below',
      xMargin: 10,
      yMargin: 5,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5
    }, providedOptions );

    // To make all icons have the same effective dimensions
    const iconsAlignGroup = new AlignGroup();

    // Create a ComboBoxItem for each representation.
    const items: ComboBoxItem<OpticalObjectChoice>[] = [];
    assert && assert( opticalObjectChoiceProperty.validValues ); // {OpticalObjectChoice[]|undefined}
    opticalObjectChoiceProperty.validValues!.forEach( ( opticalObjectChoice: OpticalObjectChoice ) => {

      // create text
      const text = new Text( opticalObjectChoice.label, {
        font: GOConstants.CONTROL_FONT,
        maxWidth: 100
      } );

      // create icon
      const icon = ( opticalObjectChoice.icon instanceof Node ) ?
                   new Node( { children: [ opticalObjectChoice.icon ] } ) :
                   new Image( opticalObjectChoice.icon, { scale: 0.5 } );
      const iconAlignBox = new AlignBox( icon, {
        group: iconsAlignGroup
      } );

      // hold the logo followed by text in a hbox
      const hBox = new HBox( { spacing: 5, children: [ iconAlignBox, text ] } );

      // create and add combo box item to the array
      items.push( {
        value: opticalObjectChoice,
        node: hBox,
        tandemName: `${opticalObjectChoice.tandemPrefix}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      } );
    } );

    super( opticalObjectChoiceProperty, items, listParent, options );
  }
}

geometricOptics.register( 'OpticalObjectChoiceComboBox', OpticalObjectChoiceComboBox );