// Copyright 2023-2024, University of Colorado Boulder

/**
 * RulerAndMarkerControlsSection is the keyboard-help section that describes the hotkeys related to the tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GOToolKeyboardDragListener from './tools/GOToolKeyboardDragListener.js';

export class RulerAndMarkerControlsSection extends KeyboardHelpSection {

  public constructor() {

    // Keys used in this KeyboardHelpSection. They need to be disposed.
    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const spaceOrEnterKeyNode = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );

    // Rows that make up this KeyboardHelpSection. They need to be disposed.
    const rows = [

      // Space or Enter
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.removeFromToolboxStringProperty,
        spaceOrEnterKeyNode ),

      // Esc
      KeyboardHelpSectionRow.fromHotkeyData( GOToolKeyboardDragListener.RETURN_TO_TOOLBOX_HOTKEY_DATA ),

      // J, for 'Jump'
      KeyboardHelpSectionRow.fromHotkeyData( GOToolKeyboardDragListener.JUMP_TO_POINT_HOTKEY_DATA )
    ];

    super( GeometricOpticsStrings.keyboardHelpDialog.rulerAndMarkerControlsStringProperty, rows, {
      textMaxWidth: 300,
      isDisposable: false // See https://github.com/phetsims/geometric-optics/issues/483
    } );
  }
}