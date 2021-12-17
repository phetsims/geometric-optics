// Copyright 2021, University of Colorado Boulder

/**
 * MirrorKeyboardHelpContent is the content for the keyboard-help dialog in the 'Mirror' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import geometricOptics from '../../geometricOptics.js';

class MirrorKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

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

    const sliderHelpSection = new SliderControlsKeyboardHelpSection( options.sliderSectionOptions );
    const generalNavigationHelpSection = new BasicActionsKeyboardHelpSection( options.generalSectionOptions );

    super( [ sliderHelpSection ], [ generalNavigationHelpSection ], options );
  }
}

geometricOptics.register( 'MirrorKeyboardHelpContent', MirrorKeyboardHelpContent );
export default MirrorKeyboardHelpContent;