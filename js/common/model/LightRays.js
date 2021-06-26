// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Rays
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay from './LightRay.js';
import LightRayMode from './LightRayMode.js';

class LightRays {

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<LightRayMode>} lightRayModeProperty
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {Optic} optic
   * @param {TargetImage} targetImage
   * @param {Tandem} tandem
   */
  constructor( timeProperty, lightRayModeProperty, sourceObjectPositionProperty, optic, targetImage, tandem ) {
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

    Property.multilink( [
        sourceObjectPositionProperty,
        optic.positionProperty,
        lightRayModeProperty,
        timeProperty,
        optic.diameterProperty,
        optic.focalLengthProperty,
        optic.curveProperty ],
      ( sourcePosition, opticPosition, lightRayMode, time, opticDiameter, focalLength ) => {

        this.realRay = new Shape();

        // @public (read-only)
        this.virtualRay = new Shape();

        const targetPoint = targetImage.positionProperty.value;
        const isVirtual = targetImage.isVirtual();

        // {Vector2[]} get the initial directions of the rays
        const directions = this.getRayDirections( sourcePosition, optic, lightRayMode );

        directions.forEach( direction => {

          // determine the lightRay
          const lightRay = new LightRay( sourcePosition,
            direction,
            time,
            optic,
            targetPoint,
            isVirtual,
            lightRayMode,
            tandem );

          // add this new real lightRay to the realRay
          this.addRayShape( lightRay.realRay, this.realRay );

          // add this new virtual lightRay to the virtualRay
          this.addRayShape( lightRay.virtualRay, this.virtualRay );
        } );
      } );
  }

  /**
   * get the initial directions of the rays for the different light ray modes.
   *
   * @private
   * @param {LightRayMode} lightRayMode
   * @param {Vector2} sourcePosition
   * @param {optic} optic
   * @returns {Vector2[]}
   */
  getRayDirections( sourcePosition, optic, lightRayMode ) {
    const directions = [];

    const f = optic.focalLengthProperty.value;
    const h = optic.diameterProperty.value / 2;

    const sourceOpticVector = optic.positionProperty.value.minus( sourcePosition );
    const sourceBottomOpticVector = sourceOpticVector.minusXY( 0, h );
    const sourceTopOpticVector = sourceOpticVector.plusXY( 0, h );


    const sourceFirstFocalVector = sourceOpticVector.minusXY( f, 0 );

    if ( sourceFirstFocalVector.x < 0 ) {
      sourceFirstFocalVector.negate();
    }
    const apertureAngle = sourceTopOpticVector.getAngle() - sourceBottomOpticVector.getAngle();

    if ( lightRayMode === LightRayMode.MARGINAL_RAYS ) {


      // ray at the top of optic

      directions.push( sourceTopOpticVector.normalized() );

      // ray going through the optic
      directions.push( sourceOpticVector.normalized() );

      // ray going through the bottom of the optic
      directions.push( sourceBottomOpticVector.normalized() );

    }
    else if ( lightRayMode === LightRayMode.PRINCIPAL_RAYS ) {

      // horizontal ray
      directions.push( new Vector2( 1, 0 ) );

      // ray going through the optic
      directions.push( sourceOpticVector.normalized() );

      // ray going through the focal point
      directions.push( sourceFirstFocalVector.normalized() );

    }
    else if ( lightRayMode === LightRayMode.MANY_RAYS ) {

      const startingAngle = Math.min( Math.PI / 4, apertureAngle );

      const endAngle = -startingAngle;

      const N = 10; // Number of rays
      const deltaTheta = ( endAngle - startingAngle ) / ( N - 1 ); // Degrees between adjacent arrays

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
