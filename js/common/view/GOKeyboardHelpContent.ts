// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';

export default class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    const leftColumn = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Ruler and Marker Controls
      new RulerAndMarkerControlsKeyboardHelpSection(),

      // Choose an Object
      new ComboBoxKeyboardHelpSection( {
        headingString: GeometricOpticsStrings.keyboardHelpDialog.chooseAnObjectStringProperty,
        thingAsLowerCaseSingular: GeometricOpticsStrings.keyboardHelpDialog.objectStringProperty,
        thingAsLowerCasePlural: GeometricOpticsStrings.keyboardHelpDialog.objectsStringProperty
      } )
    ];

    const rightColumn = [

      // Slider Controls
      new SliderControlsKeyboardHelpSection(),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftColumn, rightColumn );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes the hotkeys supported
 * by KeyboardDragListener.
 */
class MoveDraggableItemsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    // arrows or WASD
    const normalRow = KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.moveStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon() );

    // Shift+arrows or Shift+WASD
    const slowerRow = KeyboardHelpSectionRow.labelWithIconList( GeometricOpticsStrings.keyboardHelpDialog.moveSlowerStringProperty, [
      KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
      KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
    ] );

    super( GeometricOpticsStrings.keyboardHelpDialog.moveDraggableItemsStringProperty, [ normalRow, slowerRow ] );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * RulerAndMarkerControlsKeyboardHelpSection is the keyboard-help section that describes the hotkeys related to the tools.
 */
class RulerAndMarkerControlsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {
    super( GeometricOpticsStrings.keyboardHelpDialog.rulerAndMarkerControlsStringProperty, [

      // Space or Enter
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.removeFromToolboxStringProperty,
        KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ) ),

      // Esc
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.returnToToolboxStringProperty, TextKeyNode.esc() ),

      // J, for 'Jump'
      KeyboardHelpSectionRow.createKeysRowFromStrings( [ 'J' ], GeometricOpticsStrings.keyboardHelpDialog.jumpToPointStringProperty )
    ], {
      textMaxWidth: 300
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );