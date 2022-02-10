// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOModel is the common top-level model for this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
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
import OpticalObjectChoice from './OpticalObjectChoice.js';
import ArrowObjectScene from './ArrowObjectScene.js';

type GOModelOptions = {

  // initial positions of optical objects
  framedObjectPosition: Vector2,
  arrowObject1Position: Vector2,
  arrowObject2Position: Vector2,

  // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
  opticalObjectChoices: OpticalObjectChoice[],

  // phet-io options
  tandem: Tandem
};

class GOModel {

  readonly opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>;

  // model of the optic
  readonly optic: Optic;

  // representation used for rays
  readonly raysTypeProperty: Property<RaysType>;

  // scenes
  readonly arrowObjectScene: ArrowObjectScene;
  readonly framedObjectScene: FramedObjectScene;

  // rulers
  readonly horizontalRuler: GORuler;
  readonly verticalRuler: GORuler;

  // Maximum distance that things can be dragged from the optical axis, in cm. This is constrained to prevent
  // cases where the optical object is close to the optic and no 'Many' rays go through the optic.
  // See https://github.com/phetsims/geometric-optics/issues/289
  readonly maxDistanceFromOpticalAxis: number;

  // Scenes are grouped under this tandem
  protected readonly scenesTandem: Tandem;

  private readonly resetGOModel: () => void;

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: GOModelOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    this.opticalObjectChoiceProperty = new EnumerationProperty( options.opticalObjectChoices[ 0 ], {
      validValues: options.opticalObjectChoices,
      tandem: options.tandem.createTandem( 'opticalObjectChoiceProperty' )
    } );

    this.optic = optic;

    this.raysTypeProperty = new Property( 'marginal', {
      validValues: RaysTypeValues,
      tandem: options.tandem.createTandem( 'raysTypeProperty' ),
      phetioType: Property.PropertyIO( StringIO )
    } );

    this.scenesTandem = options.tandem.createTandem( 'scenes' );

    this.arrowObjectScene = new ArrowObjectScene( this.optic, this.raysTypeProperty, {
      arrowObject1Position: options.arrowObject1Position,
      arrowObject2Position: options.arrowObject2Position,
      tandem: this.scenesTandem.createTandem( 'arrowObjectScene' )
    } );

    this.framedObjectScene = new FramedObjectScene( this.opticalObjectChoiceProperty, this.optic, this.raysTypeProperty, {
      framedObjectPosition: options.framedObjectPosition,
      tandem: this.scenesTandem.createTandem( 'framedObjectScene' )
    } );

    const rulersTandem = options.tandem.createTandem( 'rulers' );

    this.horizontalRuler = new GORuler( {
      orientation: 'horizontal',
      length: GOConstants.HORIZONTAL_RULER_LENGTH,
      tandem: rulersTandem.createTandem( 'horizontalRuler' )
    } );

    this.verticalRuler = new GORuler( {
      orientation: 'vertical',
      length: GOConstants.VERTICAL_RULER_LENGTH,
      tandem: rulersTandem.createTandem( 'verticalRuler' )
    } );

    this.maxDistanceFromOpticalAxis = 100; // cm

    this.resetGOModel = () => {
      this.opticalObjectChoiceProperty.reset();
      this.optic.reset();
      this.raysTypeProperty.reset();
      this.framedObjectScene.reset();
      this.arrowObjectScene.reset();
      this.horizontalRuler.reset();
      this.verticalRuler.reset();
    };
  }

  public reset(): void {
    this.resetGOModel();
  }

  public stepLightRays( dt: number ): void {
    this.framedObjectScene.stepLightRays( dt );
  }
}

geometricOptics.register( 'GOModel', GOModel );
export default GOModel;