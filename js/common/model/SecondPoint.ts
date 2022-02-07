// Copyright 2021-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/217 remove stuff having to do with light source
//TODO https://github.com/phetsims/geometric-optics/issues/217 move this into FramedObject
/**
 * SecondPoint is the model of the second point on a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';
import Representation from './Representation.js';

// initial position of the second light source, in cm
const INITIAL_LIGHT_SOURCE_POSITION = new Vector2( -150, -20 );

// range of the vertical offset for the second point, relative to the Object, in cm
const VERTICAL_OFFSET_RANGE = new RangeWithValue( -55, 0, -52 );

class SecondPoint {

  // position of the second point or second light source
  readonly positionProperty: IReadOnlyProperty<Vector2>;

  // position of the second light source
  readonly lightSourcePositionProperty: Property<Vector2>;

  // vertical offset of second point with respect to the first object, in cm
  private readonly verticalOffsetProperty: Property<number>

  private readonly framedObjectPositionProperty: IReadOnlyProperty<Vector2>;

  /**
   * @param representationProperty
   * @param framedObjectPositionProperty
   */
  constructor( representationProperty: Property<Representation>, framedObjectPositionProperty: IReadOnlyProperty<Vector2> ) {

    this.lightSourcePositionProperty = new Vector2Property( INITIAL_LIGHT_SOURCE_POSITION );

    this.verticalOffsetProperty = new NumberProperty( VERTICAL_OFFSET_RANGE.defaultValue, {
      range: VERTICAL_OFFSET_RANGE
    } );

    this.positionProperty = new DerivedProperty(
      [ framedObjectPositionProperty, this.verticalOffsetProperty, this.lightSourcePositionProperty, representationProperty ],
      ( framedObjectPosition: Vector2, verticalOffset: number, lightSourcePosition: Vector2, representation: Representation ) =>
        representation.isFramedObject ? framedObjectPosition.plusXY( 0, verticalOffset ) : lightSourcePosition
    );

    this.framedObjectPositionProperty = framedObjectPositionProperty;
  }

  public reset(): void {
    this.verticalOffsetProperty.reset();
    this.lightSourcePositionProperty.reset();
  }

  /**
   * Sets the second source point
   * @param isFramedObject
   * @param position
   */
  public setSecondPoint( isFramedObject: boolean, position: Vector2 ): void {
    if ( isFramedObject ) {
      this.verticalOffsetProperty.value = VERTICAL_OFFSET_RANGE.constrainValue(
        position.y - this.framedObjectPositionProperty.value.y );
    }
    else {
      this.lightSourcePositionProperty.value = position;
    }
  }
}

geometricOptics.register( 'SecondPoint', SecondPoint );
export default SecondPoint;