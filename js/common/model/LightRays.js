// Copyright 2021, University of Colorado Boulder

/**
 * Model element of the Light Rays
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Property from '../../../../axon/js/Property.js';

const OPTICAL_ELEMENT_TIP_OFFSET = GeometricOpticsConstants.OPTICAL_ELEMENT_TIP_OFFSET;

class LightRays {

  /**
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {optic} optic
   * @param {TargetImage} targetImage
   * @param {Tandem} tandem
   */
  constructor( sourceObjectPositionProperty, optic, targetImage, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @private
    this.modeProperty = new EnumerationProperty( LightRays.Mode, LightRays.Mode.NO_RAYS );

    // @private {Optic}
    this.optic = optic;

    // @private {Vector2}
    this.sourceObjectPositionProperty = sourceObjectPositionProperty;

    // @private {TargetImage}
    this.targetImage = targetImage;

    // @public (read-only)
    this.realRay = new Shape();

    // @public (read-only)
    this.virtualRay = new Shape();

    Property.multilink(
      [
        sourceObjectPositionProperty,
        optic.positionProperty,
        this.modeProperty,
        optic.diameterProperty,
        optic.focalLengthProperty,
        optic.curveProperty ],
      ( sourcePosition, opticPosition, mode, opticDiameter, focalLength, curve ) => {

        this.drawRays( mode,
          sourcePosition,
          opticPosition,
          targetImage.positionProperty.value,
          opticDiameter,
          focalLength,
          curve
        );
      } );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.modeProperty.reset();
  }

  /**
   * Draws a specific set of rays onto the specified this.realRay
   *   object with the specified color from point 1 through
   *   the optic to point 2.
   *
   * @param {Mode} mode
   * @param {Vector2} sourcePoint
   * @param {Vector2} opticPoint
   * @param {Vector2} targetPoint
   * @param {number} opticDiameter
   * @param {number} focalLength
   * @private
   */
  drawRays( mode,
            sourcePoint,
            opticPoint,
            targetPoint,
            opticDiameter,
            focalLength
  ) {

    this.realRay = new Shape();
    this.virtualRay = new Shape();

    const Ax = sourcePoint.x;
    const Ay = sourcePoint.y;

    const Bx = opticPoint.x;
    const By = opticPoint.y;

    const Cx = targetPoint.x;
    const Cy = targetPoint.y;

    // Radius of optic minus a bit so marginal ray hits inside optic
    const h = opticDiameter / 2 - OPTICAL_ELEMENT_TIP_OFFSET;

    const f = focalLength;

    // Length of the ray (enough to go off the screen)
    const R = 30 // in meters

    const signedR = R * this.optic.getTypeSign(); // in meters

    // Used to store slope of line towards C
    let m;
    let m1;
    let m2;
    let m3;

    const isInverted = this.targetImage.isInverted();
    //  const isVirtual = this.targetImage.isVirtual();
    const objectOpticDistance = Bx - Ax;
    const imageOpticDistance = ( Cx - Bx ) * this.optic.getTypeSign();

    console.log( isInverted );
    // Draw different rays depending on the mode
    switch( mode ) {
      case LightRays.Mode.MARGINAL_RAYS:

        // Draw different rays depending on the mode
        if ( objectOpticDistance > 0 ) {
          if ( !isInverted ) {

            // ray passing through the top of optic
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By + h );
            m1 = ( Cy - ( By + h ) ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + signedR, By + h + ( m1 * signedR ) );

            // ray passing through the center of optic
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By );
            // Cannot draw line directly to C since it may be at infinity.
            m2 = ( Cy - By ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + signedR, By + ( m2 * signedR ) );

            // ray passing through the bottom of the optic
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By - h );
            m3 = ( Cy - ( By - h ) ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + signedR, By - h + ( m3 * signedR ) );
          }
          else {

            // ray passing through the top of the optic
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By + h );
            m1 = ( ( By + h ) - Cy ) / ( Bx - Cx );
            this.realRay.lineTo( Bx + signedR, By + h + ( m1 * signedR ) );

            // ray passing through the middle of the optic
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By );
            m2 = ( By - Cy ) / ( Bx - Cx );
            this.realRay.lineTo( Bx + signedR, By + ( m2 * signedR ) );

            // ray passing through the bottom of the optic
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By - h );
            m3 = ( ( By - h ) - Cy ) / ( Bx - Cx );
            this.realRay.lineTo( Bx + signedR, By - h + ( m3 * signedR ) );

            // Draw virtual marginal rays
            if ( Cx > -5 * signedR || isInverted ) {
              // Last condition needed to prevent problems that occur when image at infinity
              this.virtualRay.moveTo( Bx, By );
              this.virtualRay.lineTo( Cx, Cy );
              this.virtualRay.moveTo( Bx, By + h );
              this.virtualRay.lineTo( Cx, Cy );
              this.virtualRay.moveTo( Bx, By - h );
              this.virtualRay.lineTo( Cx, Cy );
            }
          }
        }

        break;
      case LightRays.Mode.PRINCIPAL_RAYS:

        if ( objectOpticDistance > 0 ) {
          // Ray passing through center of optic
          this.realRay.moveTo( Ax, Ay );
          this.realRay.lineTo( Bx, By );
          if ( Cx > Bx ) {
            this.realRay.lineTo( Cx, Cy );
          }
          m1 = this.optic.getTypeSign() * ( By - Ay ) / ( Bx - Ax );
          this.realRay.lineTo( Cx + signedR, Cy + ( m1 * signedR ) );

          // Ray parallel to the optical axis and that passes through the focal point on the other side of the optic
          this.realRay.moveTo( Ax, Ay );
          this.realRay.horizontalLineTo( Bx );
          if ( Cx > Bx ) {
            this.realRay.lineTo( Cx, Cy );
          }
          m2 = this.optic.getTypeSign() * ( By - Ay ) / f;
          this.realRay.lineTo( Cx + signedR, Cy + ( m2 * signedR ) );

          // Ray that passes through the focal point of the optic and emerge parallel to the optical axis after the optic.
          this.realRay.moveTo( Ax, Ay );
          m3 = ( By - Ay ) / ( Bx - f - Ax );
          this.realRay.lineTo( Bx, By + m3 * f );
          if ( Cx > Bx ) {
            this.realRay.lineTo( Cx, Cy );
          }
          this.realRay.horizontalLineToRelative( signedR );


          // Draw principal virtual rays
          if ( isInverted ) {
            this.virtualRay.moveTo( Bx, By );
            this.virtualRay.lineTo( Cx, Cy );
            this.virtualRay.moveTo( Bx, Cy );
            this.virtualRay.lineTo( Cx, Cy );
            this.virtualRay.moveTo( Bx, Ay );
            this.virtualRay.lineTo( Cx, Cy );
          }
        }
        break;
      case LightRays.Mode.MANY_RAYS:
        // eslint-disable-next-line no-case-declarations
        const N = 25; // Number of rays
        // eslint-disable-next-line no-case-declarations
        const deltaTheta = 180 / N; // Degrees between adjacent arrays
        // eslint-disable-next-line no-case-declarations
        const bottomSlope = ( Ay - By - h ) / ( Bx - Ax );
        // eslint-disable-next-line no-case-declarations
        const topSlope = ( Ay - By + h ) / ( Bx - Ax );

        for ( let i = 5; i < ( N - 5 ); i++ ) {
          m = Math.tan( Utils.toRadians( 90 - i * deltaTheta ) );
          if ( m > bottomSlope && m < topSlope ) {
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, Ay - m * ( Bx - Ax ) );
            m2 = ( Cy - ( Ay - m * ( Bx - Ax ) ) ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + R, Ay - m * ( Bx - Ax ) + m2 * R );
            if ( Cx < Ax && Cx > -5 * R || isInverted ) {
              this.virtualRay.moveTo( Bx, Ay - m * ( Bx - Ax ) );
              this.virtualRay.lineTo( Cx, Cy );
            }
          }
          else {
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Ax + R, Ay - m * R );
          }
        }
        break;
      case LightRays.Mode.NO_RAYS:
        // no op
        break;
      default:
        throw new Error( `Can't generate rays: ${mode}` );
    }
  }

}

// Enumeration for the different ray Mode
// NO_RAYS implies that no rays are displayed.
// MARGINAL_RAYS show the rays at the top, center and middle of the optic.
// PRINCIPAL_RAYS show the principal rays, according to the ray tracing method.
// MANY_RAYS show a shower of rays.
LightRays.Mode = Enumeration.byKeys( [
  'NO_RAYS',
  'MARGINAL_RAYS',
  'PRINCIPAL_RAYS',
  'MANY_RAYS'
] );

geometricOptics.register( 'LightRays', LightRays );
export default LightRays;
