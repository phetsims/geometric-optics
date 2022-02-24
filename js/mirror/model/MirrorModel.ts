// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import GOModel, { GOModelOptions } from '../../common/model/GOModel.js';
import geometricOptics from '../../geometricOptics.js';
import Mirror from './Mirror.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';
import { PickRequired } from '../../common/GOTypes.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  isBasicsVersion?: boolean
};

type MirrorModelOptions = SelfOptions & PickRequired<GOModelOptions, 'tandem'>;

class MirrorModel extends GOModel {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: MirrorModelOptions ) {

    const options = optionize<MirrorModelOptions, SelfOptions, GOModelOptions,
      'opticalObjectChoices' | 'arrowObject1Position' | 'arrowObject2Position' | 'framedObjectPosition'>( {

      isBasicsVersion: false,

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