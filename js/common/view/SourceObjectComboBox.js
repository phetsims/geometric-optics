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
import SourceObjectRepresentation from '../model/SourceObjectRepresentation.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';

class SourceObjectComboBox extends Node {

  /**
   * @param {EnumerationProperty.<SourceObjectRepresentation>} selectedItemProperty
   * @param {Tandem} tandem
   */
  constructor( selectedItemProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    const items = [];

    SourceObjectRepresentation.VALUES.forEach( representation => {
      const text = new Text( representation.label, { font: new PhetFont( { size: 20 } ) } );
      const logo = new Image( representation.logo, { scale: 0.05 } );
      const hBox = new HBox( { children: [ logo, text ] } );
      items.push( new ComboBoxItem( hBox, representation ) );
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
