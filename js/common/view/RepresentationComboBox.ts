// Copyright 2021, University of Colorado Boulder

/**
 * RepresentationComboBox is the combo box for selecting the object representation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class RepresentationComboBox extends ComboBox {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Node} listParent - parent for the listbox popup
   * @param {Object} [options]
   */
  constructor( representationProperty: any, listParent: Node, options?: any ) { //TODO-TS any any

    options = merge( {

      // ComboBox options
      highlightFill: 'rgb(168,192,245)',
      listPosition: 'below',
      xMargin: 10,
      yMargin: 5,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Create a ComboBoxItem for each representation.
    const items: ComboBoxItem[] = [];
    representationProperty.validValues.forEach( ( representation: any ) => { //TODO-TS any any

      // create text
      const text = new Text( representation.label, {
        font: GeometricOpticsConstants.CONTROL_FONT,
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

    super( items, representationProperty, listParent, options );
  }
}

geometricOptics.register( 'RepresentationComboBox', RepresentationComboBox );
export default RepresentationComboBox;