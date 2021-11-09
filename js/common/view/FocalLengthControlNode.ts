// Copyright 2021, University of Colorado Boulder

/**
 * FocalLengthControlNode allows the user to select the method of controlling focal length.
 * It appears in the PhET > Options dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsGlobalOptions from '../GeometricOpticsGlobalOptions.js';
import FocalLengthControlEnum, { FocalLengthControlValues } from '../model/FocalLengthControlEnum.js';

class FocalLengthControlNode extends VBox {

  // Disposes of things that are specific to this class.
  private readonly disposeFocalLengthControlNode: () => void;

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TYPESCRIPT any

    options = merge( {

      // VBox options
      spacing: 8,
      align: 'left',

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const focalLengthControlText = new Text( geometricOpticsStrings.focalLengthControl, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'focalLengthControlText' )
    } );

    // We're using string values here because QueryStringMachine does not support enumerations.
    const radioButtonItems = [
      createItem( 'direct', geometricOpticsStrings.direct ),
      createItem( 'indirect', geometricOpticsStrings.indirect )
    ];

    // Verify that all of the values for ?focalLengthControl are represented here.
    assert && assert( FocalLengthControlValues.length === radioButtonItems.length );
    assert && assert( _.every( radioButtonItems, radioButtonItem => FocalLengthControlValues.includes( radioButtonItem.value ) ) );

    const radioButtonGroup = new VerticalAquaRadioButtonGroup<FocalLengthControlEnum>(
      // @ts-ignore TODO https://github.com/phetsims/sun/issues/728
      GeometricOpticsGlobalOptions.focalLengthControlProperty, radioButtonItems, {
        spacing: 8
      } );

    assert && assert( !options.children );
    options.children = [ focalLengthControlText, radioButtonGroup ];

    super( options );

    this.disposeFocalLengthControlNode = () => {
      focalLengthControlText.dispose();
      radioButtonGroup.dispose();
    };
  }

  /**
   * @override
   */
  public dispose() {
    this.disposeFocalLengthControlNode();
    super.dispose();
  }
}

/**
 * Creates an item for the radio button group.
 * @param {FocalLengthControlEnum} value
 * @param {string} text
 * @returns {{value: FocalLengthControlEnum, node: Text, tandemName: string}} item
 */
function createItem( value: FocalLengthControlEnum, text: string ) {
  return {
    value: value,
    node: new Text( text, {
      font: GeometricOpticsConstants.CONTROL_FONT,
      maxWidth: 100
    } ),
    tandemName: `${value}RadioButton`
  };
}

geometricOptics.register( 'FocalLengthControlNode', FocalLengthControlNode );
export default FocalLengthControlNode;