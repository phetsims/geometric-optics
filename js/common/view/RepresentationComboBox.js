// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Representation from '../model/Representation.js';

class RepresentationComboBox extends Node {

  /**
   * @param {Property.<Representation>} selectedItemProperty
   * @param {Object} [options]
   */
  constructor( selectedItemProperty, options ) {

    options = merge( {
      hasLens: false
    }, options );

    super();

    // {ComboBoxItem} array to hold the combo box items
    const items = [];

    // iterate over the different representations
    Representation.VALUES.forEach( representation => {

      // the combo box should not include non-object for mirror screen
      if ( options.hasLens || representation.isObject ) {

        // create text
        const text = new Text( representation.label, {
          font: GeometricOpticsConstants.COMBO_BOX_FONT
        } );

        // create icon
        const icon = new Image( representation.icon, { scale: 0.075 } );

        // hold the logo followed by text in a hbox
        const hBox = new HBox( { spacing: 5, children: [ icon, text ] } );

        // create and add combo box item to the array
        items.push( new ComboBoxItem( hBox, representation ) );
      }
    } );

    // node to host the list of the combo box
    const listParent = new Node();

    // create the combo box
    const comboBox = new ComboBox( items, selectedItemProperty, listParent, {
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