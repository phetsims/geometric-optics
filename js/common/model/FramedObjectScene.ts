// Copyright 2022, University of Colorado Boulder

/**
 * FramedObjectScene is a scene in which rays from a single framed object interact with an optic and produce
 * an Image. Rays emanate from 2 points of interest on the framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import FramedObject from './FramedObject.js';
import FramedImage from './FramedImage.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from './RaysType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LightRays from './LightRays.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalObjectChoice from './OpticalObjectChoice.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Lens from '../../lens/model/Lens.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Guides from '../../lens/model/Guides.js';
import SecondPoint from './SecondPoint.js';

type FramedObjectSceneOptions = {

  // initial position of the framed object
  framedObjectPosition: Vector2,

  // phet-io options
  tandem: Tandem
};

class FramedObjectScene extends PhetioObject {

  readonly optic: Optic;
  readonly framedObject: FramedObject;
  readonly secondPoint: SecondPoint;
  readonly framedImage1: FramedImage;
  readonly framedImage2: FramedImage;
  readonly lightRaysAnimationTimeProperty: NumberProperty;
  readonly lightRays1: LightRays;
  readonly lightRays2: LightRays;
  readonly guides1: Guides | null;
  readonly guides2: Guides | null;
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

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.optic = optic;

    this.addLinkedElement( optic, {
      tandem: options.tandem.createTandem( 'optic' )
    } );

    this.framedObject = new FramedObject( opticalObjectChoiceProperty, {
      position: options.framedObjectPosition,
      tandem: options.tandem.createTandem( 'framedObject' )
    } );

    this.secondPoint = new SecondPoint( this.framedObject.positionProperty, {
      tandem: options.tandem.createTandem( 'secondPoint' ),
      phetioDocumentation: 'second point-of-interest on the framed object'
    } );

    this.framedImage1 = new FramedImage( this.framedObject.positionProperty,
      this.framedObject.objectHTMLImageElementsProperty, this.optic, {
        tandem: options.tandem.createTandem( 'framedImage1' ),
        phetioDocumentation: 'optical image associated with the first point-of-interest on the framed object'
      } );

    this.framedImage2 = new FramedImage( this.secondPoint.positionProperty,
      this.framedObject.objectHTMLImageElementsProperty, this.optic, {
        tandem: options.tandem.createTandem( 'framedImage2' ),
        phetioDocumentation: 'optical image associated with the second point-of-interest on the framed object'
      } );

    this.lightRaysAnimationTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, 10 ), // determines the duration of the light rays animation
      tandem: options.tandem.createTandem( 'lightRaysAnimationTimeProperty' ),
      phetioReadOnly: true
    } );

    this.lightRays1 = new LightRays(
      this.lightRaysAnimationTimeProperty,
      raysTypeProperty,
      this.framedObject.positionProperty,
      this.optic,
      this.framedImage1
    );

    this.lightRays2 = new LightRays(
      this.lightRaysAnimationTimeProperty,
      raysTypeProperty,
      this.secondPoint.positionProperty,
      this.optic,
      this.framedImage2
    );

    // Guides
    if ( optic instanceof Lens ) {

      this.guides1 = new Guides( this.optic, this.framedObject.positionProperty, {
        tandem: options.tandem.createTandem( 'guides1' ),
        phetioDocumentation: 'guides associated with the first point-of-interest on the framed object'
      } );
      this.guides2 = new Guides( this.optic, this.secondPoint.positionProperty, {
        tandem: options.tandem.createTandem( 'guides2' ),
        phetioDocumentation: 'guides associated with the second point-of-interest on the framed object'
      } );
    }
    else {
      this.guides1 = null;
      this.guides2 = null;
    }

    //TODO is this complete?
    this.resetFramedObjectScene = () => {
      this.framedObject.reset();
      this.secondPoint.reset();
      this.lightRaysAnimationTimeProperty.reset();
    };
  }

  public reset(): void {
    this.resetFramedObjectScene();
  }

  /**
   * Steps the animation of light rays.
   * @param dt - time step, in seconds
   */
  public stepLightRays( dt: number ): void {
    const t = Math.min( this.lightRaysAnimationTimeProperty.value + dt, this.lightRaysAnimationTimeProperty.range!.max );
    assert && assert( this.lightRaysAnimationTimeProperty.range ); // {Range|null}
    if ( this.lightRaysAnimationTimeProperty.range!.contains( t ) ) {
      this.lightRaysAnimationTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'FramedObjectScene', FramedObjectScene );
export default FramedObjectScene;