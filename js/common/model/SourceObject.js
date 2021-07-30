// Copyright 2021, University of Colorado Boulder

/**
 * Model element for object (in the sense commonly used in geometric optic) or source of light
 * The sourceObject has a position and a "second source" position within it.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

const DEFAULT_SOURCE_POINT_1 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1;
const DEFAULT_SOURCE_POINT_2 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2;
const SECOND_OBJECT_VERTICAL_RANGE = GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE;
const OBJECT_SCALE_FACTOR = GeometricOpticsConstants.OBJECT_SCALE_FACTOR;
const SOURCE_SCALE_FACTOR = GeometricOpticsConstants.SOURCE_SCALE_FACTOR;

class SourceObject {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Representation>} representationProperty
   * @param {Tandem} tandem
   */
  constructor( opticPositionProperty, representationProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const scale = representationProperty.value.isObject ? OBJECT_SCALE_FACTOR : SOURCE_SCALE_FACTOR;

    // @public {Vector2} displacement vector from the firstPosition to the left top - value depends on representation
    // values are in centimeters
    this.offsetPosition = representationProperty.value.offsetPosition.dividedScalar( scale );

    // @public {Property.<Vector2>} position of the left top position of image
    this.leftTopProperty = new Vector2Property( DEFAULT_SOURCE_POINT_1.plus( this.offsetPosition ) );

    // @public {Property.<Vector2>} position of the source/object
    this.firstPositionProperty = new DerivedProperty( [ this.leftTopProperty ], leftTop => {
      return leftTop.minus( this.offsetPosition );
    } );

    // @public {Property.<Bounds2>} model bounds of the source/object Image ( in the scenery sense)
    this.boundsProperty = new DerivedProperty( [ this.leftTopProperty, representationProperty ],
      ( leftTop, representation ) => {
        const scale = representation.isObject ? OBJECT_SCALE_FACTOR : SOURCE_SCALE_FACTOR;
        const dimensions = new Dimension2( representation.dimensions.width / scale,
          representation.dimensions.height / scale );
        return dimensions.toBounds( leftTop.x, leftTop.y - dimensions.height );
      } );

    // @private {Property.<Vector2>} position of the second source of light
    this.unconstrainedSecondSourcePositionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_2 );

    // @private {Property.<number>} vertical offset (in centimeters) of second object with respect to the first
    this.verticalOffsetProperty = new NumberProperty( SECOND_OBJECT_VERTICAL_RANGE.defaultValue,
      { range: SECOND_OBJECT_VERTICAL_RANGE } );

    // @public (read-only) {Vector2} initial position of the optic
    this.opticPositionProperty = opticPositionProperty;

    // @public {Property.<Vector2>} position of the second source (source/object)
    this.secondPositionProperty =
      new DerivedProperty( [ this.firstPositionProperty,
          this.verticalOffsetProperty,
          this.unconstrainedSecondSourcePositionProperty,
          representationProperty ],
        ( position, verticalOffset, unconstrainedPosition, representation ) => {
          if ( representation.isObject ) {
            return position.plusXY( 0, verticalOffset );
          }
          else {
            return unconstrainedPosition;
          }
        } );

    // update the left top position when the representation changes
    representationProperty.link( representation => {

      const scale = representation.isObject ? OBJECT_SCALE_FACTOR : SOURCE_SCALE_FACTOR;

      // {Vector2} update the value of the offset
      this.offsetPosition = representation.offsetPosition.dividedScalar( scale );

      // {Vector2} update the left top position - the firstPosition is the ground truth when changing representation
      this.leftTopProperty.value = this.firstPositionProperty.value.plus( this.offsetPosition );
    } );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.verticalOffsetProperty.reset();
    this.unconstrainedSecondSourcePositionProperty.reset();
    this.leftTopProperty.reset();
  }

  /**
   * Returns the position of the source
   * @public
   * @returns {Vector2}
   */
  getPosition() {
    return this.firstPositionProperty.value;
  }

  /**
   * Sets the second source point
   * @public
   * @param {Property.<Representation>} representationProperty
   * @param {Vector2} position
   */
  setSecondPoint( representationProperty, position ) {
    if ( representationProperty.value.isObject ) {
      const unconstrainedVerticalOffset = position.y - this.firstPositionProperty.value.y;
      this.verticalOffsetProperty.value = Utils.clamp( unconstrainedVerticalOffset,
        SECOND_OBJECT_VERTICAL_RANGE.min,
        SECOND_OBJECT_VERTICAL_RANGE.max );
    }
    else {
      this.unconstrainedSecondSourcePositionProperty.value = position;
    }
  }

  /**
   * Gets the position of the optic
   * @public
   * @returns {Vector2} position
   */
  getOpticPosition() {
    return this.opticPositionProperty.value;
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;
