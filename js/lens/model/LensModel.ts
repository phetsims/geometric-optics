// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GOModel from '../../common/model/GOModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LightSourcesScene from './LightSourcesScene.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';

type LensModelOptions = {
  tandem: Tandem
};

class LensModel extends GOModel {

  readonly lightSourcesScene: LightSourcesScene;
  readonly resetLensModel: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LensModelOptions ) {

    const options = merge( {

      //TODO give FramedObject a bisector line so this isn't empirical
      // Initial position of the framed object, empirically set so that the optical axis goes through its center.
      framedObjectPosition: new Vector2( -170, 27 ),

      // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
      opticalObjectChoices: [
        OpticalObjectChoice.PENCIL,
        OpticalObjectChoice.PENGUIN,
        OpticalObjectChoice.PLANET,
        OpticalObjectChoice.STAR,
        OpticalObjectChoice.LIGHT
      ]
    }, providedOptions );

    // super is responsible for resetting the lens
    const lens = new Lens( {
      tandem: providedOptions.tandem.createTandem( 'lens' )
    } );

    super( lens, options );

    this.lightSourcesScene = new LightSourcesScene( this.optic, this.raysTypeProperty, {
      tandem: this.scenesTandem.createTandem( 'lightSourcesScene' )
    } );

    this.resetLensModel = () => {
      this.lightSourcesScene.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetLensModel();
  }

  public stepLightRays( dt: number ): void {
    super.stepLightRays( dt );
    this.lightSourcesScene.stepLightRays( dt );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;