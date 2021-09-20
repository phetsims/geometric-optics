// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

//TODO why doesn't this extend ComboBox?
class RepresentationComboBox extends Node {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Object} [options]
   */
  constructor( representationProperty, options ) {

    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( representationProperty.validValues );

    super( options );

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

    // node to host the list of the combo box
    const listParent = new Node();

    // create the combo box
    const comboBox = new ComboBox( items, representationProperty, listParent, {
      highlightFill: 'rgb(168,192,245)',
      listPosition: 'below',
      xMargin: 10,
      yMargin: 5
    } );

    // add the combox box before the list parent for z-layer
    this.addChild( comboBox );
    this.addChild( listParent );
  }
}

geometricOptics.register( 'RepresentationComboBox', RepresentationComboBox );
export default RepresentationComboBox;