// Copyright 2021, University of Colorado Boulder

/**
 * Round eye toggle button that shows/hides the light rays and image. When on 'show', button is an open eye. On 'hide', button is
 * a closed eye.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import BooleanRoundToggleButton from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import geometricOptics from '../../geometricOptics.js';

class ShowHideToggleButton extends BooleanRoundToggleButton {
  /**
   *
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [options]
   */
  constructor( visibleProperty, options ) {
    options = merge( {
      baseColor: 'yellow',
      xMargin: 5,
      yMargin: 5,
      radius: 22
    }, options );

    // create nodes for open and closed eye icons
    const showNode = new FontAwesomeNode( 'eye_open' );
    const hideNode = new FontAwesomeNode( 'eye_close' );

    super( showNode, hideNode, visibleProperty, options );
  }
}

geometricOptics.register( 'ShowHideToggleButton', ShowHideToggleButton );
export default ShowHideToggleButton;