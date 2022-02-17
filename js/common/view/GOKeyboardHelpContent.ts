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

class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor( isLens: boolean ) {

    const leftColumn = [
      new MoveKeyboardHelpSection(),
      new RulersKeyboardHelpSection( isLens ),
      new ComboBoxKeyboardHelpSection( {
        headingString: geometricOpticsStrings.keyboardHelpDialog.chooseAnObject,
        thingAsLowerCaseSingular: geometricOpticsStrings.keyboardHelpDialog.object,
        thingAsLowerCasePlural: geometricOpticsStrings.keyboardHelpDialog.objects
      } )
    ];

    const rightColumn = [
      new SliderControlsKeyboardHelpSection(),
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftColumn, rightColumn );
  }
}

/**
 * MoveKeyboardHelpSection is the keyboard-help section that describes the hotkeys supported by KeyboardDragListener.
 */
class MoveKeyboardHelpSection extends KeyboardHelpSection {

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
 * RulersKeyboardHelpSection is the keyboard-help section that describes the hotkeys related to the rulers.
 */
class RulersKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param isLens
   */
  constructor( isLens: boolean ) {
    super( geometricOpticsStrings.keyboardHelpDialog.rulerControls, [

      // Space or Enter
      KeyboardHelpSection.labelWithIcon( geometricOpticsStrings.keyboardHelpDialog.removeFromToolbox,
        KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() ) ),

      // Esc
      KeyboardHelpSection.labelWithIcon( geometricOpticsStrings.keyboardHelpDialog.returnToToolbox, TextKeyNode.esc() ),

      // J+R
      KeyboardHelpSection.createJumpKeyRow( 'R', geometricOpticsStrings.keyboardHelpDialog.jumpRuler )
    ], {
      labelMaxWidth: 300
    } );
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );
export default GOKeyboardHelpContent;