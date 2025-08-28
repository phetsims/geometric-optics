// Copyright 2022-2025, University of Colorado Boulder

/**
 * GOToolKeyboardDragListener is the KeyboardDragListener for use with Geometric Optics tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import { EmptySelfOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import HotkeyData from '../../../../../scenery/js/input/HotkeyData.js';
import KeyboardDragListener, { KeyboardDragListenerOptions } from '../../../../../scenery/js/listeners/KeyboardDragListener.js';
import KeyboardListener from '../../../../../scenery/js/listeners/KeyboardListener.js';
import geometricOptics from '../../../geometricOptics.js';
import GeometricOpticsStrings from '../../../GeometricOpticsStrings.js';
import GOConstants from '../../GOConstants.js';
import GOTool from '../../model/tools/GOTool.js';
import GOToolNode from './GOToolNode.js';

type SelfOptions = EmptySelfOptions;

type GOToolKeyboardDragListenerOptions = SelfOptions & PickRequired<KeyboardDragListenerOptions, 'tandem'>;

export default class GOToolKeyboardDragListener extends KeyboardDragListener {

  /**
   * @param tool - model element
   * @param toolNode - view element
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param dragBoundsProperty - dragging is constrained to these bounds
   * @param shouldReturnToToolbox - determine whether the tool should be returned to the toolbox
   * @param providedOptions
   */
  public constructor( tool: GOTool,
                      toolNode: GOToolNode,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      dragBoundsProperty: TReadOnlyProperty<Bounds2>,
                      shouldReturnToToolbox: () => boolean,
                      providedOptions: GOToolKeyboardDragListenerOptions ) {

    // Return the tool to the toolbox, and move focus to its icon in the toolbox.
    const returnToToolbox = () => {
      tool.isInToolboxProperty.value = true;
      toolNode.icon.focus();
    };

    const options = optionize4<GOToolKeyboardDragListenerOptions, SelfOptions, KeyboardDragListenerOptions>()(
      {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {

        // KeyboardDragListenerOptions
        positionProperty: tool.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: zoomTransformProperty,
        start: () => toolNode.moveToFront(),
        end: () => {
          if ( shouldReturnToToolbox() ) {
            returnToToolbox();
          }
        }
      }, providedOptions );

    super( options );

    const hotkeyListener = new KeyboardListener( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [
        GOToolKeyboardDragListener.RETURN_TO_TOOLBOX_HOTKEY_DATA,
        GOToolKeyboardDragListener.JUMP_TO_POINT_HOTKEY_DATA
      ] ),
      fire: ( event, keysPressed ) => {
        if ( GOToolKeyboardDragListener.RETURN_TO_TOOLBOX_HOTKEY_DATA.hasKeyStroke( keysPressed ) ) {
          phet.log && phet.log( 'hotkey ESCAPE' );
          returnToToolbox();
        }
        else if ( GOToolKeyboardDragListener.JUMP_TO_POINT_HOTKEY_DATA.hasKeyStroke( keysPressed ) ) {
          phet.log && phet.log( 'hotkey J' );
          toolNode.jumpToPoint();
        }
      }
    } );
    toolNode.addInputListener( hotkeyListener );
  }

  public static readonly RETURN_TO_TOOLBOX_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'escape' ],
    repoName: geometricOptics.name,
    keyboardHelpDialogLabelStringProperty: GeometricOpticsStrings.keyboardHelpDialog.returnToToolboxStringProperty
  } );

  public static readonly JUMP_TO_POINT_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'j' ],
    repoName: geometricOptics.name,
    keyboardHelpDialogLabelStringProperty: GeometricOpticsStrings.keyboardHelpDialog.jumpToPointStringProperty
  } );
}

geometricOptics.register( 'GOToolKeyboardDragListener', GOToolKeyboardDragListener );