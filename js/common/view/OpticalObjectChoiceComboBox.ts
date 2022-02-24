// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalObjectChoiceComboBox is the combo box for selecting the object representation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, AlignGroup, HBox, Image, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import OpticalObjectChoice from '../model/OpticalObjectChoice.js';
import { PickOptional, PickRequired } from '../GOTypes.js';

//TODO https://github.com/phetsims/geometric-optics/issues/326 should be ComboBoxOptions
type OpticalObjectChoiceComboBoxOptions = PickRequired<NodeOptions, 'tandem'>
  & PickOptional<NodeOptions, 'left' | 'right' | 'centerX' | 'top' | 'bottom' | 'centerY'>;

class OpticalObjectChoiceComboBox extends ComboBox {

  /**
   * @param opticalObjectChoiceProperty
   * @param listParent - parent for the listbox popup
   * @param providedOptions
   */
  constructor( opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>, listParent: Node,
               providedOptions: OpticalObjectChoiceComboBoxOptions ) {

    // To make all icons have the same effective dimensions
    const iconsAlignGroup = new AlignGroup();

    // Create a ComboBoxItem for each representation.
    const items: ComboBoxItem[] = [];
    assert && assert( opticalObjectChoiceProperty.validValues ); // {OpticalObjectChoice[]|undefined}
    opticalObjectChoiceProperty.validValues!.forEach( ( opticalObjectChoice: OpticalObjectChoice ) => {

      // create text
      const text = new Text( opticalObjectChoice.label, {
        font: GOConstants.CONTROL_FONT,
        maxWidth: 100
      } );

      // create icon
      const icon = ( opticalObjectChoice.icon instanceof Node ) ?
                   opticalObjectChoice.icon :
                   new Image( opticalObjectChoice.icon, { scale: 0.5 } );
      const iconAlignBox = new AlignBox( icon, {
        group: iconsAlignGroup
      } );

      // hold the logo followed by text in a hbox
      const hBox = new HBox( { spacing: 5, children: [ iconAlignBox, text ] } );

      // create and add combo box item to the array
      items.push( new ComboBoxItem( hBox, opticalObjectChoice, {
        tandemName: `${opticalObjectChoice.tandemPrefix}Item`
      } ) );
    } );

    super( items, opticalObjectChoiceProperty, listParent, merge( {

      // ComboBox options
      highlightFill: 'rgb( 168, 192, 245 )',
      listPosition: 'below',
      xMargin: 10,
      yMargin: 5,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5
    }, providedOptions ) );
  }
}

geometricOptics.register( 'OpticalObjectChoiceComboBox', OpticalObjectChoiceComboBox );
export default OpticalObjectChoiceComboBox;