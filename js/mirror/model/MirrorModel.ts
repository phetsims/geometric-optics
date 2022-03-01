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
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  isBasicsVersion?: boolean
};

type MirrorModelOptions = SelfOptions & PickRequired<GOModelOptions, 'tandem'>;

class MirrorModel extends GOModel {

  // Resets things that are specific to this class.
  private readonly resetMirrorModel: () => void;

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
        OpticalObjectChoice.STAR,
        OpticalObjectChoice.ARROW
      ],

      arrowObject1Position: new Vector2( -130, 60 ),
      arrowObject2Position: new Vector2( -145, 30 ),
      framedObjectPosition: ( providedOptions.isBasicsVersion ) ?
                            new Vector2( -170, 27 ) : // empirically set so that it is vertically centered on the optical axis
                            new Vector2( -130, 72.5 ) // empirically set so that it appears to sit on the optical axis

    }, providedOptions );

    assert && assert( !options.opticalObjectChoices.includes( OpticalObjectChoice.LIGHT ),
      'Mirror screen does not support Light as an optical object choice' );

    const mirror = new Mirror( {
      isBasicsVersion: options.isBasicsVersion,
      tandem: options.tandem.createTandem( 'mirror' )
    } );

    super( mirror, options );

    this.resetMirrorModel = () => {
      mirror.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetMirrorModel();
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;