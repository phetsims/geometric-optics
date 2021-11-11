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
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from './ProjectionScreen.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

// constants
const INTENSITY_RANGE = new Range( 0, 1 );
const FULL_INTENSITY_LIGHT_SPOT_HEIGHT = 7; // cm, any light spot less than this height will be full intensity

class LightSpot {

  // Shape of the light spot, based on its intersection with the projection screen.
  readonly shapeProperty: DerivedProperty<Shape>;

  // Intensity of this LightSpot, in the range [0,1],
  // null if there is no light spot hitting the projection screen
  readonly intensityProperty: DerivedProperty<number | null>;

  // Position of the center of the light spot, which may not be on the screen,
  // null if there is no light spot hitting the projection screen
  readonly positionProperty: DerivedProperty<Vector2 | null>;

  // Diameter of the light spot in the y dimensions,
  // null if there is no light spot hitting the projection screen
  readonly diameterProperty: DerivedProperty<number | null>;

  /**
   * @param {Optic} optic
   * @param {ProjectionScreen} projectionScreen
   * @param {Property.<Vector2>} sourcePositionProperty - position of the light source
   * @param {Property.<Vector2>} targetPositionProperty
   * @param {Object} [options]
   */
  constructor( optic: Optic, projectionScreen: ProjectionScreen, sourcePositionProperty: Property<Vector2>,
               targetPositionProperty: Property<Vector2>, options?: any ) { //TYPESCRIPT any

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    this.shapeProperty = new DerivedProperty<Shape>(
      [ optic.positionProperty, optic.diameterProperty, projectionScreen.positionProperty, sourcePositionProperty, targetPositionProperty ],
      ( opticPosition: Vector2, opticDiameter: number, projectionScreenPosition: Vector2, sourcePosition: Vector2, targetPosition: Vector2 ) =>
        getLightSpotShape( optic, projectionScreenPosition, sourcePosition, targetPosition, projectionScreen.getScreenShapeTranslated() )
    );

    this.intensityProperty = new DerivedProperty<number | null>( [ this.shapeProperty ],
      ( shape: Shape ) => {
        if ( shape.getArea() === 0 ) {
          return null;
        }
        else {
          return getIntensity( optic, projectionScreen.positionProperty.value,
            sourcePositionProperty.value, targetPositionProperty.value );
        }
      }, {
        isValidValue: ( value: number ) => INTENSITY_RANGE.contains( value ),
        tandem: options.tandem.createTandem( 'intensityProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'intensity of the light hitting the screen, in the range [0,1], ' +
                             'null if the light is not hitting the screen'
      } );

    this.positionProperty = new DerivedProperty<Vector2 | null>( [ this.shapeProperty ],
      ( shape: Shape ) => {
        if ( shape.getArea() === 0 ) {
          return null;
        }
        else {
          return getDiskParameters( optic, projectionScreen.positionProperty.value,
            sourcePositionProperty.value, targetPositionProperty.value ).position;
        }
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( Vector2.Vector2IO ) ),
        phetioDocumentation: 'position of the center of the light spot (which may not be on the screen), ' +
                             'null if the light is not hitting the screen'
      } );

    this.diameterProperty = new DerivedProperty<number | null>( [ this.shapeProperty ],
      ( shape: Shape ) => {
        if ( shape.getArea() === 0 ) {
          return null;
        }
        else {
          const radius = getDiskParameters( optic, projectionScreen.positionProperty.value,
            sourcePositionProperty.value, targetPositionProperty.value ).radiusY;
          return 2 * radius;
        }
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'diameterProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'diameter (in the y dimension) of the light spot, null if the light is not hitting the screen'
      } );
  }
}

/**
 * Gets the shape that results from the intersection of the light spot and the projection screen.
 * @param {Optic} optic
 * @param {Vector2} projectionScreenPosition
 * @param {Vector2} sourcePosition
 * @param {Vector2} targetPosition
 * @param {Shape} screenShape
 * @returns {Shape}
 */
function getLightSpotShape( optic: Optic, projectionScreenPosition: Vector2, sourcePosition: Vector2,
                                targetPosition: Vector2, screenShape: Shape ) {

  // unclipped elliptical disk shape
  const ellipseShape = getEllipseShape( optic, projectionScreenPosition, sourcePosition, targetPosition );

  //TODO should not have to do this check
  if ( ellipseShape.getArea() === 0 ) {
    return new Shape();
  }
  else {
    return Graph.binaryResult( screenShape, ellipseShape, Graph.BINARY_NONZERO_INTERSECTION );
  }
}

/**
 * Returns the shape of the unclipped shape of the light spot.
 * @param {Optic} optic
 * @param {Vector2} projectionScreenPosition
 * @param {Vector2} sourcePosition
 * @param {Vector2} targetPosition
 * @returns {Shape}
 */
function getEllipseShape( optic: Optic, projectionScreenPosition: Vector2, sourcePosition: Vector2, targetPosition: Vector2 ) {

  // get the parameters for the unclipped light spot.
  const {
    position, radiusX, radiusY
  } = getDiskParameters( optic, projectionScreenPosition, sourcePosition, targetPosition );

  // return an ellipse with the shape parameters
  return Shape.ellipse( position.x, position.y, radiusX, radiusY, 2 * Math.PI );
}

/**
 * Gets the physical parameters (center position and radii) for the LightSpot
 * @param {Optic} optic
 * @param {Vector2} projectionScreenPosition
 * @param {Vector2} sourcePosition
 * @param {Vector2} targetPosition
 * @returns {position:Vector2, radiusX:number, radiusY: number}
 */
function getDiskParameters( optic: Optic, projectionScreenPosition: Vector2, sourcePosition: Vector2, targetPosition: Vector2 ) {

  // get the extrema points on the optic
  const opticTopPoint = optic.getTopPoint( sourcePosition, targetPosition );
  const opticBottomPoint = optic.getBottomPoint( sourcePosition, targetPosition );

  // determine the top and bottom position of the unclipped disk
  const diskTopPosition = getIntersectionPosition( projectionScreenPosition, opticTopPoint, targetPosition );
  const diskBottomPosition = getIntersectionPosition( projectionScreenPosition, opticBottomPoint, targetPosition );

  // determine the position and y radius of the disk
  const diskCenterPosition = diskTopPosition.average( diskBottomPosition );
  const radiusY = diskTopPosition.distance( diskBottomPosition ) / 2;

  // arbitrarily set the aspect ratio ot 1/2 to give 3D perspective
  const radiusX = radiusY / 2;  //TODO factor out ASPECT_RATIO? Is it used elsewhere?

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
 * @param {Optic} optic
 * @param {Vector2} projectionScreenPosition
 * @param {Vector2} sourcePosition
 * @param {Vector2} targetPosition
 * @returns {number} a value in INTENSITY_RANGE
 */
function getIntensity( optic: Optic, projectionScreenPosition: Vector2, sourcePosition: Vector2, targetPosition: Vector2 ) {

  // {number} vertical radius of the unclipped light spot
  const { radiusY } = getDiskParameters( optic, projectionScreenPosition, sourcePosition, targetPosition );

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
 * This is determined by extrapolating the point from the target point onto the projection screen.
 * @param {Vector2} projectionScreenPosition
 * @param {Vector2} point
 * @param {Vector2} targetPosition
 * @returns {Vector2}
 */
function getIntersectionPosition( projectionScreenPosition: Vector2, point: Vector2, targetPosition: Vector2 ) {
  const blend = getRatio( projectionScreenPosition, point, targetPosition );
  return point.blend( targetPosition, blend );
}

/**
 * Gets ratio of the distance of the screen/ target measure from the optic.
 * @param {Vector2} projectionScreenPosition
 * @param {Vector2} opticPosition
 * @param {Vector2} targetPosition
 * @returns {number}
 */
function getRatio( projectionScreenPosition: Vector2, opticPosition: Vector2, targetPosition: Vector2 ) {
  const targetOpticDistance = ( targetPosition.x - opticPosition.x );

  // avoid division by zero
  if ( targetOpticDistance === 0 ) {
    return 10e6; // This should technically be Infinity, but practically must be a (very large) finite value.
  }
  else {
    return ( projectionScreenPosition.x - opticPosition.x ) / targetOpticDistance;
  }
}

geometricOptics.register( 'LightSpot', LightSpot );
export default LightSpot;