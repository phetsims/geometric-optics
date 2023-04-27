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

  private readonly disposeGOKeyboardHelpContent: () => void;

  public constructor() {

    // Sections in the left column. They need to be disposed.
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

geometricOptics.register( 'GOKeyboardHelpContent', GOKeyboardHelpContent );