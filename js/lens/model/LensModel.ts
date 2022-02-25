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
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type LensModelOptions = PickRequired<GOModelOptions, 'tandem'>;

class LensModel extends GOModel {

  public readonly resetLensModel: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LensModelOptions ) {

    const options = optionize<LensModelOptions, {}, GOModelOptions,
      'opticalObjectChoices' | 'arrowObject1Position' | 'arrowObject2Position' | 'framedObjectPosition'>( {

      // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
      opticalObjectChoices: [
        OpticalObjectChoice.PENCIL,
        OpticalObjectChoice.PENGUIN,
        OpticalObjectChoice.ARROW,
        OpticalObjectChoice.LIGHT
      ],

      // Initial positions of optical objects
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