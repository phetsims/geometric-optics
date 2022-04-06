// Copyright 2022, University of Colorado Boulder

/**
 * FramedScene is a scene in which rays from a single framed object interact with an optic and produce
 * an Image. Rays emanate from 2 points of interest on the framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import FramedObject from './FramedObject.js';
import FramedImage from './FramedImage.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { RaysType } from './RaysType.js';
import LightRays from './LightRays.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalObjectChoice from './OpticalObjectChoice.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Lens from '../../lens/model/Lens.js';
import Guides from './Guides.js';
import SecondPoint from './SecondPoint.js';
import GOScene, { GOSceneOptions } from './GOScene.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {

  // initial position of the framed object
  framedObjectPosition: Vector2;
};

type FramedObjectSceneOptions = SelfOptions & PickRequired<GOSceneOptions, 'tandem'>;

export default class FramedScene extends GOScene {

  // the elements that make up this scene
  public readonly framedObject: FramedObject;
  public readonly secondPoint: SecondPoint;
  public readonly framedImage1: FramedImage;
  public readonly framedImage2: FramedImage;
  public readonly lightRays1: LightRays;
  public readonly lightRays2: LightRays;
  public readonly guides1: Guides | null;
  public readonly guides2: Guides | null;

  // Resets things that are specific to this class.
  private readonly resetFramedObjectScene: () => void;

  /**
   * @param opticalObjectChoiceProperty
   * @param optic
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>,
               optic: Optic,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: FramedObjectSceneOptions ) {

    super( optic, providedOptions );

    let opticalObjectNumber = 1;

    this.framedObject = new FramedObject( opticalObjectNumber++, optic.positionProperty, opticalObjectChoiceProperty, {
      position: providedOptions.framedObjectPosition,
      tandem: providedOptions.tandem.createTandem( 'framedObject' )
    } );

    this.secondPoint = new SecondPoint( this.framedObject.positionProperty, {
      tandem: providedOptions.tandem.createTandem( 'secondPoint' ),
      phetioDocumentation: 'second point-of-interest on the framed object'
    } );

    this.framedImage1 = new FramedImage( this.framedObject, this.optic, {
      tandem: providedOptions.tandem.createTandem( 'framedImage1' ),
      phetioDocumentation: 'optical image associated with the first point-of-interest on the framed object'
    } );

    this.framedImage2 = new FramedImage( this.framedObject, this.optic, {
      opticalObjectPositionProperty: this.secondPoint.positionProperty,
      tandem: providedOptions.tandem.createTandem( 'framedImage2' ),
      phetioDocumentation: 'optical image associated with the second point-of-interest on the framed object'
    } );

    this.lightRays1 = new LightRays(
      this.framedObject.positionProperty,
      this.optic,
      this.framedImage1,
      raysTypeProperty,
      this.raysAnimationTimeProperty
    );

    this.lightRays2 = new LightRays(
      this.secondPoint.positionProperty,
      this.optic,
      this.framedImage2,
      raysTypeProperty,
      this.raysAnimationTimeProperty
    );

    // Guides, for the Lens screen only
    if ( optic instanceof Lens ) {
      this.guides1 = new Guides( this.optic, this.framedObject.positionProperty, {
        tandem: providedOptions.tandem.createTandem( 'guides1' ),
        phetioDocumentation: 'guides associated with the first point-of-interest on the framed object'
      } );
      this.guides2 = new Guides( this.optic, this.secondPoint.positionProperty, {
        tandem: providedOptions.tandem.createTandem( 'guides2' ),
        phetioDocumentation: 'guides associated with the second point-of-interest on the framed object'
      } );
    }
    else {
      this.guides1 = null;
      this.guides2 = null;
    }

    this.resetFramedObjectScene = () => {
      this.framedObject.reset();
      this.secondPoint.reset();
      this.framedImage1.reset();
      this.framedImage2.reset();
    };
  }

  public override reset(): void {
    super.reset();
    this.resetFramedObjectScene();
  }
}

geometricOptics.register( 'FramedScene', FramedScene );