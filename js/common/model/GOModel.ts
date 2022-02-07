// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOModel is the common top-level model for this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import Optic from './Optic.js';
import { RaysType, RaysTypeValues } from './RaysType.js';
import GORuler from './GORuler.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FramedObjectScene from './FramedObjectScene.js';
import Representation, { FRAMED_OBJECT_REPRESENTATIONS, LIGHT_SOURCE_REPRESENTATION } from './Representation.js';
import Lens from '../../lens/model/Lens.js';

type GeometricOpticsModelOptions = {

  // initial position of the framed object
  framedObjectPosition: Vector2,

  // phet-io options
  tandem: Tandem
};

class GOModel {

  readonly representationProperty: Property<Representation>;

  // model of the optic
  readonly optic: Optic;

  // representation used for rays
  readonly raysTypeProperty: Property<RaysType>;

  // scenes
  readonly framedObjectScene: FramedObjectScene;

  // rulers
  readonly horizontalRuler: GORuler;
  readonly verticalRuler: GORuler;

  // Maximum distance that things can be dragged from the optical axis, in cm. This is constrained to prevent
  // cases where the optical object is close to the optic and no 'Many' rays go through the optic.
  // See https://github.com/phetsims/geometric-optics/issues/289
  readonly maxDistanceFromOpticalAxis: number;

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: GeometricOpticsModelOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    //TODO this is a bit of a hack
    this.representationProperty = new Property( FRAMED_OBJECT_REPRESENTATIONS[ 0 ], {
      validValues: ( optic instanceof Lens ) ?
                   [ ...FRAMED_OBJECT_REPRESENTATIONS, LIGHT_SOURCE_REPRESENTATION ] :
                   [ ...FRAMED_OBJECT_REPRESENTATIONS ]
    } );

    this.optic = optic;

    this.raysTypeProperty = new Property( 'marginal', {
      validValues: RaysTypeValues,
      tandem: options.tandem.createTandem( 'raysTypeProperty' ),
      phetioType: Property.PropertyIO( StringIO )
    } );

    this.framedObjectScene = new FramedObjectScene( this.optic, this.raysTypeProperty, {
      framedObjectPosition: options.framedObjectPosition,
      tandem: options.tandem.createTandem( 'framedObjectScene' )
    } );

    this.horizontalRuler = new GORuler( {
      orientation: 'horizontal',
      length: GOConstants.HORIZONTAL_RULER_LENGTH,
      tandem: options.tandem.createTandem( 'horizontalRuler' )
    } );

    this.verticalRuler = new GORuler( {
      orientation: 'vertical',
      length: GOConstants.VERTICAL_RULER_LENGTH,
      tandem: options.tandem.createTandem( 'verticalRuler' )
    } );

    this.maxDistanceFromOpticalAxis = 100; // cm
  }

  public reset(): void {
    this.representationProperty.reset();
    this.optic.reset();
    this.raysTypeProperty.reset();
    this.framedObjectScene.reset();
    this.horizontalRuler.reset();
    this.verticalRuler.reset();
  }

  public stepLightRays( dt: number ): void {
    this.framedObjectScene.stepLightRays( dt );
  }
}

geometricOptics.register( 'GOModel', GOModel );
export default GOModel;
export type { GeometricOpticsModelOptions };