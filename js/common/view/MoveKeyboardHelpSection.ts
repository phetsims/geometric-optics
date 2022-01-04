// Copyright 2021, University of Colorado Boulder

//TODO generalize and move to scenery/js/keyboard/help/
/**
 * MoveKeyboardHelpSection is a keyboard-help section that describes the hotkeys supported by KeyboardDragListener.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

type MoveKeyboardHelpSectionOptions = {
  title?: string,
  normalLabel?: string,
  normalDescription?: string,
  slowerLabel?: string,
  slowerDescription?: string
};

class MoveKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param providedOptions
   */
  constructor( providedOptions?: MoveKeyboardHelpSectionOptions ) {

    const options = merge( {
      title: geometricOpticsStrings.keyboardHelpDialog.moveDraggableItems,
      normalLabel: geometricOpticsStrings.keyboardHelpDialog.move,
      normalDescription: geometricOpticsStrings.a11y.keyboardHelpDialog.moveDescription,
      slowerLabel: geometricOpticsStrings.keyboardHelpDialog.moveSlower,
      slowerDescription: geometricOpticsStrings.a11y.keyboardHelpDialog.moveSlowerDescription
    }, providedOptions ) as Required<MoveKeyboardHelpSectionOptions>;

    // {HelpSectionRow} First row, for normal motion
    const normalRow = KeyboardHelpSection.labelWithIcon( options.normalLabel,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(),
      options.normalDescription
    );

    // {HelpSectionRow} Second row, for slower motion
    const slowerRow = KeyboardHelpSection.labelWithIconList( options.slowerLabel,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
      ],
      options.slowerDescription
    );

    super( options.title, [ normalRow, slowerRow ], options );
  }
}

geometricOptics.register( 'MoveKeyboardHelpSection', MoveKeyboardHelpSection );
export default MoveKeyboardHelpSection;