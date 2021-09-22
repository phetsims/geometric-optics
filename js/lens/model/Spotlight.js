// Copyright 2021, University of Colorado Boulder

/**
 * Spotlight is the model of the light that hits the projector screen.
 * Responsible for the shape of the spotlight (cropped to the screen shape) and the light intensity.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Graph from '../../../../kite/js/ops/Graph.js';
import Shape from '../../../../kite/js/Shape.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectorScreen from './ProjectorScreen.js';

class Spotlight {

  /**
   * @param {Property.<Vector2>} sourcePositionProperty
   * @param {Property.<Vector2>} targetPositionProperty
   * @param {ProjectorScreen} projectorScreen
   * @param {Optic} optic
   */
  constructor( sourcePositionProperty, targetPositionProperty, projectorScreen, optic ) {

    assert && assert( sourcePositionProperty instanceof Property );
    assert && assert( targetPositionProperty instanceof Property );
    assert && assert( projectorScreen instanceof ProjectorScreen );
    assert && assert( optic instanceof Optic );

    // @private {Property.<Vector2>} position of the source of light
    this.sourcePositionProperty = sourcePositionProperty;

    // @private {Optic} model for the optic
    this.optic = optic;

    // @private {function}
    this.projectorScreen = projectorScreen;

    // @public {DerivedProperty.<Shape>} intersection of this spotlight with the screen
    this.screenIntersectionProperty = new DerivedProperty(
      [ projectorScreen.positionProperty, optic.positionProperty, optic.diameterProperty, targetPositionProperty ],
      ( screenPosition, opticPosition, opticDiameter, targetPosition ) =>
        this.getIntersection( screenPosition, opticPosition, opticDiameter, targetPosition )
    );

    // @public {DerivedProperty.<number>}
    // determine the light intensity of the spot, a number ranging from 0 to 1
    this.intensityProperty = new DerivedProperty(
      [ projectorScreen.positionProperty, optic.positionProperty, optic.diameterProperty, targetPositionProperty ],
      ( screenPosition, opticPosition, opticDiameter, targetPosition ) =>
        this.getLightIntensity( screenPosition, opticPosition, opticDiameter, targetPosition )
    );
  }

  /**
   * Gets ratio of the distance of the screen/ target measure from the optic.
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {Vector2} targetPosition
   * @returns {number}
   */
  getRatio( screenPosition, opticPosition, targetPosition ) {
    const targetOpticDistance = ( targetPosition.x - opticPosition.x );

    // avoid division by zero
    if ( targetOpticDistance === 0 ) {

      // a really large number, technically should be infinity
      //TODO ... then why not use Infinity?
      return 10e6;
    }
    else {
      return ( screenPosition.x - opticPosition.x ) / targetOpticDistance;
    }
  }

  /**
   * Gets the physical parameters (center position and radii) for the spotlight
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {Object} - see below
   */
  getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition ) {
    assert && assert( screenPosition instanceof Vector2 );
    assert && assert( opticPosition instanceof Vector2 );
    assert && assert( typeof opticDiameter === 'number' && isFinite( opticDiameter ) && opticDiameter > 0 );
    assert && assert( targetPosition instanceof Vector2 );

    // get the extremum points on the optic
    const extremumTopOpticPoint = this.optic.getExtremumPoint( this.sourcePositionProperty.value, targetPosition,
      { location: Optic.Location.TOP } );
    const extremumBottomOpticPoint = this.optic.getExtremumPoint( this.sourcePositionProperty.value, targetPosition,
      { location: Optic.Location.BOTTOM } );

    // determine the top and bottom position of the unclipped disk
    const diskTopPosition = this.getIntersectPosition( screenPosition, extremumTopOpticPoint, targetPosition );
    const diskBottomPosition = this.getIntersectPosition( screenPosition, extremumBottomOpticPoint, targetPosition );

    // determine the position and y radius of the disk
    const diskCenterPosition = diskTopPosition.average( diskBottomPosition );
    const radiusY = diskTopPosition.distance( diskBottomPosition ) / 2;

    // arbitrarily set the aspect ratio ot 1/2 to give 3D perspective
    const radiusX = radiusY / 2;

    return {
      position: diskCenterPosition,
      radiusY: radiusY,
      radiusX: radiusX
    };
  }

  /**
   * Gets the projected position on the screen of a point.
   * this is determined by extrapolating the point from the target point onto the projector screen.
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
   * Returns the shape of the unclipped spotlight
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
      position, radiusX, radiusY
    } = this.getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition );

    // return an ellipse with the shape parameters
    return Shape.ellipse( position.x, position.y, radiusX, radiusY, 2 * Math.PI );
  }

  /**
   * Gets the shape that result from the intersection of the disk and screen projector
   * @private
   * @param {Vector2} screenPosition
   * @param {Vector2} opticPosition
   * @param {number} opticDiameter
   * @param {Vector2} targetPosition
   * @returns {Shape}
   */
  getIntersection( screenPosition, opticPosition, opticDiameter, targetPosition ) {

    // translated screen shape
    const screenShape = this.projectorScreen.getScreenShape();

    // unclipped elliptical disk shape
    const diskShape = this.getDiskShape( screenPosition, opticPosition, opticDiameter, targetPosition );

    assert && assert( screenShape instanceof Shape, 'screenShape is not a Shape' );
    assert && assert( diskShape instanceof Shape, 'diskShape is not a Shape' );

    // it should NOT be necessary to weed out the zero shape, see #
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
   * Gets the normalized (between 0 and 1) light intensity of the spotlight
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

    // avoid division by zero
    if ( spotlightHeight === 0 ) {

      // maximum intensity
      return 1;
    }
    else {

      // intensity saturates to 1 for a spotlight height less than FULL_BRIGHT_SPOT_HEIGHT
      return Math.min( 1, GeometricOpticsConstants.FULL_BRIGHT_SPOT_HEIGHT / spotlightHeight );
    }
  }
}

geometricOptics.register( 'Spotlight', Spotlight );
export default Spotlight;