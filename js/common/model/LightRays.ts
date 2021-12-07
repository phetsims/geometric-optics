// Copyright 2021, University of Colorado Boulder

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
import RaysModeEnum from './RaysModeEnum.js';
import Target from './Target.js';
import Representation from './Representation.js';
import Barrier from './Barrier.js';

class LightRays {

  // segments for the real rays at a point in time
  realSegments: LightRaySegment[];

  // segments for the virtual rays at a point in time
  virtualSegments: LightRaySegment[];

  // tells view that it needs to update, fires after all rays are processed.
  readonly raysProcessedEmitter: Emitter<[]>;

  /**
   * @param timeProperty
   * @param raysModeProperty
   * @param representationProperty
   * @param sourceObjectPositionProperty
   * @param optic
   * @param target - target model associated with this ray
   * @param barrier - optional barrier that blocks rays
   */
  constructor( timeProperty: Property<number>, raysModeProperty: Property<RaysModeEnum>,
               representationProperty: Property<Representation>, sourceObjectPositionProperty: Property<Vector2>,
               optic: Optic, target: Target, barrier: Barrier | null ) {

    this.realSegments = [];
    this.virtualSegments = [];
    this.raysProcessedEmitter = new Emitter();

    // update the shape of rays and the emitter state
    const dependencies = [
      // order of these is important
      sourceObjectPositionProperty, raysModeProperty, timeProperty, representationProperty,
      // order of these is not important
      optic.positionProperty, optic.diameterProperty, optic.focalLengthProperty, optic.opticShapeProperty
    ];
    if ( barrier ) {
      dependencies.push( barrier.positionProperty );
    }
    Property.multilink( dependencies,
      ( sourcePosition: Vector2, raysMode: RaysModeEnum, time: number, representation: Representation ) => {

        // Clear the arrays.
        this.realSegments = [];
        this.virtualSegments = [];

        // {Vector2} the position the target
        const targetPoint = target.positionProperty.value;

        // {boolean} is the image virtual
        const isVirtual = target.isVirtualProperty.value;

        // {Vector2[]} get the initial directions of the rays
        const directions = getRayDirections( sourcePosition, optic, raysMode, targetPoint );

        // is the Rays mode set to Principal
        const isPrincipalRaysMode = ( raysMode === 'principal' );

        // set the target's visibility to false initially (unless there are no rays)
        target.visibleProperty.value = ( raysMode === 'none' );

        // loop over the direction of each ray
        directions.forEach( direction => {

          // initial ray starting at the source position
          const initialRay = new Ray( sourcePosition, direction );

          // determine the lightRay
          const lightRay = new LightRay( initialRay, time, optic, targetPoint, isVirtual, isPrincipalRaysMode,
            representation.isObject ? null : barrier
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
 * @param raysMode
 * @param targetPoint
 */
function getRayDirections( sourcePosition: Vector2, optic: Optic, raysMode: RaysModeEnum, targetPoint: Vector2 ): Vector2[] {

  // {Vector2[]} directions of the light rays emanating from the object
  const directions = [];

  // convenience variables
  const f = optic.focalLengthProperty.value;
  const opticPosition = optic.positionProperty.value;

  // vector from source to optic
  const sourceOpticVector = opticPosition.minus( sourcePosition );

  if ( raysMode === 'marginal' ) {

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
  else if ( raysMode === 'principal' ) {

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
  else if ( raysMode === 'many' ) {

    // starting angle for showers of rays
    const startingAngle = Math.PI / 4;

    // symmetric condition for end angle
    const endAngle = -startingAngle;

    // number of rays
    const N = 15;

    // Degrees between adjacent arrays
    const deltaTheta = ( endAngle - startingAngle ) / ( N - 1 );

    // create a show of equidistant rays between startingAngle and endAngle
    for ( let i = 0; i < N; i++ ) {
      const angle = startingAngle + i * deltaTheta;
      directions.push( Vector2.createPolar( 1, angle ) );
    }
  }
  return directions;
}

geometricOptics.register( 'LightRays', LightRays );
export default LightRays;