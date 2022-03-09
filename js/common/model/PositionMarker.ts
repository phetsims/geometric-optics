// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/355 factor out duplication into GOTool
/**
 * PositionMarker is used to mark an arbitrary position.
 * See https://github.com/phetsims/geometric-optics/issues/355
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import { IColor } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  fill: IColor;
  stroke: IColor;
};

type PositionMarkerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class PositionMarker extends PhetioObject {

  // fill and stroke for the marker
  public readonly fill: IColor;
  public readonly stroke: IColor;

  // position of the marker, in cm
  public readonly positionProperty: Property<Vector2>;

  // Whether the marker is in the toolbox.
  public readonly isInToolboxProperty: Property<boolean>;

  // Resets things that are specific to this class.
  private readonly resetPositionMarker: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: PositionMarkerOptions ) {

    const options = optionize<PositionMarkerOptions, SelfOptions, PhetioObjectOptions>( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.fill = options.fill;
    this.stroke = options.stroke;

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.isInToolboxProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isInToolboxProperty' ),
      phetioDocumentation: 'Controls whether the marker is in the toolbox.'
    } );

    this.resetPositionMarker = () => {
      this.positionProperty.reset();
      this.isInToolboxProperty.reset();
    };
  }

  public reset(): void {
    this.resetPositionMarker();
  }
}

geometricOptics.register( 'PositionMarker', PositionMarker );
export default PositionMarker;