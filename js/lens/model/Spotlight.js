// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the spotlight. Responsible for the shape of the spotlight (cropped to the screen shape)
 * and its light intensity
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';

const OPTICAL_ELEMENT_TIP_OFFSET = GeometricOpticsConstants.OPTICAL_ELEMENT_TIP_OFFSET;
const FULL_BRIGHT_SPOT_HEIGHT = GeometricOpticsConstants.FULL_BRIGHT_SPOT_HEIGHT;

class Spotlight {

  /**
   * @param {Property.<Vector2>} screenPositionProperty
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<number>} opticDiameterProperty
   * @param {Property.<Vector2>} targetImagePositionProperty
   * @param {function} getScreenShape - returns the shape of the screen {Shape}
   * @param {Tandem} tandem
   */
  constructor( screenPositionProperty,
               opticPositionProperty,
               opticDiameterProperty,
               targetImagePositionProperty,
               getScreenShape,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    this.getScreenShape = getScreenShape;

    // determine the intersection of the screen and spotlight
    // @public (read-only) {Property.<Shape>}
    this.shapeProperty = new DerivedProperty( [
        screenPositionProperty,
        opticPositionProperty,
        opticDiameterProperty,
        targetImagePositionProperty ],
      ( screenPosition, opticPosition, opticDiameter, targetPosition ) => {
        return this.getIntersection( screenPosition, opticPosition, opticDiameter, targetPosition );
      } );

    // determine the light intensity of the spot
    // a number ranging from 0 to 1
    // @public (read-only) {Property.<number>}
    this.intensityProperty = new DerivedProperty( [
        screenPositionProperty,
        opticPositionProperty,
        opticDiameterProperty,
        targetImagePositionProperty ],
      ( screenPosition, opticPosition, opticDiameter, targetPosition ) => {
        return this.getLightIntensity( screenPosition, opticPosition, opticDiameter, targetPosition );
      } );

  }

  /**
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {number}
   */
  getDiskRadius( screenPosition, opticPosition, opticDiameter, targetPosition ) {

    // ratio of the distance of the screen/ target measure from the optic.
    const blend = ( screenPosition.x - opticPosition.x ) / ( targetPosition.x - opticPosition.x );

    const
      topMarginalPosition = opticPosition.plusXY( 0, opticDiameter / 2 ).blend( targetPosition, blend );
    const
      bottomMarginalPosition = opticPosition.minusXY( 0, opticDiameter / 2 ).blend( targetPosition, blend );

    return Math.abs( ( topMarginalPosition.minus( bottomMarginalPosition ) ).y ) / 2;
  }

  /**
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {Vector2} targetPosition
   * @returns {Vector2}
   */
  getDiskPosition( screenPosition, opticPosition, targetPosition ) {
    const blend = ( screenPosition.x - opticPosition.x ) / ( targetPosition.x - opticPosition.x );

    return opticPosition.blend( targetPosition, blend );
  }

  /**
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {Shape}
   */
  getDiskShape( screenPosition, opticPosition, opticDiameter, targetPosition ) {
    const diskPosition = this.getDiskPosition( screenPosition, opticPosition, targetPosition );

    const radiusY = this.getDiskRadius( screenPosition, opticPosition, opticDiameter - OPTICAL_ELEMENT_TIP_OFFSET, targetPosition );

    // ellipse width is half the height to give an approximation of 3D effect
    const radiusX = 1 / 2 * radiusY;
    return Shape.ellipse( diskPosition.x, diskPosition.y, radiusX, radiusY, 2 * Math.PI );
  }

  /**
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {Shape}
   */
  getIntersection( screenPosition, opticPosition, opticDiameter, targetPosition ) {
    return Shape.intersection(
      [ this.getDiskShape( screenPosition, opticPosition, opticDiameter, targetPosition ),
        this.getScreenShape() ] );
  }

  /**
   * get the normalized (between 0 and 1) light intensity of the spotlight
   * Physically, a spotlight is dimmer when the light is spread on a larger surface.
   * To preserve dynamic range, the spotlight is instead inversely proportional to the diameter of the spotlight.
   *
   * The value for the intensity saturates to 1 for a spotlight height smaller than FULL_BRIGHT_SPOT_HEIGHT
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {number} a value between 0 and 1
   */
  getLightIntensity( screenPosition, opticPosition, opticDiameter, targetPosition ) {

    // get the height of spotlight
    const spotlightHeight = 2 * this.getDiskRadius( screenPosition, opticPosition, opticDiameter, targetPosition );

    // intensity saturates to 1 for a spotlight height less than FULL_BRIGHT_SPOT_HEIGHT
    return Math.min( 1, FULL_BRIGHT_SPOT_HEIGHT / spotlightHeight );
  }

}

geometricOptics.register( 'Spotlight', Spotlight );
export default Spotlight;
