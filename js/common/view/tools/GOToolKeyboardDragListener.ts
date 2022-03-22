// Copyright 2022, University of Colorado Boulder

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
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import optionize, { OptionizeDefaults } from '../../../../../phet-core/js/optionize.js';
import GOToolNode from './GOToolNode.js';
import merge from '../../../../../phet-core/js/merge.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOTool from '../../model/tools/GOTool.js';

type GOToolKeyboardDragListenerOptions = PickRequired<KeyboardDragListenerOptions, 'tandem'>;

class GOToolKeyboardDragListener extends KeyboardDragListener {

  /**
   * @param tool
   * @param toolNode
   * @param zoomTransformProperty
   * @param dragBoundsProperty
   * @param shouldReturnToToolbox - determine whether the tool should be returned to the toolbox
   * @param providedOptions
   */
  constructor( tool: GOTool,
               toolNode: GOToolNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               dragBoundsProperty: IReadOnlyProperty<Bounds2>,
               shouldReturnToToolbox: () => boolean,
               providedOptions?: GOToolKeyboardDragListenerOptions ) {

    // Return the tool to the toolbox, and move focus to its icon in the toolbox.
    const returnToToolbox = () => {
      tool.isInToolboxProperty.value = true;
      toolNode.icon.focus();
    };

    const keyboardDragListenerDefaults: OptionizeDefaults<{}, KeyboardDragListenerOptions> =
      merge( {}, GOConstants.KEYBOARD_DRAG_LISTENER_OPTIONS, {
        positionProperty: tool.positionProperty,
        dragBoundsProperty: dragBoundsProperty,
        transform: zoomTransformProperty.value,
        start: () => toolNode.moveToFront(),
        end: () => {
          if ( shouldReturnToToolbox() ) {
            returnToToolbox();
          }
        }
      } );

    const options = optionize<KeyboardDragListenerOptions, {}, KeyboardDragListenerOptions>(
      {}, keyboardDragListenerDefaults, providedOptions );

    super( options );

    // When the transform changes, update this listener.
    zoomTransformProperty.link( zoomTransform => {
      this.transform = zoomTransform;
    } );

    // Escape returns the tool to the toolbox.
    this.addHotkey( {
      keys: [ KeyboardUtils.KEY_ESCAPE ],
      callback: () => {
        phet.log && phet.log( 'hotkey ESCAPE' );
        returnToToolbox();
      }
    } );
    this.addHotkey( {
      keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_P ],
      callback: () => {
        phet.log && phet.log( 'hotkey J+P' );
        toolNode.jumpToPoint();
      }
    } );
  }
}

geometricOptics.register( 'GOToolKeyboardDragListener', GOToolKeyboardDragListener );
export default GOToolKeyboardDragListener;