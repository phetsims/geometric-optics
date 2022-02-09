// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightSpot is the model of the light spot that hits the projection screen.
 * Responsible for the shape of the spot (cropped to the screen shape) and the light intensity.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Graph from '../../../../kite/js/ops/Graph.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from './ProjectionScreen.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import GOConstants from '../../common/GOConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';

// constants
const FULL_INTENSITY_DIAMETER = 7; // cm, any light spot less than this diameter will be full intensity

type PositionAndDiameter = { position: Vector2, diameter: number };

type LightSpotOptions = {
  tandem: Tandem,
  phetioDocumentation?: string
};

class LightSpot extends PhetioObject {

  // Shape of the light spot, based on its intersection with the projection screen.
  // If the spot does not intersect the screen, the value will be a Shape with zero area.
  readonly shapeProperty: IReadOnlyProperty<Shape>;

  // Intensity of the light spot, in the range [0,1],
  // null if there is no light spot hitting the projection screen
  readonly intensityProperty: IReadOnlyProperty<number | null>;

  // Position of the center of the light spot, which may not be on the screen,
  // null if there is no light spot hitting the projection screen
  readonly positionProperty: IReadOnlyProperty<Vector2 | null>;

  // Diameter of the light spot in the y dimension,
  // null if there is no light spot hitting the projection screen
  readonly diameterProperty: IReadOnlyProperty<number | null>;

  /**
   * @param optic
   * @param projectionScreen
   * @param lightSourcePositionProperty
   * @param opticalImagePositionProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               projectionScreen: ProjectionScreen,
               lightSourcePositionProperty: IReadOnlyProperty<Vector2>,
               opticalImagePositionProperty: IReadOnlyProperty<Vector2>,
               providedOptions: LightSpotOptions ) {

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.shapeProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty, projectionScreen.positionProperty, lightSourcePositionProperty, opticalImagePositionProperty ],
      ( opticPosition: Vector2, opticDiameter: number, projectionScreenPosition: Vector2, lightSourcePosition: Vector2, opticalImagePosition: Vector2 ) =>
        getLightSpotShape( optic, projectionScreenPosition, lightSourcePosition, opticalImagePosition, projectionScreen.getScreenShapeTranslated() )
    );

    const positionAndDiameterProperty = new DerivedProperty( [ this.shapeProperty ],
      ( shape: Shape ) =>
        ( shape.getArea() === 0 ) ? null :
        getPositionAndDiameter( optic, projectionScreen.positionProperty.value, lightSourcePositionProperty.value, opticalImagePositionProperty.value )
    );

    this.positionProperty = new DerivedProperty( [ positionAndDiameterProperty ],
      ( positionAndDiameter: PositionAndDiameter | null ) =>
        ( positionAndDiameter === null ) ? null : positionAndDiameter.position, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( Vector2.Vector2IO ) ),
        phetioDocumentation: 'position of the center of the light spot (which may not be on the screen), ' +
                             'null if the light is not hitting the screen'
      } );

    this.diameterProperty = new DerivedProperty( [ positionAndDiameterProperty ],
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
    this.intensityProperty = new DerivedProperty( [ this.diameterProperty ],
      ( diameter: number | null ) => ( diameter === null || diameter === 0 ) ? null :
                                     GOConstants.INTENSITY_RANGE.constrainValue( FULL_INTENSITY_DIAMETER / diameter ), {
        isValidValue: ( value: number | null ) => ( value === null ) || GOConstants.INTENSITY_RANGE.contains( value ),
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
 * @param lightSourcePosition
 * @param opticalImagePosition
 * @param screenShape
 */
function getLightSpotShape( optic: Optic, projectionScreenPosition: Vector2, lightSourcePosition: Vector2,
                            opticalImagePosition: Vector2, screenShape: Shape ): Shape {

  const {
    position,
    diameter
  } = getPositionAndDiameter( optic, projectionScreenPosition, lightSourcePosition, opticalImagePosition );

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
 * @param lightSourcePosition
 * @param opticalImagePosition
 */
function getPositionAndDiameter( optic: Optic, projectionScreenPosition: Vector2,
                                 lightSourcePosition: Vector2, opticalImagePosition: Vector2 ): PositionAndDiameter {

  // Get the extrema points of the optic.
  const opticTopPoint = optic.getTopPoint( lightSourcePosition, opticalImagePosition );
  const opticBottomPoint = optic.getBottomPoint( lightSourcePosition, opticalImagePosition );

  // Determine the top and bottom positions of the unclipped light spot.
  const diskTopPosition = getIntersectionPosition( projectionScreenPosition, opticTopPoint, opticalImagePosition );
  const diskBottomPosition = getIntersectionPosition( projectionScreenPosition, opticBottomPoint, opticalImagePosition );

  return {
    position: diskTopPosition.average( diskBottomPosition ),
    diameter: diskTopPosition.distance( diskBottomPosition )
  };
}

/**
 * Gets the projected position on the screen of a point.
 * This is determined by extrapolating the point from the optical image onto the projection screen.
 * @param projectionScreenPosition
 * @param opticPoint
 * @param opticalImagePosition
 */
function getIntersectionPosition( projectionScreenPosition: Vector2, opticPoint: Vector2, opticalImagePosition: Vector2 ): Vector2 {
  const opticImageDistance = ( opticalImagePosition.x - opticPoint.x );
  const ratio = ( opticImageDistance === 0 ) ?
                10e6 : // This should technically be Infinity, but practically must be a (very large) finite value.
                ( projectionScreenPosition.x - opticPoint.x ) / opticImageDistance;
  return opticPoint.blend( opticalImagePosition, ratio );
}

geometricOptics.register( 'LightSpot', LightSpot );
export default LightSpot;