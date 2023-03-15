// Copyright 2022-2023, University of Colorado Boulder

/**
 * GOToolKeyboardDragListener is the KeyboardDragListener for use with Geometric Optics tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import { KeyboardDragListener, KeyboardDragListenerOptions, KeyboardUtils } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import GOConstants from '../../GOConstants.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import GOToolNode from './GOToolNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOTool from '../../model/tools/GOTool.js';

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

    // Escape returns the tool to the toolbox.
    this.addHotkey( {
      keys: [ KeyboardUtils.KEY_ESCAPE ],
      callback: () => {
        phet.log && phet.log( 'hotkey ESCAPE' );
        returnToToolbox();
      }
    } );
    this.addHotkey( {
      keys: [ KeyboardUtils.KEY_J ],
      callback: () => {
        phet.log && phet.log( 'hotkey J' );
        toolNode.jumpToPoint();
      }
    } );
  }
}

geometricOptics.register( 'GOToolKeyboardDragListener', GOToolKeyboardDragListener );