// Copyright 2021-2022, University of Colorado Boulder

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
import eyeSolidString from '../../../../sherpa/js/fontawesome-5/eyeSolidString.js';
import BooleanRoundToggleButton from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

const TRUE_COLOR = 'rgb( 240, 234, 227 )';
const FALSE_COLOR = PhetColorScheme.BUTTON_YELLOW;

type Options = {
  tandem: Tandem
};

class ShowHideToggleButton extends BooleanRoundToggleButton {

  /**
   * @param booleanProperty
   * @param providedOptions
   */
  constructor( booleanProperty: Property<boolean>, providedOptions: Options ) {

    // create nodes for open and closed eye icons
    const pathOptions = { fill: 'black' };
    const showNode = new Path( eyeSolidString, pathOptions );
    const hideNode = new Path( eyeSlashSolidShape, pathOptions );

    super( showNode, hideNode, booleanProperty, merge( {
      xMargin: 9,
      yMargin: 9,
      radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS // so that this button will be the same size as ResetAllButton
    }, providedOptions ) );

    booleanProperty.link( value => {
      this.setBaseColor( value ? TRUE_COLOR : FALSE_COLOR );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ShowHideToggleButton', ShowHideToggleButton );
export default ShowHideToggleButton;