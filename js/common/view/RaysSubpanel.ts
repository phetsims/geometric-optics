// Copyright 2022-2023, University of Colorado Boulder

/**
 * RaysSubpanel is a subpanel of the main control panel. It has a 'Rays' title above a set of vertical radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GOConstants from '../GOConstants.js';
import { RaysType } from '../model/RaysType.js';
import RaysRadioButtonGroup from './RaysRadioButtonGroup.js';

export default class RaysSubpanel extends VBox {

  /**
   * @param raysTypeProperty - representation used for rays
   * @param tandem
   */
  public constructor( raysTypeProperty: Property<RaysType>, tandem: Tandem ) {

    // title
    const titleText = new Text( GeometricOpticsStrings.raysStringProperty, {
      font: GOConstants.TITLE_FONT,
      maxWidth: 90,
      tandem: tandem.createTandem( 'titleText' )
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
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      tandem: tandem
    } );
  }
}

geometricOptics.register( 'RaysSubpanel', RaysSubpanel );