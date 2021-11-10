// Copyright 2021, University of Colorado Boulder

/**
 * LightSpot is the model of the light spot that hits the projection screen.
 * Responsible for the shape of the spot (cropped to the screen shape) and the light intensity.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Graph from '../../../../kite/js/ops/Graph.js';
import Shape from '../../../../kite/js/Shape.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from './ProjectionScreen.js';

// constants
const INTENSITY_RANGE = new Range( 0, 1 );
const FULL_INTENSITY_LIGHT_SPOT_HEIGHT = 7; // cm, any light spot less than this height will be full intensity

class LightSpot {

  // intersection of this LightSpot with the projection screen
  readonly screenIntersectionProperty: DerivedProperty<Shape>;

  // intensity of this LightSpot
  readonly intensityProperty: DerivedProperty<number>;

  /**
   * @param {ProjectionScreen} projectionScreen
   * @param {Optic} optic
   * @param {Property.<Vector2>} sourcePositionProperty - position of the light source
   * @param {Property.<Vector2>} targetPositionProperty
   */
  constructor( projectionScreen: ProjectionScreen, optic: Optic, sourcePositionProperty: Property<Vector2>,
               targetPositionProperty: Property<Vector2> ) {

    this.screenIntersectionProperty = new DerivedProperty<Shape>(
      [ projectionScreen.positionProperty, optic.positionProperty, optic.diameterProperty, targetPositionProperty, sourcePositionProperty ],
      ( screenPosition: Vector2, opticPosition: Vector2, opticDiameter: number, targetPosition: Vector2, sourcePosition: Vector2 ) =>
        getScreenIntersection( screenPosition, opticPosition, opticDiameter, targetPosition, optic, sourcePosition, projectionScreen.getScreenShapeTranslated() )
    );

    this.intensityProperty = new DerivedProperty<number>(
      [ projectionScreen.positionProperty, optic.positionProperty, optic.diameterProperty, targetPositionProperty, sourcePositionProperty ],
      ( screenPosition: Vector2, opticPosition: Vector2, opticDiameter: number, targetPosition: Vector2, sourcePosition: Vector2 ) =>
        getLightIntensity( screenPosition, opticPosition, opticDiameter, targetPosition, optic, sourcePosition ), {
        isValidValue: ( value: number ) => INTENSITY_RANGE.contains( value )
      } );
  }
}

/**
 * Gets the shape that results from the intersection of the light spot and the projection screen.
 * @param {Vector2} screenPosition
 * @param {Vector2} opticPosition
 * @param {number} opticDiameter
 * @param {Vector2} targetPosition
 * @param {Optic} optic
 * @param {Vector2} sourcePosition
 * @param {Shape} screenShape
 * @returns {Shape}
 */
function getScreenIntersection( screenPosition: Vector2, opticPosition: Vector2, opticDiameter: number,
                                targetPosition: Vector2, optic: Optic, sourcePosition: Vector2, screenShape: Shape ) {

  // unclipped elliptical disk shape
  const diskShape = getDiskShape( screenPosition, opticPosition, opticDiameter, targetPosition, optic, sourcePosition );

  //TODO it should NOT be necessary to weed out the zero shape, see #
  if ( diskShape.getArea() === 0 ) {
    return new Shape();
  }
  else {
    return Graph.binaryResult( screenShape, diskShape, Graph.BINARY_NONZERO_INTERSECTION );
  }
}

/**
 * Returns the shape of the unclipped shape of the light spot.
 * @param {Vector2} screenPosition
 * @param {Vector2} opticPosition
 * @param {number} opticDiameter
 * @param {Vector2} targetPosition
 * @param {Optic} optic
 * @param {Vector2} sourcePosition
 * @returns {Shape}
 */
function getDiskShape( screenPosition: Vector2, opticPosition: Vector2, opticDiameter: number,
                       targetPosition: Vector2, optic: Optic, sourcePosition: Vector2 ) {

  // get the parameters for the unclipped light spot.
  const {
    position, radiusX, radiusY
  } = getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition, optic, sourcePosition );

  // return an ellipse with the shape parameters
  return Shape.ellipse( position.x, position.y, radiusX, radiusY, 2 * Math.PI );
}

/**
 * Gets the physical parameters (center position and radii) for the LightSpot
 * @param {Vector2} screenPosition
 * @param {Vector2} opticPosition
 * @param {number} opticDiameter
 * @param {Vector2} targetPosition
 * @param {Optic} optic
 * @param {Vector2} sourcePosition
 * @returns {position:Vector2, radiusX:number, radiusY: number}
 */
function getDiskParameters( screenPosition: Vector2, opticPosition: Vector2, opticDiameter: number,
                            targetPosition: Vector2, optic: Optic, sourcePosition: Vector2 ) {
  assert && assert( isFinite( opticDiameter ) && opticDiameter > 0 );

  // get the extrema points on the optic
  const opticTopPoint = optic.getTopPoint( sourcePosition, targetPosition );
  const opticBottomPoint = optic.getBottomPoint( sourcePosition, targetPosition );

  // determine the top and bottom position of the unclipped disk
  const diskTopPosition = getIntersectPosition( screenPosition, opticTopPoint, targetPosition );
  const diskBottomPosition = getIntersectPosition( screenPosition, opticBottomPoint, targetPosition );

  // determine the position and y radius of the disk
  const diskCenterPosition = diskTopPosition.average( diskBottomPosition );
  const radiusY = diskTopPosition.distance( diskBottomPosition ) / 2;

  // arbitrarily set the aspect ratio ot 1/2 to give 3D perspective
  const radiusX = radiusY / 2;

  return {
    position: diskCenterPosition,
    radiusX: radiusX,
    radiusY: radiusY
  };
}

/**
 * Gets the normalized (between 0 and 1) light intensity of the light spot.
 * Physically, the spot is dimmer when the light is spread on a larger surface.
 * To preserve dynamic range, the spot is instead inversely proportional to the diameter.
 * The value saturates to max intensity for a spot height smaller than FULL_BRIGHT_SPOT_HEIGHT
 * @param {Vector2} screenPosition
 * @param {Vector2} opticPosition
 * @param {number} opticDiameter
 * @param {Vector2} targetPosition
 * @param {Optic} optic
 * @param {Vector2} sourcePosition
 * @returns {number} a value in INTENSITY_RANGE
 */
function getLightIntensity( screenPosition: Vector2, opticPosition: Vector2, opticDiameter: number,
                            targetPosition: Vector2, optic: Optic, sourcePosition: Vector2 ) {

  // {number} vertical radius of the unclipped light spot
  const { radiusY } = getDiskParameters( screenPosition, opticPosition, opticDiameter, targetPosition, optic, sourcePosition );

  let intensity;
  if ( radiusY === 0 ) {

    // avoid division by zero
    intensity = INTENSITY_RANGE.max;
  }
  else {

    // Saturates to max intensity for a spot height less than FULL_INTENSITY_LIGHT_SPOT_HEIGHT.
    const spotHeight = 2 * radiusY;
    intensity = INTENSITY_RANGE.constrainValue( FULL_INTENSITY_LIGHT_SPOT_HEIGHT / spotHeight );
  }
  assert && assert( INTENSITY_RANGE.contains( intensity ) );
  return intensity;
}

/**
 * Gets the projected position on the screen of a point.
 * this is determined by extrapolating the point from the target point onto the projection screen.
 * @param {Vector2} screenPosition
 * @param {Vector2} point
 * @param {Vector2} targetPosition
 * @returns {Vector2}
 */
function getIntersectPosition( screenPosition: Vector2, point: Vector2, targetPosition: Vector2 ) {
  const blend = getRatio( screenPosition, point, targetPosition );
  return point.blend( targetPosition, blend );
}

/**
 * Gets ratio of the distance of the screen/ target measure from the optic.
 * @param {Vector2} screenPosition
 * @param {Vector2} opticPosition
 * @param {Vector2} targetPosition
 * @returns {number}
 */
function getRatio( screenPosition: Vector2, opticPosition: Vector2, targetPosition: Vector2 ) {
  const targetOpticDistance = ( targetPosition.x - opticPosition.x );

  // avoid division by zero
  if ( targetOpticDistance === 0 ) {
    return 10e6; // This should technically be Infinity, but practically must be a (very large) finite value.
  }
  else {
    return ( screenPosition.x - opticPosition.x ) / targetOpticDistance;
  }
}

geometricOptics.register( 'LightSpot', LightSpot );
export default LightSpot;