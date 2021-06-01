// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the spotlight.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';

const OPTICAL_ELEMENT_TIP_OFFSET = GeometricOpticsConstants.OPTICAL_ELEMENT_TIP_OFFSET;
const MASK_CORNERS = GeometricOpticsConstants.MASK_CORNERS;

class Spotlight {

  /**
   * @param {Vector2Property} screenPositionProperty
   * @param {Optic} optic
   * @param {Vector2Property} targetImagePositionProperty
   * @param {Tandem} tandem
   */
  constructor( screenPositionProperty, optic, targetImagePositionProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // determine the intersection of the screen and spotlight
    // @public (read-only) {Property.<Shape>}
    this.shapeProperty = new DerivedProperty( [
      screenPositionProperty,
      optic.positionProperty,
      optic.diameterProperty,
      targetImagePositionProperty ], (
      screenPosition, opticPosition, opticDiameter, targetPosition
    ) => {
      return this.getIntersection( screenPosition, opticPosition, opticDiameter, targetPosition );
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
   * @returns {Shape}
   */
  getScreenShape( screenPosition ) {
    const leftTop = screenPosition.plus( MASK_CORNERS.LEFT_TOP );
    const leftBottom = screenPosition.plus( MASK_CORNERS.LEFT_BOTTOM );
    const rightBottom = screenPosition.plus( MASK_CORNERS.RIGHT_BOTTOM );
    const rightTop = screenPosition.plus( MASK_CORNERS.RIGHT_TOP );
    return new Shape()
      .moveToPoint( leftTop )
      .lineToPoint( leftBottom )
      .lineToPoint( rightBottom )
      .lineToPoint( rightTop )
      .close();
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
    const radiusX = 1 / 2 * radiusY;
    return Shape.ellipse( diskPosition, radiusX, radiusY, 2 * Math.PI );
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
        this.getScreenShape( screenPosition ) ] );
  }
}

geometricOptics.register( 'Spotlight', Spotlight );
export default Spotlight;
