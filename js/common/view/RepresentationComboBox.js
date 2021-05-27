// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Representation from '../model/Representation.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';

class RepresentationComboBox extends Node {

  /**
   * @param {EnumerationProperty.<Representation>} selectedItemProperty
   * @param {Tandem} tandem
   * @param {Object} config
   */
  constructor( selectedItemProperty, tandem, config ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    config = merge( {
      hasLens: false
    }, config );

    super();

    const items = [];

    Representation.VALUES.forEach( representation => {

      // the combo box should not include non-object for mirror screen
      if ( config.hasLens || representation.isObject ) {
        const text = new Text( representation.label, { font: new PhetFont( { size: 20 } ) } );
        const logo = new Image( representation.logo, { scale: 0.05 } );
        const hBox = new HBox( { children: [ logo, text ] } );
        items.push( new ComboBoxItem( hBox, representation ) );
      }
    } );

    const listParent = new Node();

    const comboBox = new ComboBox( items, selectedItemProperty, listParent, {
      highlightFill: 'yellow',
      listPosition: 'below'
    } );

    this.addChild( comboBox );
    this.addChild( listParent );
  }
}

geometricOptics.register( 'RepresentationComboBox', RepresentationComboBox );
export default RepresentationComboBox;
