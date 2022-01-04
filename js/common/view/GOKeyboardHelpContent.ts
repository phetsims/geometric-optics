// Copyright 2021, University of Colorado Boulder

/**
 * GOKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor( isLens: boolean ) {

    const leftColumn = [
      new MoveKeyboardHelpSection(),
      new RulersKeyboardHelpSection( isLens )
    ];

    const rightColumn = [
      new SliderControlsKeyboardHelpSection(),
      new BasicActionsKeyboardHelpSection( {
          withCheckboxContent: true
        }
      )
    ];

    super( leftColumn, rightColumn );
  }
}

/**
 * MoveKeyboardHelpSection is the keyboard-help section that describes the hotkeys supported by KeyboardDragListener.
 */
class MoveKeyboardHelpSection extends KeyboardHelpSection {

  constructor() {

    // {HelpSectionRow} First row, for normal motion
    const normalRow = KeyboardHelpSection.labelWithIcon( geometricOpticsStrings.keyboardHelpDialog.move,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(),
      geometricOpticsStrings.a11y.keyboardHelpDialog.moveDescription
    );

    // {HelpSectionRow} Second row, for slower motion
    const slowerRow = KeyboardHelpSection.labelWithIconList( geometricOpticsStrings.keyboardHelpDialog.moveSlower,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
      ],
      geometricOpticsStrings.a11y.keyboardHelpDialog.moveSlowerDescription
    );

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

    const jumpToOpticRow = isLens ?
                           KeyboardHelpSection.createJumpKeyRow( 'L', geometricOpticsStrings.keyboardHelpDialog.jumpToLens, '' ) :
                           KeyboardHelpSection.createJumpKeyRow( 'M', geometricOpticsStrings.keyboardHelpDialog.jumpToMirror, '' );

    super( geometricOpticsStrings.keyboardHelpDialog.rulerControls, [
      //TODO Remove from toolbox [Space]
      //TODO Return to toolbox [Esc]
      jumpToOpticRow,
      KeyboardHelpSection.createJumpKeyRow( 'O', geometricOpticsStrings.keyboardHelpDialog.jumpToObject, '' ),
      KeyboardHelpSection.createJumpKeyRow( 'S', geometricOpticsStrings.keyboardHelpDialog.jumpToSecondLightSource, '' ),
      KeyboardHelpSection.createJumpKeyRow( 'I', geometricOpticsStrings.keyboardHelpDialog.jumpToImage, '' )
    ] );
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );
export default GOKeyboardHelpContent;