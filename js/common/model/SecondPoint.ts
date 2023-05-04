// Copyright 2021-2023, University of Colorado Boulder

/**
 * SecondPoint is the model of the second point on a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// range of the vertical offset for the second point, relative to frame object's position, in cm
// See https://github.com/phetsims/geometric-optics/issues/401
const VERTICAL_OFFSET_RANGE = new Range( -56.5, 0 );

type SelfOptions = EmptySelfOptions;

type SecondPointOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

export default class SecondPoint extends PhetioObject {

  // position of the second point
  public readonly positionProperty: TReadOnlyProperty<Vector2>;

  // vertical offset of second point with respect to the first point on the framed object position, in cm
  private readonly verticalOffsetProperty: Property<number>;

  // position of the framed object that second point is associated with
  private readonly framedObjectPositionProperty: TReadOnlyProperty<Vector2>;

  // Resets things that are specific to this class.
  private readonly resetSecondPoint: () => void;

  public constructor( framedObjectPositionProperty: TReadOnlyProperty<Vector2>, providedOptions: SecondPointOptions ) {

    const options = optionize<SecondPointOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.verticalOffsetProperty = new NumberProperty( VERTICAL_OFFSET_RANGE.min, {
      range: VERTICAL_OFFSET_RANGE,
      tandem: options.tandem.createTandem( 'verticalOffsetProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'offset relative to framed object position'
    } );

    this.positionProperty = new DerivedProperty(
      [ framedObjectPositionProperty, this.verticalOffsetProperty ],
      ( framedObjectPosition, verticalOffset ) =>
        framedObjectPosition.plusXY( 0, verticalOffset ), {
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioFeatured: true,
        phetioValueType: Vector2.Vector2IO
      } );

    this.framedObjectPositionProperty = framedObjectPositionProperty;

    this.resetSecondPoint = () => {
      this.verticalOffsetProperty.reset();
    };
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetSecondPoint();
  }

  /**
   * Sets the second point-of-interest on the framed object.
   * @param position - relative to the framed object's position
   */
  public setSecondPoint( position: Vector2 ): void {
    this.verticalOffsetProperty.value =
      VERTICAL_OFFSET_RANGE.constrainValue( position.y - this.framedObjectPositionProperty.value.y );
  }
}

geometricOptics.register( 'SecondPoint', SecondPoint );