// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the source or object
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import SourceObjectRepresentation from './SourceObjectRepresentation.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

const DEFAULT_SOURCE_POINT_1 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1;
const DEFAULT_SOURCE_POINT_2 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2;
const verticalOffsetRange = new RangeWithValue( -0.5, 0, -0.1 );

class SourceObject {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} position of the source/object
    this.positionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_1 );

    // @public {Property.<Vector2>} position of the second source
    this.unconstrainedMovablePositionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_2 );

    // @public {Property.<number>} vertical offset of second object with respect to first
    this.verticalOffsetProperty = new NumberProperty( verticalOffsetRange.defaultValue );

    // @public {EnumerationProperty.<SourceObjectRepresentation>}  representation of the source/object
    this.representationProperty = new EnumerationProperty( SourceObjectRepresentation, SourceObjectRepresentation.PENCIL );

    // @public {Property.<Vector2>} position of the movable point (source/object)
    this.movablePositionProperty =
      new DerivedProperty( [ this.positionProperty,
          this.verticalOffsetProperty,
          this.unconstrainedMovablePositionProperty,
          this.representationProperty ],
        ( position, verticalOffset, unconstrainedPosition, representation ) => {
          if ( representation.isObject ) {
            return position.plusXY( 0, verticalOffset );
          }
          else {
            return unconstrainedPosition;
          }
        } );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.representationProperty.reset();
    this.verticalOffsetProperty.reset();
    this.unconstrainedMovablePositionProperty.reset();
  }

  /**
   * Returns the position of the source
   * @returns {Vector2}
   * @public
   */
  getPosition() {
    return this.positionProperty.value;
  }

  /**
   * Sets the position of the source
   * @param {Vector2} position
   * @public
   */
  setPosition( position ) {
    this.positionProperty.value = position;
  }

  /**
   * Returns the representation of the source/object.
   * @returns {SourceObjectRepresentation}
   * @public
   */
  getRepresentation() {
    return this.representationProperty.value;
  }

  /**
   * Returns the upright object representation of the source/object.
   * @returns {Image}
   * @public
   */
  getRepresentationObjectUpright() {
    return this.representationProperty.value.objectUpright;
  }

  /**
   * Returns the inverted object representation of the source/object.
   * @returns {Image}
   * @public
   */
  getRepresentationObjectInverted() {
    return this.representationProperty.value.objectInverted;
  }

  /**
   * Returns the logo representation of the source/object.
   * @returns {Image}
   * @public
   */
  getRepresentationLogo() {
    return this.representationProperty.value.logo;
  }

  /**
   * Returns the logo representation of the source/object.
   * @returns {Image}
   * @public
   */
  getSecondSource() {
    return this.representationProperty.value.source;
  }

  /**
   * Returns true if the representation is an object (as opposed to a source).
   * @returns {boolean}
   * @public
   */
  isObject() {
    return this.representationProperty.value.isObject;
  }

  /**
   * Returns the inverted target representation of the source/object.
   * @returns {Image}
   * @public
   */
  getRepresentationTargetInverted() {
    return this.representationProperty.value.targetInverted;
  }

  /**
   * Returns the upright target representation of the source/object.
   * @returns {Image}
   * @public
   */
  getRepresentationTargetUpright() {
    return this.representationProperty.value.targetUpright;
  }

  /**
   * Sets the movable point
   * @param {Vector2} position
   * @public
   */
  setMovablePoint( position ) {
    if ( this.isObject() ) {
      const unconstrainedVerticalOffset = position.y - this.positionProperty.value.y;
      const verticalOffset = Utils.clamp( unconstrainedVerticalOffset, verticalOffsetRange.min, verticalOffsetRange.max );
      this.verticalOffsetProperty.value = verticalOffset;
    }
    else {
      this.unconstrainedMovablePositionProperty.value = position;
    }
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;
