// Copyright 2021-2025, University of Colorado Boulder

/**
 * SecondPoint is the model of the second point on a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';

type SelfOptions = EmptySelfOptions;

type SecondPointOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

export default class SecondPoint extends PhetioObject {

  // position of the framed object that second point is associated with
  public readonly framedObjectPositionProperty: TReadOnlyProperty<Vector2>;

  // vertical offset of second point, relative to the framed object's position, in cm
  public readonly verticalOffsetProperty: Property<number>;

  // position of the second point in the global model coordinate frame
  public readonly positionProperty: TReadOnlyProperty<Vector2>;

  // Resets things that are specific to this class.
  private readonly resetSecondPoint: () => void;

  // range of the vertical offset for the second point, relative to frame object's position, in cm
  // See https://github.com/phetsims/geometric-optics/issues/401
  public static readonly VERTICAL_OFFSET_RANGE = new Range( -56.5, 0 );

  public constructor( framedObjectPositionProperty: TReadOnlyProperty<Vector2>, providedOptions: SecondPointOptions ) {

    const options = optionize<SecondPointOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.verticalOffsetProperty = new NumberProperty( SecondPoint.VERTICAL_OFFSET_RANGE.min, {
      range: SecondPoint.VERTICAL_OFFSET_RANGE,
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

  public reset(): void {
    this.resetSecondPoint();
  }
}

geometricOptics.register( 'SecondPoint', SecondPoint );