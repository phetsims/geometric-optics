// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import SourceObjectTypes from '../model/SourceObjectTypes.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';

class SourceObjectComboBox extends Node {

  /**
   * @param {EnumerationProperty.<SourceObjectTypes>} selectedItemProperty
   * @param {Tandem} tandem
   */
  constructor( selectedItemProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    const items = [];

    SourceObjectTypes.VALUES.forEach( type => {
      const text = new Text( type.label, { font: new PhetFont( { size: 20 } ) } );
      const logo = new Image( type.logo, { scale: 0.05 } );
      const hbox = new HBox( { children: [ logo, text ] } );
      items.push( new ComboBoxItem( hbox, type ) );
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

geometricOptics.register( 'SourceObjectComboBox', SourceObjectComboBox );
export default SourceObjectComboBox;
