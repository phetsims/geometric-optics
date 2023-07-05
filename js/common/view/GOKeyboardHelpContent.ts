// Copyright 2021-2023, University of Colorado Boulder

/**
 * GOKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import { RulerAndMarkerControlsSection } from './RulerAndMarkerControlsSection.js';

export default class GOKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Ruler and Marker Controls
      new RulerAndMarkerControlsSection(),

      // Choose an Object
      new ComboBoxKeyboardHelpSection( {
        headingString: GeometricOpticsStrings.keyboardHelpDialog.chooseAnObjectStringProperty,
        thingAsLowerCaseSingular: GeometricOpticsStrings.keyboardHelpDialog.objectStringProperty,
        thingAsLowerCasePlural: GeometricOpticsStrings.keyboardHelpDialog.objectsStringProperty
      } )
    ];

    // Sections in the right column.
    const rightSections = [

      // Slider Controls
      new SliderControlsKeyboardHelpSection(),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false // See https://github.com/phetsims/geometric-optics/issues/483
    } );
  }
}

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );