// Copyright 2021-2023, University of Colorado Boulder

/**
 * LightSpot is the model of a light spot in the vertical plane of the projection screen.
 * Responsible for the position, diameter, and intensity of the spot.
 * The view decides how it should look, and clips it to the projection screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Optic from './Optic.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectionScreen from './ProjectionScreen.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import GOConstants from '../../common/GOConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type PositionAndDiameter = {
  position: Vector2; // position of the light spot's center, in the vertical plane of the projection screen
  diameter: number; // diameter, in cm
};

type SelfOptions = EmptySelfOptions;

type LightSpotOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

export default class LightSpot extends PhetioObject {

  // Intensity of the light spot, in the range [0,1], 0 if there is no light spot hitting the projection screen
  public readonly intensityProperty: TReadOnlyProperty<number>;

  // Position of the center of the light spot, which may not be on the screen
  public readonly positionProperty: TReadOnlyProperty<Vector2>;

  // Diameter of the light spot in the y dimension
  public readonly diameterProperty: TReadOnlyProperty<number>;

  // Whether the light spot intersects the projection screen
  public readonly intersectsProjectionScreenProperty: TReadOnlyProperty<boolean>;

  public constructor( optic: Optic,
                      projectionScreen: ProjectionScreen,
                      lightObjectPositionProperty: TReadOnlyProperty<Vector2>,
                      opticalImagePositionProperty: TReadOnlyProperty<Vector2>,
                      providedOptions: LightSpotOptions ) {

    const options = optionize<LightSpotOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    const positionAndDiameterProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty, projectionScreen.positionProperty, lightObjectPositionProperty, opticalImagePositionProperty ],
      ( opticPosition, opticDiameter, projectionScreenPosition, lightObjectPosition, opticalImagePosition ) =>
        getPositionAndDiameter( optic, projectionScreenPosition, lightObjectPosition, opticalImagePosition )
    );

    this.positionProperty = new DerivedProperty( [ positionAndDiameterProperty ],
      positionAndDiameter => positionAndDiameter.position, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioFeatured: true,
        phetioValueType: Vector2.Vector2IO,
        phetioDocumentation: 'position of the center of the light spot, in the vertical plane of the projection screen'
      } );

    this.diameterProperty = new DerivedProperty( [ positionAndDiameterProperty ],
      positionAndDiameter => positionAndDiameter.diameter, {
        isValidValue: ( diameter: number ) => ( diameter >= 0 ),
        units: 'cm',
        tandem: options.tandem.createTandem( 'diameterProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'diameter (in the y dimension) of the light spot, in the vertical plane of the projection screen'
      } );

    // The normalized intensity of the light spot, in the range [0,1].
    // See https://github.com/phetsims/geometric-optics/issues/335
    this.intensityProperty = new DerivedProperty( [ this.diameterProperty, optic.diameterProperty ],
      ( lightSpotDiameter, opticDiameter ) => {
        if ( lightSpotDiameter === 0 ) {
          return 0; // avoid divide-by-zero
        }
        else {
          const opticDiameterRange = optic.diameterProperty.range;
          const opticDiameterFactor = Utils.linear( opticDiameterRange.min, opticDiameterRange.max, 0.5, 1, opticDiameter );

          // Any light spot less than this diameter will have full intensity when the optic diameter is at its maximum.
          const FULL_INTENSITY_DIAMETER = 14; // cm
          const lightSpotDiameterFactor = FULL_INTENSITY_DIAMETER / lightSpotDiameter;

          return GOConstants.INTENSITY_RANGE.constrainValue( opticDiameterFactor * lightSpotDiameterFactor );
        }
      }, {
        isValidValue: ( value: number ) => GOConstants.INTENSITY_RANGE.contains( value ),
        tandem: options.tandem.createTandem( 'intensityProperty' ),
        phetioFeatured: true,
        phetioValueType: NullableIO( NumberIO ),
        phetioDocumentation: 'intensity of the light spot, in the range [0,1]'
      } );

    this.intersectsProjectionScreenProperty = new DerivedProperty(
      [ this.positionProperty, this.diameterProperty, projectionScreen.positionProperty ],
      ( position, diameter, projectionScreenPosition ) =>
        position.y >= projectionScreenPosition.y - projectionScreen.height / 2 - diameter / 2 &&
        position.y <= projectionScreenPosition.y + projectionScreen.height / 2 + diameter / 2, {
        tandem: options.tandem.createTandem( 'intersectsProjectionScreenProperty' ),
        phetioValueType: BooleanIO
      } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Gets the center and diameter of the light spot, in the vertical plane of the projection screen.
 */
function getPositionAndDiameter( optic: Optic, projectionScreenPosition: Vector2,
                                 lightObjectPosition: Vector2, opticalImagePosition: Vector2 ): PositionAndDiameter {

  // Get the extrema points of the optic.
  const opticTopPoint = optic.getTopPoint( lightObjectPosition, opticalImagePosition );
  const opticBottomPoint = optic.getBottomPoint( lightObjectPosition, opticalImagePosition );

  // Determine the top and bottom positions of the light spot.
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
 */
function getIntersectionPosition( projectionScreenPosition: Vector2, opticPoint: Vector2,
                                  opticalImagePosition: Vector2 ): Vector2 {
  const opticImageDistance = ( opticalImagePosition.x - opticPoint.x );
  const ratio = ( opticImageDistance === 0 ) ?
                10e6 : // This should technically be Infinity, but practically must be a (very large) finite value.
                ( projectionScreenPosition.x - opticPoint.x ) / opticImageDistance;

  // linear interpolation between opticPoint.y (ratio=0) and another opticalImagePosition.y (ratio=1).
  const y = opticPoint.y + ( opticalImagePosition.y - opticPoint.y ) * ratio;
  return new Vector2( projectionScreenPosition.x, y );
}

geometricOptics.register( 'LightSpot', LightSpot );
