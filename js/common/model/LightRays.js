// Copyright 2021, University of Colorado Boulder

/**
 * LightRays is the model of bundles of rays.  It's primary responsibilities include the Shape of the rays associated
 * with the real image and the virtual image, and how those Shapes are animated over time.
 *
 * @author Martin Veillette
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay from './LightRay.js';
import RaysMode from './RaysMode.js';
import Optic from './Optic.js';
import Ray from './Ray.js';

class LightRays {

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<RaysMode>} raysModeProperty
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {ProjectorScreen} projectorScreen
   * @param {Optic} optic
   * @param {Target} target - target model associated with this ray
   */
  constructor( timeProperty, raysModeProperty, representationProperty, sourceObjectPositionProperty,
               projectorScreen, optic, target ) {

    // @private {Property.<Vector>} target position associated with this ray
    this.targetPositionProperty = target.positionProperty;

    // @public (read-only) shape of a bundle of real rays at a point in time
    this.realRaysShape = new Shape();

    // @public (read-only) shape of a bundle of virtual rays at a point in time
    this.virtualRaysShape = new Shape();

    // @public tells view that it needs to update, fires after all rays are processed.
    this.raysProcessedEmitter = new Emitter();

    // update the shape of rays and the emitter state
    Property.multilink( [
        sourceObjectPositionProperty,
        raysModeProperty,
        timeProperty,
        representationProperty,
        projectorScreen.positionProperty,
        optic.positionProperty,
        optic.diameterProperty,
        optic.focalLengthProperty,
        optic.curveProperty ],
      ( sourcePosition, raysMode, time, representation ) => {

        // @public (read-only)
        this.realRaysShape = new Shape();

        // @public (read-only)
        this.virtualRaysShape = new Shape();

        // {Vector2} the position the target
        const targetPoint = this.targetPositionProperty.value;

        // {boolean} is the image virtual
        const isVirtual = target.isVirtualProperty.value;

        // {Vector2[]} get the initial directions of the rays
        const directions = this.getRayDirections( sourcePosition, optic, raysMode );

        // {boolean} is there a projector on the play area
        const isProjectorScreenPresent = !representation.isObject;

        // is the Rays mode set to Principal
        const isPrincipal = ( raysMode === RaysMode.PRINCIPAL );

        // set the target's enabledProperty to false initially (unless there are no rays)
        target.visibleProperty.value = ( raysMode === RaysMode.NONE );

        // loop over the direction of each ray
        directions.forEach( direction => {

          // initial ray starting at the source position
          const initialRay = new Ray( sourcePosition, direction );

          // determine the lightRay
          const lightRay = new LightRay( initialRay,
            time,
            optic,
            targetPoint,
            isVirtual,
            isPrincipal,
            isProjectorScreenPresent,
            projectorScreen.getBisectorLine.bind( projectorScreen )
          );

          // set target's enabledProperty to true after the first ray reaches its target
          if ( lightRay.isTargetReached ) {
            target.visibleProperty.value = true;
          }

          // add this new real lightRay to the realRaysShape
          this.addRayShape( lightRay.realShape, this.realRaysShape );

          // add this new virtual lightRay to the virtualRaysShape
          this.addRayShape( lightRay.virtualShape, this.virtualRaysShape );
        } );

        this.raysProcessedEmitter.emit();
      } );
  }

  /**
   * Gets the initial directions of the rays for the different light ray modes.
   * @private
   * @param {Vector2} sourcePosition
   * @param {Optic} optic
   * @param {RaysMode} raysMode
   * @returns {Vector2[]}
   */
  getRayDirections( sourcePosition, optic, raysMode ) {

    // {Vector2[]} directions of the light rays emanating from the object
    const directions = [];

    // convenience variables
    const f = optic.focalLengthProperty.value;
    const opticPosition = optic.positionProperty.value;

    // vector from source to optic
    const sourceOpticVector = opticPosition.minus( sourcePosition );

    if ( raysMode === RaysMode.MARGINAL ) {

      // direction for ray going through the center of optic
      directions.push( sourceOpticVector.normalized() );

      // the top of the optic
      const topPoint = optic.getExtremumPoint( sourcePosition,
        this.targetPositionProperty.value, { location: Optic.Location.TOP } );

      // the bottom of the optic
      const bottomPoint = optic.getExtremumPoint( sourcePosition,
        this.targetPositionProperty.value, { location: Optic.Location.BOTTOM } );

      // direction of a ray to the top of the optic
      const topDirection = topPoint.minus( sourcePosition ).normalized();

      // direction of a ray to the bottom of the optic
      const bottomDirection = bottomPoint.minus( sourcePosition ).normalized();

      directions.push( topDirection, bottomDirection );
    }
    else if ( raysMode === RaysMode.PRINCIPAL ) {

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
    else if ( raysMode === RaysMode.MANY ) {

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

  /**
   * Adds a light ray shape (typeRayShape) to the shape associated with the bundle of ray (rayShape)
   * @private
   * @param {Shape} rayShape
   * @param {Shape} typeRayShape
   */
  addRayShape( rayShape, typeRayShape ) {
    rayShape.subpaths.forEach( subPath => {
      typeRayShape.addSubpath( subPath );
    } );
  }
}

geometricOptics.register( 'LightRays', LightRays );
export default LightRays;