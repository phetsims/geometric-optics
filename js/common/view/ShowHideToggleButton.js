// Copyright 2021, University of Colorado Boulder

/**
 * Round eye toggle button that shows/hides the light rays and image. When on 'show', button is an open eye. On 'hide',
 * button is a closed eye.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import BooleanRoundToggleButton from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const BUTTON_RADIUS = GeometricOpticsConstants.BUTTON_RADIUS;

class ShowHideToggleButton extends BooleanRoundToggleButton {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [options]
   */
  constructor( visibleProperty, options ) {
    options = merge( {
      baseColor: 'yellow',
      xMargin: 9,
      yMargin: 9,
      radius: BUTTON_RADIUS,
      icon: {
        fill: 'black'
      }
    }, options );

    // create nodes for open and closed eye icons
    const showNode = new Path( eyeSolidShape, options.icon );
    const hideNode = new Path( eyeSlashSolidShape, options.icon );

    super( showNode, hideNode, visibleProperty, options );
  }
}

geometricOptics.register( 'ShowHideToggleButton', ShowHideToggleButton );
export default ShowHideToggleButton;