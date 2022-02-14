// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GOModel from '../../common/model/GOModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';

type LensModelOptions = {
  tandem: Tandem
};

class LensModel extends GOModel {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LensModelOptions ) {

    const options = merge( {

      // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
      opticalObjectChoices: [
        OpticalObjectChoice.ARROW,
        OpticalObjectChoice.PENCIL,
        OpticalObjectChoice.PENGUIN,
        OpticalObjectChoice.PLANET,
        OpticalObjectChoice.STAR,
        OpticalObjectChoice.LIGHT
      ],

      arrowObject1Position: new Vector2( -150, 50 ),
      arrowObject2Position: new Vector2( -125, -50 ),

      //TODO give FramedObject a bisector line so this isn't empirical
      // Initial position of the framed object, empirically set so that the optical axis goes through its center.
      framedObjectPosition: new Vector2( -170, 27 ),

      lightObject1Position: new Vector2( -170, 20 ),
      lightObject2Position: new Vector2( -145, -20 )

    }, providedOptions );

    // super is responsible for resetting the lens
    const lens = new Lens( {
      tandem: providedOptions.tandem.createTandem( 'lens' )
    } );

    super( lens, options );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;