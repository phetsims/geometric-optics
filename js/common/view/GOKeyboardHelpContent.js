// Copyright 2021, University of Colorado Boulder

/**
 * GOKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MoveKeyboardHelpSection from '../../common/view/MoveKeyboardHelpSection.js';
import geometricOptics from '../../geometricOptics.js';

class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      labelMaxWidth: 250,
      generalSectionOptions: {
        withCheckboxContent: true
      }
    }, options );

    const moveHelpSection = new MoveKeyboardHelpSection();
    const sliderHelpSection = new SliderControlsKeyboardHelpSection( options.sliderSectionOptions );
    const generalNavigationHelpSection = new BasicActionsKeyboardHelpSection( options.generalSectionOptions );

    super( [ moveHelpSection ], [ sliderHelpSection, generalNavigationHelpSection ], options );
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );
export default GOKeyboardHelpContent;