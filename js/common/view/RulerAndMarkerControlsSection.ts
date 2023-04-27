// Copyright 2023, University of Colorado Boulder

/**
 * RulerAndMarkerControlsSection is the keyboard-help section that describes the hotkeys related to the tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';

export class RulerAndMarkerControlsSection extends KeyboardHelpSection {

  private readonly disposeRulerAndMarkerControlsSection: () => void;

  public constructor() {

    // Keys used in this KeyboardHelpSection. They need to be disposed.
    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
    const escapeKeyNode = TextKeyNode.esc();
    const spaceOrEnterKeyNode = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
    const keyNodes = [ spaceKeyNode, enterKeyNode, escapeKeyNode, spaceOrEnterKeyNode ];

    // Rows that make up this KeyboardHelpSection. They need to be disposed.
    const rows = [

      // Space or Enter
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.removeFromToolboxStringProperty,
        spaceOrEnterKeyNode ),

      // Esc
      KeyboardHelpSectionRow.labelWithIcon( GeometricOpticsStrings.keyboardHelpDialog.returnToToolboxStringProperty, escapeKeyNode ),

      // J, for 'Jump'
      KeyboardHelpSectionRow.createKeysRowFromStrings( [ 'J' ], GeometricOpticsStrings.keyboardHelpDialog.jumpToPointStringProperty )
    ];

    super( GeometricOpticsStrings.keyboardHelpDialog.rulerAndMarkerControlsStringProperty, rows, {
      textMaxWidth: 300
    } );

    this.disposeRulerAndMarkerControlsSection = () => {
      keyNodes.forEach( keyNode => keyNode.dispose() );
      rows.forEach( row => row.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeRulerAndMarkerControlsSection();
    super.dispose();
  }
}