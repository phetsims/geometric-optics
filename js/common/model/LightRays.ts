// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightRays is the model of bundles of light rays. It's primary responsibility is to collect the segments of
 * multiple LightRay instances. LightRays are animated over time.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay, { LightRaySegment } from './LightRay.js';
import Optic from './Optic.js';
import { RaysType } from './RaysType.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ProjectionScreen from './ProjectionScreen.js';
import Utils from '../../../../dot/js/Utils.js';
import OpticalImage from './OpticalImage.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

// constants related to 'Many' rays representation, see https://github.com/phetsims/geometric-optics/issues/289
const MANY_MIN_RAYS = 20;
const MANY_MIN_RAYS_DISTANCE = 300; // cm, MANY_MIN_RAYS will be shown up to this distance from the optic
const MANY_FAN_ANGLE = Utils.toRadians( 120 ); // degrees to radians
const VECTOR2_PROPERTY = new Vector2Property( Vector2.ZERO ); // For helping the type checker with varargs multilink

export default class LightRays {

  // segments for the real rays at a point in time
  public realSegments: LightRaySegment[];

  // segments for the virtual rays at a point in time
  public virtualSegments: LightRaySegment[];

  // tells view that it needs to update, fires after all rays are processed.
  public readonly raysProcessedEmitter: TEmitter;

  /**
   * @param opticalObjectPositionProperty - position of the optical object
   * @param optic - the optic that this bundle of rays may interact with
   * @param opticalImage - optical image associated with this ray
   * @param raysTypeProperty - representation used for rays
   * @param raysAnimationTimeProperty - elapsed time of light rays animation
   * @param [projectionScreen] - optional projection screen that blocks rays
   */
  public constructor( opticalObjectPositionProperty: TReadOnlyProperty<Vector2>,
                      optic: Optic,
                      opticalImage: OpticalImage,
                      raysTypeProperty: TReadOnlyProperty<RaysType>,
                      raysAnimationTimeProperty: TReadOnlyProperty<number>,
                      projectionScreen?: ProjectionScreen ) {

    this.realSegments = [];
    this.virtualSegments = [];
    this.raysProcessedEmitter = new Emitter();

    // When the light rays animation begins, hide the optical image. It will be made visible when a ray reaches the
    // image position.  If Rays is set to 'None', make the image visible immediately, since there will be no animation.
    Multilink.multilink( [ raysTypeProperty, raysAnimationTimeProperty ], ( raysType, raysAnimationTime ) => {
      if ( raysType === 'none' || raysAnimationTime === 0 ) {
        opticalImage.visibleProperty.value = ( raysTypeProperty.value === 'none' );
      }
    } );

    // Things that result in a change to the rays.
    // We only care about the types of the first 3 dependencies, because the listener only has 3 parameters.
    const bonusProperty = projectionScreen ? projectionScreen.positionProperty : VECTOR2_PROPERTY;
    const dependencies = [
      opticalObjectPositionProperty, raysTypeProperty, raysAnimationTimeProperty,
      optic.positionProperty, optic.diameterProperty, optic.focalLengthProperty, optic.opticSurfaceTypeProperty,
      bonusProperty
    ] as const;

    // Update all rays, then inform listeners via raysProcessedEmitter.
    Multilink.multilink( dependencies,
      ( opticalObjectPosition, raysType, raysAnimationTime ) => {

        // Clear the arrays.
        this.realSegments = [];
        this.virtualSegments = [];

        // the position the opticalImage
        const opticalImagePosition = opticalImage.positionProperty.value;

        // is the Image virtual
        const isVirtual = ( opticalImage.opticalImageTypeProperty.value === 'virtual' );

        // get the initial directions of the rays
        const directions: Vector2[] = getRayDirections( raysType, opticalObjectPosition, optic, opticalImagePosition );

        // loop over the direction of each ray
        directions.forEach( direction => {

          // Create a LightRay, which is responsible for creating real and virtual ray segments.
          const lightRay = new LightRay( opticalObjectPosition, direction, raysAnimationTime, optic, opticalImagePosition, isVirtual,
            raysType, projectionScreen );

          // Set optical image's visibility to true when a ray reaches the optical image or projection screen.
          if ( lightRay.hasReachedTarget ) {
            opticalImage.visibleProperty.value = true;
          }

          // Add LightRaySegments
          this.realSegments.push( ...lightRay.realSegments );
          this.virtualSegments.push( ...lightRay.virtualSegments );
        } );

        this.raysProcessedEmitter.emit();
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

/**
 * Gets the initial directions (as unit vectors) of the rays for the different ray types.
 */
function getRayDirections( raysType: RaysType, opticalObjectPosition: Vector2, optic: Optic,
                           opticalImagePosition: Vector2 ): Vector2[] {

  // directions of the light rays emanating from opticalObjectPosition
  const directions: Vector2[] = [];

  // vector from object to optic
  const objectOpticVector = optic.positionProperty.value.minus( opticalObjectPosition );

  if ( raysType === 'marginal' ) {

    // 3 rays: through center, top, and bottom of optic.

    // #1: center of the optic
    directions.push( objectOpticVector.normalized() );

    // #2: top of the optic
    const topPoint = optic.getTopPoint( opticalObjectPosition, opticalImagePosition );
    const topDirection = topPoint.minus( opticalObjectPosition ).normalized();
    directions.push( topDirection );

    // #3: bottom of the optic
    const bottomPoint = optic.getBottomPoint( opticalObjectPosition, opticalImagePosition );
    const bottomDirection = bottomPoint.minus( opticalObjectPosition ).normalized();
    directions.push( bottomDirection );
  }
  else if ( raysType === 'principal' ) {

    // 3 rays: parallel to optical axis, through center of optic, through focal point on left side of optic
    // This representation can result in some confusion, see https://github.com/phetsims/geometric-optics/issues/140.

    // #1: parallel to the optical axis
    directions.push( new Vector2( 1, 0 ) );

    // #2: through the center of optic
    directions.push( objectOpticVector.normalized() );

    // #3: through the focal point
    const firstFocalVector = objectOpticVector.minusXY( optic.focalLengthProperty.value, 0 );
    if ( firstFocalVector.x < 0 ) {
      firstFocalVector.negate(); // should point to the right, to indicate the direction of the light rays
    }
    directions.push( firstFocalVector.normalized() );
  }
  else if ( raysType === 'many' ) {

    // Number of rays depends on how far opticalObjectPosition is from the optic. But we want at least 2 rays to
    // go through the optic. See https://github.com/phetsims/geometric-optics/issues/289.

    // starting angle for fan of rays
    const startingAngle = MANY_FAN_ANGLE / 2;

    // symmetric condition for end angle
    const endAngle = -startingAngle;

    // x distance from the Object to the optic
    const distanceX = Math.abs( optic.positionProperty.value.x - opticalObjectPosition.x );

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