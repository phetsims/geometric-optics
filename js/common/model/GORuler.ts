// Copyright 2021-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/355 factor out duplication into GOTool
/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

type RulerOrientation = 'horizontal' | 'vertical';

type SelfOptions = {
  orientation: RulerOrientation;
  length: number;
};

type GeometricOpticsRulerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class GORuler extends PhetioObject {

  // orientation of the ruler
  public readonly orientation: RulerOrientation;

  // length of the ruler, in cm
  public length: number;

  // original (unscaled) length of the ruler, in cm
  private readonly nominalLength: number;

  // position of the ruler, in cm
  public readonly positionProperty: Property<Vector2>;

  // Whether the ruler is in the toolbox.
  public readonly isInToolboxProperty: Property<boolean>;

  // Resets things that are specific to this class.
  private readonly resetGORuler: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GeometricOpticsRulerOptions ) {

    const options = optionize<GeometricOpticsRulerOptions, SelfOptions, PhetioObjectOptions>( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    assert && assert( isFinite( providedOptions.length ) && providedOptions.length > 0 );

    super( options );

    this.orientation = providedOptions.orientation;
    this.length = providedOptions.length;
    this.nominalLength = providedOptions.length;

    // The initial value of position really does not matter, because position will be set when the ruler is
    // removed from the toolbox.
    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.isInToolboxProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isInToolboxProperty' ),
      phetioDocumentation: 'Controls whether the ruler is in the toolbox.'
    } );

    this.resetGORuler = () => {
      this.positionProperty.reset();
      this.isInToolboxProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.resetGORuler();
  }

  /**
   * Scales the length of the ruler based on zoomScale.
   * @param zoomScale
   */
  public scaleLength( zoomScale: number ): void {
    assert && assert( isFinite( zoomScale ) && zoomScale > 0 );
    this.length = this.nominalLength / zoomScale;
  }
}

geometricOptics.register( 'GORuler', GORuler );
export { GORuler as default };