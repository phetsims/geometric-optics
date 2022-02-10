// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOModel from '../../common/model/GOModel.js';
import geometricOptics from '../../geometricOptics.js';
import Mirror from './Mirror.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';

type MirrorOptions = {
  tandem: Tandem
}

class MirrorModel extends GOModel {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: MirrorOptions ) {

    const options = merge( {

      //TODO give FramedObject a bisector line so this isn't empirical
      // Initial position of the framed object, empirically set so that the optical axis goes through its center.
      framedObjectPosition: new Vector2( -170, 72.5 ),

      arrowObject1Position: new Vector2( -150, 50 ),
      arrowObject2Position: new Vector2( -150, -50 ),

      // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
      opticalObjectChoices: [
        OpticalObjectChoice.ARROW,
        OpticalObjectChoice.PENCIL,
        OpticalObjectChoice.PENGUIN,
        OpticalObjectChoice.PLANET,
        OpticalObjectChoice.STAR
      ]
    }, providedOptions );

    // super is responsible for resetting the mirror
    const mirror = new Mirror( {
      tandem: options.tandem.createTandem( 'mirror' )
    } );

    super( mirror, options );

    assert && assert( !this.opticalObjectChoiceProperty.validValues?.includes( OpticalObjectChoice.LIGHT ),
      'Mirror screen does not support Light as an optical object choice' );
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;