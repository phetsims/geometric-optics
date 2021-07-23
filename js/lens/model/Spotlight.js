// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the spotlight. Responsible for the shape of the spotlight (cropped to the screen shape)
 * and its light intensity
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Graph from '../../../../kite/js/ops/Graph.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

const FULL_BRIGHT_SPOT_HEIGHT = GeometricOpticsConstants.FULL_BRIGHT_SPOT_HEIGHT;

class Spotlight {

  /**
   * @param {Property.<Vector2>} sourcePositionProperty
   * @param {Property.<Vector2>} screenPositionProperty
   * @param {Property.<Vector2>} targetPositionProperty
   * @param {Optic} optic
   * @param {function} getScreenShape - returns the shape of the screen {Shape}
   * @param {Tandem} tandem
   */
  constructor( sourcePositionProperty,
               screenPositionProperty,
               targetPositionProperty,
               optic,
               getScreenShape,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @private
    this.getScreenShape = getScreenShape;

    this.optic = optic;

    this.sourcePositionProperty = sourcePositionProperty;

    // determine the intersection of the screen and spotlight
    // @public (read-only) {Property.<Shape>}
    this.shapeProperty = new DerivedProperty( [
        screenPositionProperty,
        optic.positionProperty,
        optic.diameterProperty,
        targetPositionProperty ],
      ( screenPosition, opticPosition, opticDiameter, targetPosition ) => {
        return this.getIntersection( screenPosition, opticPosition, opticDiameter, targetPosition );
      } );

    // determine the light intensity of the spot
    // a number ranging from 0 to 1
    // @public (read-only) {Property.<number>}
    this.intensityProperty = new DerivedProperty( [
        screenPositionProperty,
        optic.positionProperty,
        optic.diameterProperty,
        targetPositionProperty ],
      ( screenPosition, opticPosition, opticDiameter, targetPosition ) => {
        return this.getLightIntensity( screenPosition, opticPosition, opticDiameter, targetPosition );
      } );

  }


  /**
   * get ratio of the distance of the screen/ target measure from the optic.
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {Vector2} targetPosition
   * @returns {number}
   */
  getRatio( screenPosition, opticPosition, targetPosition ) {
    const targetOpticDistance = ( targetPosition.x - opticPosition.x );

    if ( targetOpticDistance === 0 ) {

      // a really large number to prevent infinity
      return 10e6;
    }
    else {
      return ( screenPosition.x - opticPosition.x ) / targetOpticDistance;
    }
  }

  /**
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {Object}
   */
  getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition ) {


    const extremumTopOpticPoint = this.optic.getExtremumPoint( this.sourcePositionProperty.value, targetPosition, { location: Optic.Location.TOP } );
    const extremumBottomOpticPoint = this.optic.getExtremumPoint( this.sourcePositionProperty.value, targetPosition, { location: Optic.Location.BOTTOM } );

    const diskTopPosition = this.getIntersectPosition( screenPosition, extremumTopOpticPoint, targetPosition );
    const diskBottomPosition = this.getIntersectPosition( screenPosition, extremumBottomOpticPoint, targetPosition );

    const diskCenterPosition = diskTopPosition.average( diskBottomPosition );
    const radiusY = diskTopPosition.distance( diskBottomPosition ) / 2;
    const radiusX = radiusY / 2;

    return {
      position: diskCenterPosition,
      radiusY: radiusY,
      radiusX: radiusX
    };
  }

  /**
   * get the projected position on the screen of a point.
   * this is determined by extrapolating the point from the target point onto the projector screen.
   *
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} point
   * @param {Vector2} targetPosition
   * @returns {Vector2}
   */
  getIntersectPosition( screenPosition, point, targetPosition ) {
    const blend = this.getRatio( screenPosition, point, targetPosition );

    return point.blend( targetPosition, blend );
  }

  /**
   * returns the shape of the unclipped spotlight
   *
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {Shape}
   */
  getDiskShape( screenPosition, opticPosition, opticDiameter, targetPosition ) {

    // get the parameters for the unclipped spotlight.
    const {
      position,
      radiusX,
      radiusY
    } = this.getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition );

    return Shape.ellipse( position.x, position.y, radiusX, radiusY, 2 * Math.PI );
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

    // translated screen shape
    const screenShape = this.getScreenShape();

    // unclipped elliptical disk shape
    const diskShape = this.getDiskShape( screenPosition, opticPosition, opticDiameter, targetPosition );

    assert && assert( screenShape instanceof Shape, 'screenShape is not a Shape' );
    assert && assert( diskShape instanceof Shape, 'diskShape is not a Shape' );

    if ( diskShape.getArea() === 0 ) {

      // empty shape
      return new Shape();
    }
    else {

      // find the intersection of the two shapes
      return Graph.binaryResult( screenShape, diskShape, Graph.BINARY_NONZERO_INTERSECTION );
    }
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

    // {number} vertical radius of the unclipped spotlight
    const { radiusY } = this.getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition );

    // get the height of spotlight
    const spotlightHeight = 2 * radiusY;

    if ( spotlightHeight === 0 ) {
      // maximum intensity

      return 1;
    }
    else {
      // intensity saturates to 1 for a spotlight height less than FULL_BRIGHT_SPOT_HEIGHT
      return Math.min( 1, FULL_BRIGHT_SPOT_HEIGHT / spotlightHeight );
    }
  }
}

geometricOptics.register( 'Spotlight', Spotlight );
export default Spotlight;
