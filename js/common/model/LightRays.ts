// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightRays is the model of bundles of rays. It's primary responsibility is to collect the segments of
 * multiple LightRay instances. LightRays are animated over time.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay, { LightRaySegment } from './LightRay.js';
import Optic from './Optic.js';
import { RaysType } from './RaysType.js';
import Target from './Target.js';
import Representation from './Representation.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { MappedProperties } from '../../../../axon/js/DerivedProperty.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import Utils from '../../../../dot/js/Utils.js';

// constants related to 'Many' rays representation, see https://github.com/phetsims/geometric-optics/issues/289
const MANY_MIN_RAYS = 20;
const MANY_MIN_RAYS_DISTANCE = 300; // cm, MANY_MIN_RAYS will be shown up to this distance from the optic
const MANY_FAN_ANGLE = Utils.toRadians( 120 ); // degrees to radians

class LightRays {

  // segments for the real rays at a point in time
  realSegments: LightRaySegment[];

  // segments for the virtual rays at a point in time
  virtualSegments: LightRaySegment[];

  // tells view that it needs to update, fires after all rays are processed.
  readonly raysProcessedEmitter: Emitter<[]>;

  /**
   * @param lightRaysTimeProperty - elapsed time of light rays animation
   * @param raysTypeProperty
   * @param representationProperty
   * @param sourceObjectPositionProperty
   * @param optic
   * @param target - target model associated with this ray
   * @param projectionScreen - optional projection screen that blocks rays
   */
  constructor( lightRaysTimeProperty: Property<number>, raysTypeProperty: IReadOnlyProperty<RaysType>,
               representationProperty: IReadOnlyProperty<Representation>,
               sourceObjectPositionProperty: IReadOnlyProperty<Vector2>,
               optic: Optic, target: Target, projectionScreen: ProjectionScreen | null ) {

    this.realSegments = [];
    this.virtualSegments = [];
    this.raysProcessedEmitter = new Emitter();

    // Things that result in a change to the rays.
    // We only care about the types of the first 4 dependencies, because the listener only has 4 parameters.
    type DependencyTypes = [ Vector2, RaysType, number, Representation, ...any[] ];
    const dependencies: MappedProperties<DependencyTypes> = [
      sourceObjectPositionProperty, raysTypeProperty, lightRaysTimeProperty, representationProperty,
      optic.positionProperty, optic.diameterProperty, optic.focalLengthProperty, optic.surfaceTypeProperty
    ];
    if ( projectionScreen ) {
      dependencies.push( projectionScreen.positionProperty );
    }

    // Update all rays, then inform listeners via raysProcessedEmitter.
    Property.multilink<DependencyTypes>( dependencies,
      ( sourcePosition: Vector2, raysType: RaysType, lightRaysTime: number, representation: Representation ) => {

        // Clear the arrays.
        this.realSegments = [];
        this.virtualSegments = [];

        // {Vector2} the position the target
        const targetPoint = target.positionProperty.value;

        // {boolean} is the Image virtual
        const isVirtual = target.isVirtualProperty.value;

        // {Vector2[]} get the initial directions of the rays
        const directions = getRayDirections( raysType, sourcePosition, optic, targetPoint );

        // set the target's visibility to false initially (unless there are no rays)
        target.visibleProperty.value = ( raysType === 'none' );

        // loop over the direction of each ray
        directions.forEach( direction => {

          // Create a LightRay, which is responsible for creating real and virtual ray segments.
          const lightRay = new LightRay( sourcePosition, direction, lightRaysTime, optic, targetPoint, isVirtual,
            raysType, representation.isFramedObject ? null : projectionScreen
          );

          // Set target's visibility to true when a ray reaches the target.
          if ( lightRay.isTargetReached ) {
            target.visibleProperty.value = true;
          }

          // Add lightRay's segments
          this.realSegments.push( ...lightRay.realSegments );
          this.virtualSegments.push( ...lightRay.virtualSegments );
        } );

        this.raysProcessedEmitter.emit();
      } );
  }
}

/**
 * Gets the initial directions (as unit vectors) of the rays for the different ray types.
 * @param raysType
 * @param sourcePosition
 * @param optic
 * @param targetPoint
 */
function getRayDirections( raysType: RaysType, sourcePosition: Vector2, optic: Optic, targetPoint: Vector2 ): Vector2[] {

  // {Vector2[]} directions of the light rays emanating from sourcePosition
  const directions = [];

  // vector from source to optic
  const sourceOpticVector = optic.positionProperty.value.minus( sourcePosition );

  if ( raysType === 'marginal' ) {

    // 3 rays: through center, top, and bottom of optic.

    // #1: center of the optic
    directions.push( sourceOpticVector.normalized() );

    // #2: top of the optic
    const topPoint = optic.getTopPoint( sourcePosition, targetPoint );
    const topDirection = topPoint.minus( sourcePosition ).normalized();
    directions.push( topDirection );

    // #3: bottom of the optic
    const bottomPoint = optic.getBottomPoint( sourcePosition, targetPoint );
    const bottomDirection = bottomPoint.minus( sourcePosition ).normalized();
    directions.push( bottomDirection );
  }
  else if ( raysType === 'principal' ) {

    // 3 rays: parallel to optical axis, through center of optic, through focal point on left side of optic
    // This representation can result in some confusion, see https://github.com/phetsims/geometric-optics/issues/140.

    // #1: parallel to the optical axis
    directions.push( new Vector2( 1, 0 ) );

    // #2: through the center of optic
    directions.push( sourceOpticVector.normalized() );

    // #3: through the focal point
    const sourceFirstFocalVector = sourceOpticVector.minusXY( optic.focalLengthProperty.value, 0 );
    if ( sourceFirstFocalVector.x < 0 ) {
      sourceFirstFocalVector.negate(); // should point to the right, to indicate the direction of the light rays
    }
    directions.push( sourceFirstFocalVector.normalized() );
  }
  else if ( raysType === 'many' ) {

    // Number of rays depends on how far sourcePosition is from the optic. But we want at least 2 rays to
    // go through the optic. See https://github.com/phetsims/geometric-optics/issues/289.

    // starting angle for fan of rays
    const startingAngle = MANY_FAN_ANGLE / 2;

    // symmetric condition for end angle
    const endAngle = -startingAngle;

    // x distance from the Object to the optic
    const distanceX = Math.abs( optic.positionProperty.value.x - sourcePosition.x );

    // number of rays
    const numberOfRays = MANY_MIN_RAYS * ( Math.floor( distanceX / MANY_MIN_RAYS_DISTANCE ) + 1 );

    // Degrees between adjacent arrays
    const deltaTheta = ( endAngle - startingAngle ) / ( numberOfRays - 1 );

    // Create a fan of equidistant rays between startingAngle and endAngle.
    for ( let i = 0; i < numberOfRays; i++ ) {
      const angle = startingAngle + i * deltaTheta;
      directions.push( Vector2.createPolar( 1, angle ) );
    }
  }
  return directions;
}

geometricOptics.register( 'LightRays', LightRays );
export default LightRays;