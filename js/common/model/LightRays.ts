// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightRays is the model of bundles of rays. It's primary responsibilities is to collect the line segments of
 * multiple LightRay instances. Line segments are animated over time.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay from './LightRay.js';
import LightRaySegment from './LightRaySegment.js';
import Optic from './Optic.js';
import Ray from './Ray.js';
import RaysType from './RaysType.js';
import Target from './Target.js';
import Representation from './Representation.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { MappedProperties } from '../../../../axon/js/DerivedProperty.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import Utils from '../../../../dot/js/Utils.js';

// constants related to 'Many' rays representation, see https://github.com/phetsims/geometric-optics/issues/289
const MANY_MIN_RAYS = 20;
const MANY_MIN_RAYS_DISTANCE = 300; // cm, MANY_MIN_RAYS will be shown up to this distance
const MANY_FAN_ANGLE = Utils.toRadians( 120 ); // degrees to radians

class LightRays {

  // segments for the real rays at a point in time
  realSegments: LightRaySegment[];

  // segments for the virtual rays at a point in time
  virtualSegments: LightRaySegment[];

  // tells view that it needs to update, fires after all rays are processed.
  readonly raysProcessedEmitter: Emitter<[]>;

  /**
   * @param timeProperty
   * @param raysTypeProperty
   * @param representationProperty
   * @param sourceObjectPositionProperty
   * @param optic
   * @param target - target model associated with this ray
   * @param projectionScreen - optional projection screen that blocks rays
   */
  constructor( timeProperty: Property<number>, raysTypeProperty: IReadOnlyProperty<RaysType>,
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
      sourceObjectPositionProperty, raysTypeProperty, timeProperty, representationProperty,
      optic.positionProperty, optic.diameterProperty, optic.focalLengthProperty, optic.surfaceTypeProperty
    ];
    if ( projectionScreen ) {
      dependencies.push( projectionScreen.positionProperty );
    }

    // Update all rays, then inform listeners via raysProcessedEmitter.
    Property.multilink<DependencyTypes>( dependencies,
      ( sourcePosition: Vector2, raysType: RaysType, time: number, representation: Representation ) => {

        // Clear the arrays.
        this.realSegments = [];
        this.virtualSegments = [];

        // {Vector2} the position the target
        const targetPoint = target.positionProperty.value;

        // {boolean} is the image virtual
        const isVirtual = target.isVirtualProperty.value;

        // {Vector2[]} get the initial directions of the rays
        const directions = getRayDirections( sourcePosition, optic, raysType, targetPoint );

        // is the Rays mode set to Principal
        const isPrincipalRaysType = ( raysType === 'principal' );

        // set the target's visibility to false initially (unless there are no rays)
        target.visibleProperty.value = ( raysType === 'none' );

        // loop over the direction of each ray
        directions.forEach( direction => {

          // initial ray starting at the source position
          const initialRay = new Ray( sourcePosition, direction );

          // determine the lightRay
          const lightRay = new LightRay( initialRay, time, optic, targetPoint, isVirtual, isPrincipalRaysType,
            representation.isObject ? null : projectionScreen, sourceObjectPositionProperty
          );

          // set target's visibility to true after the first ray reaches its target
          if ( lightRay.isTargetReached ) {
            target.visibleProperty.value = true;
          }

          // Add lightRay's line segments
          this.realSegments.push( ...lightRay.realSegments );
          this.virtualSegments.push( ...lightRay.virtualSegments );
        } );

        this.raysProcessedEmitter.emit();
      } );
  }
}

/**
 * Gets the initial directions of the rays for the different ray modes.
 * @param sourcePosition
 * @param optic
 * @param raysType
 * @param targetPoint
 */
function getRayDirections( sourcePosition: Vector2, optic: Optic, raysType: RaysType, targetPoint: Vector2 ): Vector2[] {

  // {Vector2[]} directions of the light rays emanating from the object
  const directions = [];

  // convenience variables
  const f = optic.focalLengthProperty.value;
  const opticPosition = optic.positionProperty.value;

  // vector from source to optic
  const sourceOpticVector = opticPosition.minus( sourcePosition );

  if ( raysType === 'marginal' ) {

    // direction for ray going through the center of optic
    directions.push( sourceOpticVector.normalized() );

    // the top of the optic
    const topPoint = optic.getTopPoint( sourcePosition, targetPoint );

    // the bottom of the optic
    const bottomPoint = optic.getBottomPoint( sourcePosition, targetPoint );

    // direction of a ray to the top of the optic
    const topDirection = topPoint.minus( sourcePosition ).normalized();

    // direction of a ray to the bottom of the optic
    const bottomDirection = bottomPoint.minus( sourcePosition ).normalized();

    directions.push( topDirection, bottomDirection );
  }
  else if ( raysType === 'principal' ) {

    // horizontal direction, unit vector along positive x
    directions.push( new Vector2( 1, 0 ) );

    // direction for ray going through the center of optic
    directions.push( sourceOpticVector.normalized() );

    // vector from source to first focal point
    const sourceFirstFocalVector = sourceOpticVector.minusXY( f, 0 );

    // the vector should point to the right (to indicate the direction of the light rays)
    if ( sourceFirstFocalVector.x < 0 ) {
      sourceFirstFocalVector.negate();
    }

    // direction for ray going through the focal point
    directions.push( sourceFirstFocalVector.normalized() );
  }
  else if ( raysType === 'many' ) {

    // starting angle for showers of rays
    const startingAngle = MANY_FAN_ANGLE / 2;

    // symmetric condition for end angle
    const endAngle = -startingAngle;

    // x distance from the Object to the optic
    const distanceX = Math.abs( optic.positionProperty.value.x - sourcePosition.x );

    // number of rays
    const numberOfRays = MANY_MIN_RAYS * ( Math.floor( distanceX / MANY_MIN_RAYS_DISTANCE ) + 1 );

    // Degrees between adjacent arrays
    const deltaTheta = ( endAngle - startingAngle ) / ( numberOfRays - 1 );

    // create a show of equidistant rays between startingAngle and endAngle
    for ( let i = 0; i < numberOfRays; i++ ) {
      const angle = startingAngle + i * deltaTheta;
      directions.push( Vector2.createPolar( 1, angle ) );
    }
  }
  return directions;
}

geometricOptics.register( 'LightRays', LightRays );
export default LightRays;