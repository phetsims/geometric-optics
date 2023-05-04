// Copyright 2021-2023, University of Colorado Boulder

/**
 * GOModel is the base class for this simulation's top-level model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import Optic from './Optic.js';
import { RaysType, RaysTypeValues } from './RaysType.js';
import GORuler from './tools/GORuler.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FramedScene from './FramedScene.js';
import OpticalObjectChoice from './OpticalObjectChoice.js';
import ArrowScene from './ArrowScene.js';
import LightScene from './LightScene.js';
import GOScene from './GOScene.js';
import Lens from '../../lens/model/Lens.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PositionMarker from './tools/PositionMarker.js';
import GOColors from '../GOColors.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TModel from '../../../../joist/js/TModel.js';

type SelfOptions = {

  // optical object choices, in the order that they will appear in OpticalObjectChoiceComboBox
  opticalObjectChoices: OpticalObjectChoice[];

  // initial positions of optical objects (lights are optional)
  arrowObject1Position: Vector2;
  arrowObject2Position: Vector2;
  framedObjectPosition: Vector2;
  lightObject1Position?: Vector2;
  lightObject2Position?: Vector2;
};

export type GOModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GOModel implements TModel {

  // choice of optical object
  public readonly opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>;

  // representation used for rays
  public readonly raysTypeProperty: Property<RaysType>;

  // whether light propagation is enabled
  public readonly lightPropagationEnabledProperty: Property<boolean>;

  // model of the optic, shared with all scenes
  public readonly optic: Optic;

  // scenes
  private readonly scenes: GOScene[];
  public readonly arrowScene: ArrowScene;
  public readonly framedScene: FramedScene;
  public readonly lightScene?: LightScene; // optional, supported by the Lens screen

  // rulers
  public readonly horizontalRuler: GORuler;
  public readonly verticalRuler: GORuler;

  // position markers
  public readonly positionMarker1: PositionMarker;
  public readonly positionMarker2: PositionMarker;

  // Resets things that are specific to this class.
  private readonly resetGOModel: () => void;

  /**
   * @param optic - the optic, shared by all scenes in the model
   * @param providedOptions
   */
  protected constructor( optic: Optic, providedOptions: GOModelOptions ) {

    const options = optionize<GOModelOptions, SelfOptions>()( {

      // SelfOptions
      lightObject1Position: Vector2.ZERO,
      lightObject2Position: Vector2.ZERO
    }, providedOptions );

    this.opticalObjectChoiceProperty = new EnumerationProperty( options.opticalObjectChoices[ 0 ], {
      validValues: options.opticalObjectChoices,
      tandem: options.tandem.createTandem( 'opticalObjectChoiceProperty' ),
      phetioFeatured: true
    } );

    this.optic = optic;

    this.raysTypeProperty = new StringUnionProperty( 'marginal', {
      validValues: RaysTypeValues,
      tandem: options.tandem.createTandem( 'raysTypeProperty' ),
      phetioFeatured: true
    } );

    this.lightPropagationEnabledProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'lightPropagationEnabledProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Turns light propagation on (true) and off (false) to support predictive questioning.<br>' +
                           'When off, the following things are not visible:' +
                           '<ul>' +
                           '<li>rays (real and virtual)' +
                           '<li>images (real and virtual)' +
                           '<li>light spots on the projection screen' +
                           '</ul>'
    } );

    // Scenes are grouped under this tandem.
    const scenesTandem = options.tandem.createTandem( 'scenes' );

    this.scenes = [];

    this.arrowScene = new ArrowScene( this.optic, this.raysTypeProperty, {
      arrowObject1Position: options.arrowObject1Position,
      arrowObject2Position: options.arrowObject2Position,
      tandem: scenesTandem.createTandem( 'arrowScene' )
    } );
    this.scenes.push( this.arrowScene );

    this.framedScene = new FramedScene( this.opticalObjectChoiceProperty, this.optic, this.raysTypeProperty, {
      framedObjectPosition: options.framedObjectPosition,
      tandem: scenesTandem.createTandem( 'framedScene' )
    } );
    this.scenes.push( this.framedScene );

    // Note that while the Light scene is specific to the Mirror screen, it was more straightforward to handle it
    // as an optional part of this base class.
    if ( options.opticalObjectChoices.includes( OpticalObjectChoice.LIGHT ) ) {
      assert && assert( this.optic instanceof Lens, 'Light is only supported by the Lens screen' );
      this.lightScene = new LightScene( this.optic as Lens, this.raysTypeProperty, {
        lightObject1Position: options.lightObject1Position,
        lightObject2Position: options.lightObject2Position,
        tandem: scenesTandem.createTandem( 'lightScene' )
      } );
      this.scenes.push( this.lightScene );
    }

    // Tools are grouped under this tandem.
    const toolsTandem = options.tandem.createTandem( 'tools' );

    this.horizontalRuler = new GORuler( {
      orientation: 'horizontal',
      length: GOConstants.HORIZONTAL_RULER_LENGTH,
      tandem: toolsTandem.createTandem( 'horizontalRuler' )
    } );

    this.verticalRuler = new GORuler( {
      orientation: 'vertical',
      length: GOConstants.VERTICAL_RULER_LENGTH,
      tandem: toolsTandem.createTandem( 'verticalRuler' )
    } );

    this.positionMarker1 = new PositionMarker( {
      fill: GOColors.positionMarker1FillProperty,
      stroke: GOColors.positionMarker1StrokeProperty,
      tandem: toolsTandem.createTandem( 'positionMarker1' )
    } );

    this.positionMarker2 = new PositionMarker( {
      fill: GOColors.positionMarker2FillProperty,
      stroke: GOColors.positionMarker2StrokeProperty,
      tandem: toolsTandem.createTandem( 'positionMarker2' )
    } );

    this.resetGOModel = () => {
      // client provided the optic, and is responsible for resetting the optic!
      this.opticalObjectChoiceProperty.reset();
      this.raysTypeProperty.reset();
      this.lightPropagationEnabledProperty.reset();
      this.scenes.forEach( scene => scene.reset() );
      this.horizontalRuler.reset();
      this.verticalRuler.reset();
      this.positionMarker1.reset();
      this.positionMarker2.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.resetGOModel();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.lightPropagationEnabledProperty.value && ( this.raysTypeProperty.value !== 'none' ) ) {
      this.scenes.forEach( scene => scene.stepLightRays( dt ) );
    }
  }

  /**
   * Causes the rays animation to begin.
   */
  public beginLightRaysAnimation(): void {
    this.scenes.forEach( scene => scene.beginLightRaysAnimation() );
  }
}

geometricOptics.register( 'GOModel', GOModel );