// Copyright 2021, University of Colorado Boulder

/**
 * GOKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MoveKeyboardHelpSection from '../../common/view/MoveKeyboardHelpSection.js';
import geometricOptics from '../../geometricOptics.js';

class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    const leftColumn = [
      new MoveKeyboardHelpSection()
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

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );
export default GOKeyboardHelpContent;