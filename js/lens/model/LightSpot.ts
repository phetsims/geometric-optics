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
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';

// constants
const FULL_INTENSITY_DIAMETER = 7; // cm, any light spot less than this diameter will be full intensity

type PositionAndDiameter = { position: Vector2, diameter: number };

class LightSpot {

  // Shape of the light spot, based on its intersection with the projection screen.
  // If the spot does not intersect the screen, the value will be a Shape with zero area.
  readonly shapeProperty: DerivedProperty<Shape>;

  // Intensity of the light spot, in the range [0,1],
  // null if there is no light spot hitting the projection screen
  readonly intensityProperty: DerivedProperty<number | null>;

  // Position of the center of the light spot, which may not be on the screen,
  // null if there is no light spot hitting the projection screen
  readonly positionProperty: DerivedProperty<Vector2 | null>;

  // Diameter of the light spot in the y dimension,
  // null if there is no light spot hitting the projection screen
  readonly diameterProperty: DerivedProperty<number | null>;

  /**
   * @param optic
   * @param projectionScreen
   * @param sourcePositionProperty - position of the light source
   * @param targetPositionProperty
   * @param options
   */
  constructor( optic: Optic, projectionScreen: ProjectionScreen, sourcePositionProperty: Property<Vector2>,
               targetPositionProperty: Property<Vector2>, options?: any ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    this.shapeProperty = new DerivedProperty<Shape>(
      [ optic.positionProperty, optic.diameterProperty, projectionScreen.positionProperty, sourcePositionProperty, targetPositionProperty ],
      ( opticPosition: Vector2, opticDiameter: number, projectionScreenPosition: Vector2, sourcePosition: Vector2, targetPosition: Vector2 ) =>
        getLightSpotShape( optic, projectionScreenPosition, sourcePosition, targetPosition, projectionScreen.getScreenShapeTranslated() )
    );

    const positionAndDiameterProperty = new DerivedProperty<PositionAndDiameter | null>( [ this.shapeProperty ],
      ( shape: Shape ) =>
        ( shape.getArea() === 0 ) ? null :
        getPositionAndDiameter( optic, projectionScreen.positionProperty.value, sourcePositionProperty.value, targetPositionProperty.value )
    );

    this.positionProperty = new DerivedProperty<Vector2 | null>( [ positionAndDiameterProperty ],
      ( positionAndDiameter: PositionAndDiameter | null ) =>
        ( positionAndDiameter === null ) ? null : positionAndDiameter.position, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( Vector2.Vector2IO ) ),
        phetioDocumentation: 'position of the center of the light spot (which may not be on the screen), ' +
                             'null if the light is not hitting the screen'
      } );

    this.diameterProperty = new DerivedProperty<number | null>( [ positionAndDiameterProperty ],
      ( positionAndDiameter: PositionAndDiameter | null ) =>
        ( positionAndDiameter === null ) ? null : positionAndDiameter.diameter, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'diameterProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'diameter (in the y dimension) of the light spot, null if the light is not hitting the screen'
      } );

    // The normalized intensity of the light spot, in the range [0,1].
    // Physically, the spot is dimmer when the light is spread on a larger surface.
    // To preserve dynamic range, the intensity is instead inversely proportional to the diameter.
    // The value saturates to max intensity for a spot height smaller than FULL_BRIGHT_SPOT_HEIGHT
    this.intensityProperty = new DerivedProperty<number | null>( [ this.diameterProperty ],
      ( diameter: number | null ) => ( diameter === null || diameter === 0 ) ? null :
                                     GeometricOpticsConstants.INTENSITY_RANGE.constrainValue( FULL_INTENSITY_DIAMETER / diameter ), {
        isValidValue: ( value: number | null ) => ( value === null ) || GeometricOpticsConstants.INTENSITY_RANGE.contains( value ),
        tandem: options.tandem.createTandem( 'intensityProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'intensity of the light hitting the screen, in the range [0,1], ' +
                             'null if the light is not hitting the screen'
      } );
  }
}

/**
 * Gets the shape that results from the intersection of the light spot and the projection screen.
 * @param optic
 * @param projectionScreenPosition
 * @param sourcePosition
 * @param targetPosition
 * @param screenShape
 */
function getLightSpotShape( optic: Optic, projectionScreenPosition: Vector2, sourcePosition: Vector2,
                            targetPosition: Vector2, screenShape: Shape ): Shape {

  const {
    position,
    diameter
  } = getPositionAndDiameter( optic, projectionScreenPosition, sourcePosition, targetPosition );

  // The unclipped light spot is an ellipse, to give pseudo-3D perspective.
  // Arbitrarily use an aspect ratio of 1:2.
  const diameterX = diameter / 2;
  const ellipseShape = Shape.ellipse( position.x, position.y, diameterX / 2, diameter / 2, 2 * Math.PI );

  return Graph.binaryResult( screenShape, ellipseShape, Graph.BINARY_NONZERO_INTERSECTION );
}

/**
 * Gets the physical parameters (center position and radii) for the LightSpot
 * @param optic
 * @param projectionScreenPosition
 * @param sourcePosition
 * @param targetPosition
 */
function getPositionAndDiameter( optic: Optic, projectionScreenPosition: Vector2,
                                 sourcePosition: Vector2, targetPosition: Vector2 ): PositionAndDiameter {

  // Get the extrema points of the optic.
  const opticTopPoint = optic.getTopPoint( sourcePosition, targetPosition );
  const opticBottomPoint = optic.getBottomPoint( sourcePosition, targetPosition );

  // Determine the top and bottom positions of the unclipped light spot.
  const diskTopPosition = getIntersectionPosition( projectionScreenPosition, opticTopPoint, targetPosition );
  const diskBottomPosition = getIntersectionPosition( projectionScreenPosition, opticBottomPoint, targetPosition );

  return {
    position: diskTopPosition.average( diskBottomPosition ),
    diameter: diskTopPosition.distance( diskBottomPosition )
  };
}

/**
 * Gets the projected position on the screen of a point.
 * This is determined by extrapolating the point from the target point onto the projection screen.
 * @param projectionScreenPosition
 * @param opticPoint
 * @param targetPosition
 */
function getIntersectionPosition( projectionScreenPosition: Vector2, opticPoint: Vector2, targetPosition: Vector2 ): Vector2 {
  const targetOpticDistance = ( targetPosition.x - opticPoint.x );
  const ratio = ( targetOpticDistance === 0 ) ?
                10e6 : // This should technically be Infinity, but practically must be a (very large) finite value.
                ( projectionScreenPosition.x - opticPoint.x ) / targetOpticDistance;
  return opticPoint.blend( targetPosition, ratio );
}

geometricOptics.register( 'LightSpot', LightSpot );
export default LightSpot;