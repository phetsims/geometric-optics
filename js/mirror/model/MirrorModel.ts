// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
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
  isBasicsVersion: boolean,
  tandem: Tandem
}

class MirrorModel extends GOModel {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: MirrorOptions ) {

    const options = merge( {

      // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
      opticalObjectChoices: [
        OpticalObjectChoice.PENCIL,
        OpticalObjectChoice.PENGUIN,
        OpticalObjectChoice.ARROW
      ],

      arrowObject1Position: new Vector2( -130, 60 ),
      arrowObject2Position: new Vector2( -145, 30 ),

      //TODO give FramedObject a bisector line so this isn't empirical
      // Initial position of the framed object, empirically set so that it appears to sit on the optical axis
      framedObjectPosition: new Vector2( -130, 72.5 )

    }, providedOptions );

    assert && assert( !options.opticalObjectChoices.includes( OpticalObjectChoice.LIGHT ),
      'Mirror screen does not support Light as an optical object choice' );

    // super is responsible for resetting the mirror
    const mirror = new Mirror( {
      isBasicsVersion: options.isBasicsVersion,
      tandem: options.tandem.createTandem( 'mirror' )
    } );

    super( mirror, options );
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;