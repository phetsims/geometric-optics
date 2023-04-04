// Copyright 2021-2023, University of Colorado Boulder

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

  private readonly disposeGOKeyboardHelpContent: () => void;

  public constructor() {

    // Sections in the left column. They need to be disposed.
    const leftSections = [

      // Move Draggable Items
      new MoveDraggableItemsSection(),

      // Ruler and Marker Controls
      new RulerAndMarkerControlsSection(),

      // Choose an Object
      new ComboBoxKeyboardHelpSection( {
        headingString: GeometricOpticsStrings.keyboardHelpDialog.chooseAnObjectStringProperty,
        thingAsLowerCaseSingular: GeometricOpticsStrings.keyboardHelpDialog.objectStringProperty,
        thingAsLowerCasePlural: GeometricOpticsStrings.keyboardHelpDialog.objectsStringProperty
      } )
    ];

    // Sections in the right column. They need to be disposed.
    const rightSections = [

      // Slider Controls
      new SliderControlsKeyboardHelpSection(),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections );

    this.disposeGOKeyboardHelpContent = () => {
      leftSections.forEach( section => section.dispose() );
      rightSections.forEach( section => section.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeGOKeyboardHelpContent();
    super.dispose();
  }
}

/**
 * MoveDraggableItemsSection is the keyboard-help section that describes the hotkeys supported by KeyboardDragListener.
 */
class MoveDraggableItemsSection extends KeyboardHelpSection {

  private readonly disposeMoveDraggableItemsSection: () => void;

  public constructor() {

    // Icons used in this KeyboardHelpSection. They will need to be disposed.
    const arrowOrWasdKeysRowIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const arrowKeysRowIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const shiftPlusArrowKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysRowIcon );
    const wasdRowIcon = KeyboardHelpIconFactory.wasdRowIcon();
    const shiftPlusWASDIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdRowIcon );
    const icons = [ arrowOrWasdKeysRowIcon, arrowKeysRowIcon, shiftPlusArrowKeysIcon, wasdRowIcon, shiftPlusWASDIcon ];

    // Rows that make up this KeyboardHelpSection. They need to be disposed.
    const rows = [

      // arrows or WASD
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.moveStringProperty,
        arrowOrWasdKeysRowIcon ),

      // Shift+arrows or Shift+WASD
      KeyboardHelpSectionRow.labelWithIconList( GeometricOpticsStrings.keyboardHelpDialog.moveSlowerStringProperty, [
        shiftPlusArrowKeysIcon,
        shiftPlusWASDIcon
      ] )
    ];

    super( GeometricOpticsStrings.keyboardHelpDialog.moveDraggableItemsStringProperty, rows );

    this.disposeMoveDraggableItemsSection = () => {
      icons.forEach( icon => icon.dispose() );
      rows.forEach( row => row.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeMoveDraggableItemsSection();
    super.dispose();
  }
}

/**
 * RulerAndMarkerControlsSection is the keyboard-help section that describes the hotkeys related to the tools.
 */
class RulerAndMarkerControlsSection extends KeyboardHelpSection {

  private readonly disposeRulerAndMarkerControlsSection: () => void;

  public constructor() {

    // Keys used in this KeyboardHelpSection. They need to be disposed.
    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const escapeKeyNode = TextKeyNode.esc();
    const spaceOrEnterKeyNode = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
    const keyNodes = [ spaceKeyNode, enterKeyNode, escapeKeyNode, spaceOrEnterKeyNode ];

    // Rows that make up this KeyboardHelpSection. They need to be disposed.
    const rows = [

      // Space or Enter
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.removeFromToolboxStringProperty,
        spaceOrEnterKeyNode ),

      // Esc
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.returnToToolboxStringProperty, escapeKeyNode ),

      // J, for 'Jump'
      KeyboardHelpSectionRow.createKeysRowFromStrings( [ 'J' ], GeometricOpticsStrings.keyboardHelpDialog.jumpToPointStringProperty )
    ];

    super( GeometricOpticsStrings.keyboardHelpDialog.rulerAndMarkerControlsStringProperty, rows, {
      textMaxWidth: 300
    } );

    this.disposeRulerAndMarkerControlsSection = () => {
      keyNodes.forEach( keyNode => keyNode.dispose() );
      rows.forEach( row => row.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeRulerAndMarkerControlsSection();
    super.dispose();
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );