// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Rays, a bundle of 'Light Ray's emerging from a source point.
 *
 * @author Martin Veillette
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay from './LightRay.js';
import LightRayMode from './LightRayMode.js';
import Optic from './Optic.js';

class LightRays {

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<LightRayMode>} lightRayModeProperty
   * @param {Property.<boolean>} enableImageProperty
   * @param {Property.<Representation>} representationProperty
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {Property.<Vector2>} projectorScreenPositionProperty
   * @param {Optic} optic
   * @param {TargetImage} targetImage
   * @param {Tandem} tandem
   */
  constructor( timeProperty,
               lightRayModeProperty,
               enableImageProperty,
               representationProperty,
               sourceObjectPositionProperty,
               projectorScreenPositionProperty,
               optic,
               targetImage, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<LightRayMode>}
    this.modeProperty = lightRayModeProperty;

    // @public {Optic}
    this.optic = optic;

    this.timeProperty = timeProperty;

    // @private {Property.<Vector2>}
    this.sourceObjectPositionProperty = sourceObjectPositionProperty;

    // @private {TargetImage}
    this.targetImage = targetImage;

    // @public (read-only)
    this.realRay = new Shape();

    // @public (read-only)
    this.virtualRay = new Shape();

    // @public When are the rays are all processed
    this.raysProcessedEmitter = new Emitter();

    Property.multilink( [
        sourceObjectPositionProperty,
        lightRayModeProperty,
        timeProperty,
        representationProperty,
        projectorScreenPositionProperty,
        optic.positionProperty,
        optic.diameterProperty,
        optic.focalLengthProperty,
        optic.curveProperty ],
      ( sourcePosition, lightRayMode, time, representation ) => {

        this.realRay = new Shape();

        // @public (read-only)
        this.virtualRay = new Shape();

        const targetPoint = targetImage.positionProperty.value;
        const isVirtual = targetImage.isVirtual();

        // {Vector2[]} get the initial directions of the rays
        const directions = this.getRayDirections( sourcePosition, optic, lightRayMode );

        let lightRayOptions = {};
        if ( !representation.isObject ) {
          lightRayOptions = { finalX: projectorScreenPositionProperty.value.x };
        }
        directions.forEach( direction => {

          // determine the lightRay
          const lightRay = new LightRay( sourcePosition,
            direction,
            time,
            optic,
            targetPoint,
            isVirtual,
            lightRayMode,
            tandem,
            lightRayOptions );


          if ( lightRay.isTargetReachedProperty.value ) {
            enableImageProperty.value = true;
          }
          // add this new real lightRay to the realRay
          this.addRayShape( lightRay.realRay, this.realRay );

          // add this new virtual lightRay to the virtualRay
          this.addRayShape( lightRay.virtualRay, this.virtualRay );
        } );

        this.raysProcessedEmitter.emit();
      } );
  }

  /**
   * get the initial directions of the rays for the different light ray modes.
   *
   * @private
   * @param {LightRayMode} lightRayMode
   * @param {Vector2} sourcePosition
   * @param {Optic} optic
   * @returns {Vector2[]}
   */
  getRayDirections( sourcePosition, optic, lightRayMode ) {

    // {Vector2[]} directions of the light rays emanating from the object
    const directions = [];

    // convenience variables
    const f = optic.focalLengthProperty.value;
    const opticPosition = optic.positionProperty.value;

    // the top of the optic
    const topPoint = optic.getExtramumPoint( sourcePosition,
      this.targetImage.positionProperty.value, { location: Optic.Location.TOP } );

    // the bottom of the optic
    const bottomPoint = optic.getExtramumPoint( sourcePosition,
      this.targetImage.positionProperty.value, { location: Optic.Location.BOTTOM } );

    // direction of a ray to the top of the optic
    const topDirection = topPoint.minus( sourcePosition ).normalized();

    // direction of a ray to the bottom of the optic
    const bottomDirection = bottomPoint.minus( sourcePosition ).normalized();

    // aperture angle from the source to the optic
    const apertureAngle = topDirection.getAngle() - bottomDirection.getAngle();

    // vector from source to optic
    const sourceOpticVector = opticPosition.minus( sourcePosition );

    // vector from source to first focal point
    const sourceFirstFocalVector = sourceOpticVector.minusXY( f, 0 );

    // the vector should point to the right (to indicate the direction of the light rays)
    if ( sourceFirstFocalVector.x < 0 ) {
      sourceFirstFocalVector.negate();
    }

    if ( lightRayMode === LightRayMode.MARGINAL_RAYS ) {

      // direction for ray going through the center of optic
      directions.push( sourceOpticVector.normalized() );

      directions.push( topDirection, bottomDirection );
    }
    else if ( lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

      // horizontal direction
      directions.push( new Vector2( 1, 0 ) );

      // direction for ray going through the center of optic
      directions.push( sourceOpticVector.normalized() );

      // direction for ray going through the focal point
      directions.push( sourceFirstFocalVector.normalized() );

    }
    else if ( lightRayMode === LightRayMode.MANY_RAYS ) {

      // starting angle for showers of rays
      const startingAngle = Math.min( Math.PI / 4, 2 * apertureAngle );

      // symmetric condition for end angle
      const endAngle = -startingAngle;

      // number of rays
      const N = 50;

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
