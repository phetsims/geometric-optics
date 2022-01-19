// Copyright 2021-2022, University of Colorado Boulder

/**
 * RepresentationComboBox is the combo box for selecting the object representation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { HBox, Image, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import Representation from '../model/Representation.js';

type RepresentationComboBoxOptions = {
  tandem: Tandem
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class RepresentationComboBox extends ComboBox {

  /**
   * @param representationProperty
   * @param listParent - parent for the listbox popup
   * @param providedOptions
   */
  constructor( representationProperty: Property<Representation>, listParent: Node, providedOptions: RepresentationComboBoxOptions ) {

    // Create a ComboBoxItem for each representation.
    const items: ComboBoxItem[] = [];
    assert && assert( representationProperty.validValues ); // {Representation[]|undefined}
    representationProperty.validValues!.forEach( ( representation: Representation ) => {

      // create text
      const text = new Text( representation.label, {
        font: GOConstants.CONTROL_FONT,
        maxWidth: 100
      } );

      // create icon
      const icon = new Image( representation.icon, { scale: 0.5 } );

      // hold the logo followed by text in a hbox
      const hBox = new HBox( { spacing: 5, children: [ icon, text ] } );

      // create and add combo box item to the array
      items.push( new ComboBoxItem( hBox, representation, {
        tandemName: `${representation.tandemPrefix}Item`
      } ) );
    } );

    super( items, representationProperty, listParent, merge( {

      // ComboBox options
      highlightFill: 'rgb( 168, 192, 245 )',
      listPosition: 'below',
      xMargin: 10,
      yMargin: 5
    }, providedOptions ) );
  }
}

geometricOptics.register( 'RepresentationComboBox', RepresentationComboBox );
export default RepresentationComboBox;