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
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

export default class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor( isLens: boolean ) {

    const leftColumn = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Ruler and Marker Controls
      new RulerAndMarkerControlsKeyboardHelpSection( isLens ),

      // Choose an Object
      new ComboBoxKeyboardHelpSection( {
        headingString: geometricOpticsStrings.keyboardHelpDialog.chooseAnObject,
        thingAsLowerCaseSingular: geometricOpticsStrings.keyboardHelpDialog.object,
        thingAsLowerCasePlural: geometricOpticsStrings.keyboardHelpDialog.objects
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
}

/**
 * MoveDraggableItemsKeyboardHelpSection is the keyboard-help section that describes the hotkeys supported
 * by KeyboardDragListener.
 */
class MoveDraggableItemsKeyboardHelpSection extends KeyboardHelpSection {

  constructor() {

    // arrows or WASD
    const normalRow = KeyboardHelpSection.labelWithIcon( geometricOpticsStrings.keyboardHelpDialog.move,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon() );

    // Shift+arrows or Shift+WASD
    const slowerRow = KeyboardHelpSection.labelWithIconList( geometricOpticsStrings.keyboardHelpDialog.moveSlower, [
      KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
      KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
    ] );

    super( geometricOpticsStrings.keyboardHelpDialog.moveDraggableItems, [ normalRow, slowerRow ] );
  }
}

/**
 * RulerAndMarkerControlsKeyboardHelpSection is the keyboard-help section that describes the hotkeys related to the tools.
 */
class RulerAndMarkerControlsKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param isLens
   */
  constructor( isLens: boolean ) {
    super( geometricOpticsStrings.keyboardHelpDialog.rulerAndMarkerControls, [

      // Space or Enter
      KeyboardHelpSection.labelWithIcon( geometricOpticsStrings.keyboardHelpDialog.removeFromToolbox,
        KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ) ),

      // Esc
      KeyboardHelpSection.labelWithIcon( geometricOpticsStrings.keyboardHelpDialog.returnToToolbox, TextKeyNode.esc() ),

      // J, for 'Jump'
      KeyboardHelpSection.createKeysRowFromStrings( [ 'J' ], geometricOpticsStrings.keyboardHelpDialog.jumpToPoint )
    ], {
      labelMaxWidth: 300
    } );
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );