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

const DEFAULT_SOURCE_POINT_1 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1;
const DEFAULT_SOURCE_POINT_2 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2;

class SourceObject {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} position of the source
    this.positionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_1 );

    // @public {Property.<Vector2>} position of the movable point
    this.movablePositionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_2 );

    // @public {EnumerationProperty.<SourceObjectRepresentation>}  type of the image used as a representation of the object
    this.representationProperty = new EnumerationProperty( SourceObjectRepresentation, SourceObjectRepresentation.PENCIL );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.movablePositionProperty.reset();
    this.representationProperty.reset();
  }

  /**
   * Sets position of the movable point.
   * @param {Vector2} location
   * @public
   */
  setMovablePoint( location ) {
    this.movablePositionProperty.value = location;
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
   * Returns the vertical offset of the movable position with respect to the source/object.
   * @returns {number}
   * @public
   */
  getVerticalOffset() {
    return this.movablePositionProperty.value.y - this.positionProperty.value.y;
  }

  /**
   * Sets the vertical offset of the movable position with respect to the source/object.
   * @returns {Vector2}
   * @public
   */
  clampVerticalOffset( verticalOffset ) {
    const min = -0.5;
    const max = 0.0;
    const yConstrained = Utils.clamp( verticalOffset, min, max );
    const yValue = this.positionProperty.value.y + yConstrained;
    this.movablePositionProperty.value.setY( yValue );
    this.movablePositionProperty.value.setX( this.positionProperty.value.x );
  }

  /**
   * Returns the position of the movable point
   * @returns {Vector2}
   * @public
   */
  getMovablePosition() {
    return this.movablePositionProperty.value;
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;
