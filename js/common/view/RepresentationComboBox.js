// Copyright 2021, University of Colorado Boulder

/**
 * RepresentationComboBox is the combo box for selecting the object representation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class RepresentationComboBox extends ComboBox {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Node} listboxParent
   * @param {Object} [options]
   */
  constructor( representationProperty, listboxParent, options ) {

    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( representationProperty.validValues );

    options = merge( {

      // ComboBox options
      highlightFill: 'rgb(168,192,245)',
      listPosition: 'below',
      xMargin: 10,
      yMargin: 5
    }, options );

    // Create a ComboBoxItem for each representation.
    const items = [];
    representationProperty.validValues.forEach( representation => {

      // create text
      const text = new Text( representation.label, {
        font: GeometricOpticsConstants.CONTROL_FONT
      } );

      // create icon
      const icon = new Image( representation.icon, { scale: 0.075 } );

      // hold the logo followed by text in a hbox
      const hBox = new HBox( { spacing: 5, children: [ icon, text ] } );

      // create and add combo box item to the array
      items.push( new ComboBoxItem( hBox, representation ) );
    } );

    super( items, representationProperty, listboxParent, options );
  }
}

geometricOptics.register( 'RepresentationComboBox', RepresentationComboBox );
export default RepresentationComboBox;