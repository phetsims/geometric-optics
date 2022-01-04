// Copyright 2021, University of Colorado Boulder

/**
 * GOKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MoveKeyboardHelpSection from '../../common/view/MoveKeyboardHelpSection.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    const leftColumn = [
      new MoveKeyboardHelpSection(),
      new RulersKeyboardHelpSection()
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

class RulersKeyboardHelpSection extends KeyboardHelpSection {

  constructor() {
    super( geometricOpticsStrings.keyboardHelpDialog.rulerControls, [
      //TODO Remove from toolbox [Space]
      //TODO Return to toolbox [Esc]
      KeyboardHelpSection.createJumpKeyRow( 'L', geometricOpticsStrings.keyboardHelpDialog.jumpToLens, '' ), //TODO different for Mirror screen
      KeyboardHelpSection.createJumpKeyRow( 'O', geometricOpticsStrings.keyboardHelpDialog.jumpToObject, '' ),
      KeyboardHelpSection.createJumpKeyRow( 'S', geometricOpticsStrings.keyboardHelpDialog.jumpToSecondLightSource, '' ),
      KeyboardHelpSection.createJumpKeyRow( 'I', geometricOpticsStrings.keyboardHelpDialog.jumpToImage, '' )
    ] );
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );
export default GOKeyboardHelpContent;