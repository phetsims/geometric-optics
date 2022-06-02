// Copyright 2022, University of Colorado Boulder

/**
 * RaysSubpanel is a subpanel of the main control panel. It has a 'Rays' title above a set of vertical radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import IProperty from '../../../../axon/js/IProperty.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import { RaysType } from '../model/RaysType.js';
import RaysRadioButtonGroup from './RaysRadioButtonGroup.js';

export default class RaysSubpanel extends VBox {

  /**
   * @param raysTypeProperty - representation used for rays
   * @param tandem
   */
  public constructor( raysTypeProperty: IProperty<RaysType>, tandem: Tandem ) {

    // title
    const titleText = new Text( geometricOpticsStrings.rays, {
      font: GOConstants.TITLE_FONT,
      maxWidth: 90,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // radio buttons
    const raysRadioButtonGroup = new RaysRadioButtonGroup( raysTypeProperty, {
      tandem: tandem.createTandem( 'raysRadioButtonGroup' )
    } );

    // title + radio buttons
    super( {

      // VBox options
      children: [ titleText, raysRadioButtonGroup ],
      align: 'left',
      spacing: 4,
      tandem: tandem
    } );
  }
}

geometricOptics.register( 'RaysSubpanel', RaysSubpanel );