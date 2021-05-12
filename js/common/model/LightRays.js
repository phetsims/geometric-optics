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
   * @param {OpticalElement} opticalElement
   * @param {TargetImage} targetImage
   * @param {Tandem} tandem
   */
  constructor( sourceObjectPositionProperty, opticalElement, targetImage, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    this.modeProperty = new EnumerationProperty( LightRays.Modes, LightRays.Modes.NO_RAYS );

    this.opticalElement = opticalElement;
    this.sourceObjectPositionProperty = sourceObjectPositionProperty;
    this.targetImage = targetImage;

    this.realRay = new Shape();
    this.virtualRay = new Shape();

    Property.multilink(
      [
        sourceObjectPositionProperty,
        opticalElement.positionProperty,
        this.modeProperty,
        opticalElement.diameterProperty,
        opticalElement.focalLengthProperty,
        opticalElement.curvatureTypeProperty ],
      ( sourcePosition, opticalElementPosition, mode, diameter, focalLength, type ) => {

        this.drawRays( mode,
          sourcePosition,
          opticalElementPosition,
          targetImage.positionProperty.value
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
   *   the opticalElement to point 2.
   *
   * @param {Modes} mode
   * @param {Vector2} sourcePoint
   * @param {Vector2} opticalElementPoint
   * @param {Vector2} targetPoint
   * @private
   */
  drawRays( mode, sourcePoint, opticalElementPoint, targetPoint ) {

    this.realRay = new Shape();
    this.virtualRay = new Shape();

    const Ax = sourcePoint.x;
    const Ay = sourcePoint.y;

    const Bx = opticalElementPoint.x;
    const By = opticalElementPoint.y;

    const Cx = targetPoint.x;
    const Cy = targetPoint.y;

    // Radius of opticalElement minus a bit so marginal ray hits inside opticalElement
    const h = this.opticalElement.diameterProperty.value / 2 - OPTICAL_ELEMENT_TIP_OFFSET;

    const f = this.opticalElement.focalLengthProperty.value;

    // Length of the ray (enough to go off the screen)
    const R = 30; // in meters

    // Used to store slope of line towards C
    let m;
    let m1;
    let m2;
    let m3;

    const isVirtualImage = this.targetImage.isInvertedImage();
    const objectLensDistance = this.getObjectLensDistance();

    // Draw different rays depending on the mode
    switch( mode ) {
      case LightRays.Modes.MARGINAL_RAYS:

        // Draw different rays depending on the mode
        if ( objectLensDistance > 0 ) {
          if ( !isVirtualImage ) {

            // ray passing through the top of opticalElement
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By + h );
            m1 = ( Cy - ( By + h ) ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + R, By + h + ( m1 * R ) );

            // ray passing through the center of opticalElement
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By );
            // Cannot draw line directly to C since it may be at infinity.
            m2 = ( Cy - By ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + R, By + ( m2 * R ) );

            // ray passing through the bottom of the opticalElement
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By - h );
            m3 = ( Cy - ( By - h ) ) / ( Cx - Bx );
            this.realRay.lineTo( Bx + R, By - h + ( m3 * R ) );
          }
          else {

            // ray passing through the top of the opticalElement
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By + h );
            m1 = ( ( By + h ) - Cy ) / ( Bx - Cx );
            this.realRay.lineTo( Bx + R, By + h + ( m1 * R ) );

            // ray passing through the middle of the opticalElement
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By );
            m2 = ( By - Cy ) / ( Bx - Cx );
            this.realRay.lineTo( Bx + R, By + ( m2 * R ) );

            // ray passing through the bottom of the opticalElement
            this.realRay.moveTo( Ax, Ay );
            this.realRay.lineTo( Bx, By - h );
            m3 = ( ( By - h ) - Cy ) / ( Bx - Cx );
            this.realRay.lineTo( Bx + R, By - h + ( m3 * R ) );

            // Draw virtual marginal rays
            if ( Cx > -5 * R || isVirtualImage ) {
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
      case LightRays.Modes.PRINCIPAL_RAYS:

        if ( Ax < Bx ) {
          // Ray passing through center of opticalElement
          this.realRay.moveTo( Ax, Ay );
          this.realRay.lineTo( Bx, By );
          if ( Cx > Bx ) {
            this.realRay.lineTo( Cx, Cy );
          }
          m1 = ( By - Ay ) / ( Bx - Ax );
          this.realRay.lineTo( Cx + R, Cy + ( m1 * R ) );

          // Ray parallel to the optical axis and that passes through the focal point on the other side of the opticalElement
          this.realRay.moveTo( Ax, Ay );
          this.realRay.horizontalLineTo( Bx );
          if ( Cx > Bx ) {
            this.realRay.lineTo( Cx, Cy );
          }
          m2 = ( By - Ay ) / f;
          this.realRay.lineTo( Cx + R, Cy + ( m2 * R ) );

          // Ray that passes through the focal point of the opticalElement and emerge parallel to the optical axis after the opticalElement.
          this.realRay.moveTo( Ax, Ay );
          m3 = ( By - Ay ) / ( Bx - f - Ax );
          this.realRay.lineTo( Bx, By + m3 * f );
          if ( Cx > Bx ) {
            this.realRay.lineTo( Cx, Cy );
          }
          this.realRay.horizontalLineToRelative( R );


          // Draw principal virtual rays
          if ( isVirtualImage ) {
            this.virtualRay.moveTo( Bx, By );
            this.virtualRay.lineTo( Cx, Cy );
            this.virtualRay.moveTo( Bx, Cy );
            this.virtualRay.lineTo( Cx, Cy );
            this.virtualRay.moveTo( Bx, Ay );
            this.virtualRay.lineTo( Cx, Cy );
          }
        }
        break;
      case LightRays.Modes.MANY_RAYS:
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
            if ( Cx < Ax && Cx > -5 * R || isVirtualImage ) {
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
      case LightRays.Modes.NO_RAYS:
        // no op
        break;
      default:
        throw new Error( `Can't generate rays: ${mode}` );
    }
  }

  /**
   * Returns the horizontal distance between the object and the optical element.
   * A negative distance indicates that the object is to the right of the optical element.
   * @public
   * @returns {number}
   */
  getObjectLensDistance() {
    return this.opticalElement.positionProperty.value.x - this.sourceObjectPositionProperty.value.x;
  }
}

// Enumeration for the different ray modes
// NO_RAYS implies that no rays are displayed.
// MARGINAL_RAYS show the rays at the top, center and middle of the opticalElement.
// PRINCIPAL_RAYS show the principal rays, according to the ray tracing method.
// MANY_RAYS show a shower of rays.
LightRays.Modes = Enumeration.byKeys( [
  'NO_RAYS',
  'MARGINAL_RAYS',
  'PRINCIPAL_RAYS',
  'MANY_RAYS'
] );

geometricOptics.register( 'LightRays', LightRays );
export default LightRays;
