// Copyright 2021, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GOModel, { GeometricOpticsModelOptions } from '../../common/model/GOModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';
import LightSpot from './LightSpot.js';
import ProjectionScreen from './ProjectionScreen.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';

type LensModelOptions = {
  tandem: Tandem
};

class LensModel extends GOModel {

  // model of the projection screen
  readonly projectionScreen: ProjectionScreen;

  // light spot associated with the first light source
  readonly lightSpot1: LightSpot;

  // light spot associated with the second light source
  readonly lightSpot2: LightSpot;

  // top guide associated with the source object or first light source
  readonly topGuide1: Guide;

  // bottom guide associated with the source object or first light source
  readonly bottomGuide1: Guide;

  // top guide associated with the second point or second light source
  readonly topGuide2: Guide;

  // bottom guide associated with the second point or second light source
  readonly bottomGuide2: Guide;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LensModelOptions ) {

    const lens = new Lens( {
      tandem: providedOptions.tandem.createTandem( 'lens' )
    } );

    const projectionScreen = new ProjectionScreen( {
      tandem: providedOptions.tandem.createTandem( 'projectionScreen' )
    } );

    const options = merge( {
      barrier: projectionScreen
    }, providedOptions ) as GeometricOpticsModelOptions;

    super( lens, options );

    this.projectionScreen = projectionScreen;

    // Light Spots
    this.lightSpot1 = new LightSpot( this.optic, this.projectionScreen, this.sourceObject.positionProperty,
      this.firstTarget.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot1' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the first light source'
      } );
    this.lightSpot2 = new LightSpot( this.optic, this.projectionScreen, this.secondPoint.positionProperty,
      this.secondTarget.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot2' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the second light source'
      } );

    // Guides
    const guidesTandem = options.tandem.createTandem( 'guides' );
    this.topGuide1 = new Guide( this.optic, this.sourceObject.positionProperty, 'top', {
      tandem: guidesTandem.createTandem( 'topGuide1' ),
      phetioDocumentation: 'TODO'
    } );
    this.bottomGuide1 = new Guide( this.optic, this.sourceObject.positionProperty, 'bottom', {
      tandem: guidesTandem.createTandem( 'bottomGuide1' ),
      phetioDocumentation: 'TODO'
    } );
    this.topGuide2 = new Guide( this.optic, this.secondPoint.positionProperty, 'top', {
      tandem: guidesTandem.createTandem( 'topGuide2' ),
      phetioDocumentation: 'TODO'
    } );
    this.bottomGuide2 = new Guide( this.optic, this.secondPoint.positionProperty, 'bottom', {
      tandem: guidesTandem.createTandem( 'bottomGuide2' ),
      phetioDocumentation: 'TODO'
    } );
  }

  public reset(): void {
    super.reset();
    this.projectionScreen.reset();
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;