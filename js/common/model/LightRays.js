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
import Ray from './Ray.js';

class LightRays {

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<LightRayMode>} lightRayModeProperty
   * @param {Property.<boolean>} enableImageProperty
   * @param {Property.<Representation>} representationProperty
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {ProjectorScreen} projectorScreen
   * @param {Optic} optic
   * @param {TargetImage} targetImage
   * @param {Tandem} tandem
   */
  constructor( timeProperty,
               lightRayModeProperty,
               enableImageProperty,
               representationProperty,
               sourceObjectPositionProperty,
               projectorScreen,
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
        projectorScreen.positionProperty,
        optic.positionProperty,
        optic.diameterProperty,
        optic.focalLengthProperty,
        optic.curveProperty ],
      ( sourcePosition, lightRayMode, time, representation ) => {

        this.realRay = new Shape();

        // @public (read-only)
        this.virtualRay = new Shape();

        // {Vector2} the position the target
        const targetPoint = targetImage.positionProperty.value;

        // {boolean} is the image virtual
        const isVirtual = targetImage.isVirtual();

        // {Vector2[]} get the initial directions of the rays
        const directions = this.getRayDirections( sourcePosition, optic, lightRayMode );

        // {boolean} is there a projector on the play area
        const isProjectorScreenPresent = !representation.isObject;

        // is the light ray mode set to Principal Rays
        const isPrincipalRayMode = lightRayMode === LightRayMode.PRINCIPAL_RAYS;

        // set the enable image property to false initially  (unless there are no rays)
        enableImageProperty.value = lightRayMode === LightRayMode.NO_RAYS;

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
            isPrincipalRayMode,
            isProjectorScreenPresent,
            projectorScreen.getBisectorLine.bind( projectorScreen ),
            tandem );


          // set the enable image to true after the first ray reaches its target
          if ( lightRay.isTargetReached ) {
            enableImageProperty.value = true;
          }
          // add this new real lightRay to the realRay
          this.addRayShape( lightRay.realShape, this.realRay );

          // add this new virtual lightRay to the virtualRay
          this.addRayShape( lightRay.virtualShape, this.virtualRay );
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

    // vector from source to optic
    const sourceOpticVector = opticPosition.minus( sourcePosition );

    if ( lightRayMode === LightRayMode.MARGINAL_RAYS ) {

      // direction for ray going through the center of optic
      directions.push( sourceOpticVector.normalized() );

      // the top of the optic
      const topPoint = optic.getExtremumPoint( sourcePosition,
        this.targetImage.positionProperty.value, { location: Optic.Location.TOP } );

      // the bottom of the optic
      const bottomPoint = optic.getExtremumPoint( sourcePosition,
        this.targetImage.positionProperty.value, { location: Optic.Location.BOTTOM } );

      // direction of a ray to the top of the optic
      const topDirection = topPoint.minus( sourcePosition ).normalized();

      // direction of a ray to the bottom of the optic
      const bottomDirection = bottomPoint.minus( sourcePosition ).normalized();

      directions.push( topDirection, bottomDirection );
    }
    else if ( lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

      // horizontal direction
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
    else if ( lightRayMode === LightRayMode.MANY_RAYS ) {

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
