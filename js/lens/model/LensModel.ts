// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GOModel, { GOModelOptions } from '../../common/model/GOModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';

type LensModelOptions = PickRequired<GOModelOptions, 'tandem'>;

class LensModel extends GOModel {

  // Resets things that are specific to this class.
  private readonly resetLensModel: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LensModelOptions ) {

    // See GOQueryParameters.fuzzScene and https://github.com/phetsims/geometric-optics/issues/397
    let opticalObjectChoices;
    if ( GOQueryParameters.scene === 'framed' ) {
      opticalObjectChoices = [ OpticalObjectChoice.PENCIL ];
    }
    else if ( GOQueryParameters.scene === 'arrow' ) {
      opticalObjectChoices = [ OpticalObjectChoice.ARROW ];
    }
    else if ( GOQueryParameters.scene === 'light' ) {
      opticalObjectChoices = [ OpticalObjectChoice.LIGHT ];
    }
    else {
      opticalObjectChoices = [
        OpticalObjectChoice.PENCIL,
        OpticalObjectChoice.PENGUIN,
        OpticalObjectChoice.STAR,
        OpticalObjectChoice.ARROW,
        OpticalObjectChoice.LIGHT
      ];
    }

    const options = optionize<LensModelOptions, {}, GOModelOptions,
      'opticalObjectChoices' | 'arrowObject1Position' | 'arrowObject2Position' | 'framedObjectPosition'>( {

      // GOModelOptions
      opticalObjectChoices: opticalObjectChoices,
      arrowObject1Position: new Vector2( -160, 60 ),
      arrowObject2Position: new Vector2( -125, 30 ),
      framedObjectPosition: new Vector2( -170, 27 ),
      lightObject1Position: new Vector2( -170, 20 ),
      lightObject2Position: new Vector2( -124, -20 )

    }, providedOptions );

    const lens = new Lens( {
      tandem: providedOptions.tandem.createTandem( 'lens' )
    } );

    super( lens, options );

    this.resetLensModel = () => {
      lens.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetLensModel();
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;