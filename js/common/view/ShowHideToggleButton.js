// Copyright 2021, University of Colorado Boulder

/**
 * Round eye toggle button that shows/hides the light rays and image. When on 'show', button is an open eye. On 'hide',
 * button is a closed eye.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import BooleanRoundToggleButton from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class ShowHideToggleButton extends BooleanRoundToggleButton {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [options]
   */
  constructor( visibleProperty, options ) {

    options = merge( {
      trueColor: 'rgb( 240, 234, 227 )', // {Color|string} button color when visibleProperty.value === true
      falseColor: PhetColorScheme.BUTTON_YELLOW,  // {Color|string} button color when visibleProperty.value === false

      // BooleanRoundToggleButton options
      xMargin: 9,
      yMargin: 9,
      radius: GeometricOpticsConstants.BUTTON_RADIUS,

      // Path options for the button icons
      icon: {
        fill: 'black'
      }
    }, options );
    assert && assert( !options.baseColor, 'ShowHideToggleButton controls baseColor' );

    // create nodes for open and closed eye icons
    const showNode = new Path( eyeSolidShape, options.icon );
    const hideNode = new Path( eyeSlashSolidShape, options.icon );

    super( showNode, hideNode, visibleProperty, options );

    visibleProperty.link( visible => {
      this.setBaseColor( visible ? options.trueColor : options.falseColor );
    } );
  }
}

geometricOptics.register( 'ShowHideToggleButton', ShowHideToggleButton );
export default ShowHideToggleButton;