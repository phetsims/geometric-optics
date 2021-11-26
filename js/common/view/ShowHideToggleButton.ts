// Copyright 2021, University of Colorado Boulder

/**
 * Round eye toggle button that shows/hides the light rays and image. When on 'show', button is an open eye. On 'hide',
 * button is a closed eye.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import { Path } from '../../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import BooleanRoundToggleButton from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import geometricOptics from '../../geometricOptics.js';

class ShowHideToggleButton extends BooleanRoundToggleButton {

  /**
   * @param booleanProperty
   * @param options
   */
  constructor( booleanProperty: Property<boolean>, options?: any ) { //TYPESCRIPT any

    options = merge( {
      trueColor: 'rgb( 240, 234, 227 )', // {Color|string} button color when booleanProperty.value === true
      falseColor: PhetColorScheme.BUTTON_YELLOW,  // {Color|string} button color when booleanProperty.value === false

      // BooleanRoundToggleButton options
      xMargin: 9,
      yMargin: 9,
      radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS, // so that this button will be the same size as ResetAllButton

      // Path options for the button icons
      icon: {
        fill: 'black'
      }
    }, options );
    assert && assert( !options.baseColor, 'ShowHideToggleButton controls baseColor' );

    // create nodes for open and closed eye icons
    const showNode = new Path( eyeSolidShape, options.icon );
    const hideNode = new Path( eyeSlashSolidShape, options.icon );

    super( showNode, hideNode, booleanProperty, options );

    booleanProperty.link( value => {
      this.setBaseColor( value ? options.trueColor : options.falseColor );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ShowHideToggleButton', ShowHideToggleButton );
export default ShowHideToggleButton;