// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GOModel, { GeometricOpticsModelOptions } from '../../common/model/GOModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LightSourcesScene from './LightSourcesScene.js';

type LensModelOptions = {
  tandem: Tandem
};

class LensModel extends GOModel {

  readonly lightSourcesScene: LightSourcesScene;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LensModelOptions ) {

    const options = merge( {

      //TODO give framedObject a bisector line so this isn't empirical
      // Initial position of the framed object, empirically set so that the optical axis goes through its center.
      framedObjectPosition: new Vector2( -170, 27 )
    }, providedOptions ) as GeometricOpticsModelOptions; //TODO don't use 'as'

    // super is responsible for resetting the lens
    const lens = new Lens( {
      tandem: providedOptions.tandem.createTandem( 'lens' )
    } );

    super( lens, options );

    this.lightSourcesScene = new LightSourcesScene( this.optic, this.raysTypeProperty, {
      tandem: this.scenesTandem.createTandem( 'lightSourcesScene' )
    } );
  }

  reset() {
    super.reset();
    this.lightSourcesScene.reset();
  }

  public stepLightRays( dt: number ): void {
    super.stepLightRays( dt );
    this.lightSourcesScene.stepLightRays( dt );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;