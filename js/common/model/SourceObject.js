// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the source or object
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

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

    // @public {EnumerationProperty.<Types>}  type of the image used as a representation of the object
    this.typeProperty = new EnumerationProperty( SourceObject.Types, SourceObject.Types.IMAGE_1 );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.movablePositionProperty.reset();
    this.typeProperty.reset();
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
   * Returns the position of the movable point
   * @returns {Vector2}
   * @public
   */
  getMovablePosition() {
    return this.movablePositionProperty.value;
  }
}

// Enumeration for the different types of source images
// IMAGE 1 to 4 are objects.
// LIGHT is a projector lamp, a source of light.
SourceObject.Types = Enumeration.byKeys( [
  'IMAGE_1',
  'IMAGE_2',
  'IMAGE_3',
  'IMAGE_4',
  'LIGHT'
] );
geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;
