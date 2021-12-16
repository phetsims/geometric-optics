// Copyright 2021, University of Colorado Boulder

/**
 * MirrorKeyboardHelpContent is the content for the keyboard-help dialog in the 'Mirror' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderKeyboardHelpSection.js';
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

    const sliderHelpSection = new SliderKeyboardHelpSection( options.sliderSectionOptions );
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection( options.generalSectionOptions );

    super( [ sliderHelpSection ], [ generalNavigationHelpSection ], options );
  }
}

geometricOptics.register( 'MirrorKeyboardHelpContent', MirrorKeyboardHelpContent );
export default MirrorKeyboardHelpContent;