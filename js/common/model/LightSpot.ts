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
import Utils from '../../../../dot/js/Utils.js';
import { Shape, Graph } from '../../../../kite/js/imports.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Optic from './Optic.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from './ProjectionScreen.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import GOConstants from '../../common/GOConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type PositionAndDiameter = {

  // position of the light spot's center
  position: Vector2;

  // diameter, in cm
  diameter: number;
};

type LightSpotOptions = PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

class LightSpot extends PhetioObject {

  // Shape of the light spot, based on its intersection with the projection screen.
  // If the spot does not intersect the screen, the value will be a Shape with zero area.
  public readonly shapeProperty: IReadOnlyProperty<Shape>;

  // Intensity of the light spot, in the range [0,1], 0 if there is no light spot hitting the projection screen
  public readonly intensityProperty: IReadOnlyProperty<number>;

  // Position of the center of the light spot, which may not be on the screen,
  // null if there is no light spot hitting the projection screen
  public readonly positionProperty: IReadOnlyProperty<Vector2 | null>;

  // Diameter of the light spot in the y dimension,
  // null if there is no light spot hitting the projection screen
  public readonly diameterProperty: IReadOnlyProperty<number | null>;

  /**
   * @param optic
   * @param projectionScreen
   * @param lightObjectPositionProperty
   * @param opticalImagePositionProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               projectionScreen: ProjectionScreen,
               lightObjectPositionProperty: IReadOnlyProperty<Vector2>,
               opticalImagePositionProperty: IReadOnlyProperty<Vector2>,
               providedOptions: LightSpotOptions ) {

    const options = optionize<LightSpotOptions, {}, PhetioObject>( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.shapeProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty, projectionScreen.positionProperty, lightObjectPositionProperty, opticalImagePositionProperty ],
      ( opticPosition: Vector2, opticDiameter: number, projectionScreenPosition: Vector2, lightObjectPosition: Vector2, opticalImagePosition: Vector2 ) =>
        getLightSpotShape( optic, projectionScreenPosition, lightObjectPosition, opticalImagePosition, projectionScreen.getScreenShapeTranslated() )
    );

    const positionAndDiameterProperty = new DerivedProperty( [ this.shapeProperty ],
      ( shape: Shape ) =>
        ( shape.getArea() === 0 ) ? null :
        getPositionAndDiameter( optic, projectionScreen.positionProperty.value, lightObjectPositionProperty.value, opticalImagePositionProperty.value )
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
    // See https://github.com/phetsims/geometric-optics/issues/335
    this.intensityProperty = new DerivedProperty( [ this.diameterProperty, optic.diameterProperty ],
      ( lightSpotDiameter: number | null, opticDiameter: number ) => {
        if ( ( lightSpotDiameter === 0 || lightSpotDiameter === null ) ) {
          return 0;
        }
        else {
          assert && assert( optic.diameterProperty.range ); // {Range|null}
          const opticDiameterRange = optic.diameterProperty.range!;
          const opticDiameterFactor = Utils.linear( opticDiameterRange.min, opticDiameterRange.max, 0.5, 1, opticDiameter );

          // Any light spot less than this diameter will have full intensity when the optic diameter is at its maximum.
          const FULL_INTENSITY_DIAMETER = 14; // cm
          const lightSpotDiameterFactor = FULL_INTENSITY_DIAMETER / lightSpotDiameter;

          return GOConstants.INTENSITY_RANGE.constrainValue( opticDiameterFactor * lightSpotDiameterFactor );
        }
      }, {
        isValidValue: ( value: number | null ) => ( value === null ) || GOConstants.INTENSITY_RANGE.contains( value ),
        tandem: options.tandem.createTandem( 'intensityProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        phetioDocumentation: 'intensity of the light hitting the screen, in the range [0,1], ' +
                             'null if the light is not hitting the screen'
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Gets the shape that results from the intersection of the light spot and the projection screen.
 * @param optic
 * @param projectionScreenPosition
 * @param lightObjectPosition
 * @param opticalImagePosition
 * @param screenShape
 */
function getLightSpotShape( optic: Optic, projectionScreenPosition: Vector2, lightObjectPosition: Vector2,
                            opticalImagePosition: Vector2, screenShape: Shape ): Shape {

  const {
    position,
    diameter
  } = getPositionAndDiameter( optic, projectionScreenPosition, lightObjectPosition, opticalImagePosition );

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
 * @param lightObjectPosition
 * @param opticalImagePosition
 */
function getPositionAndDiameter( optic: Optic, projectionScreenPosition: Vector2,
                                 lightObjectPosition: Vector2, opticalImagePosition: Vector2 ): PositionAndDiameter {

  // Get the extrema points of the optic.
  const opticTopPoint = optic.getTopPoint( lightObjectPosition, opticalImagePosition );
  const opticBottomPoint = optic.getBottomPoint( lightObjectPosition, opticalImagePosition );

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