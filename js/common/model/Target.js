// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the target or image
 * Responsible for the position and scale of target.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

const OBJECT_SCALE_FACTOR = 4;

class Target {

  /**
   * @param {Property.<Vector2>} objectPositionProperty - position of the object/source
   * @param {Optic} optic - position of the optic
   * @param {Property.<representation>} representationProperty
   * @param {Tandem} tandem
   */
  constructor( objectPositionProperty,
               optic,
               representationProperty,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @private {Property.<Vector2>} position of the object/source
    this.objectPositionProperty = objectPositionProperty;

    // @private {Property.<Vector2>} position of the optic
    this.opticPositionProperty = optic.positionProperty;

    // @private (read-only) {function} returns the sign (+1 or -1) assigned to the type of optic (lens or mirror)
    this.opticGetTypeSign = optic.getTypeSign.bind( optic );

    // @public (read-only) {Property.<number>} horizontal "distance" between image and optic
    // The distance can be negative. We follow the standard sign convention
    // used in geometric optics courses.
    this.imageOpticDistanceProperty = new DerivedProperty(
      [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {

        // {number} horizontal distance between optic and source/object
        const opticObjectDistance = this.getObjectOpticDistance( objectPosition, opticPosition );

        // address the case when the source/object share the same x position as the focal point
        if ( opticObjectDistance === focalLength ) {

          // Set the image distance to be very large (and arbitrarily positive).
          return 10e6;
        }
        else {

          // Calculated based on the thin lens law/ mirror equation
          // For a lens, a positive distance, indicates that the image is on the opposite of object (wrt to the lens)
          // For a mirror, a positive distance indicates that the image is on the same side as the object..

          return ( focalLength * opticObjectDistance ) / ( opticObjectDistance - focalLength );
        }
      } );

    // the position of the focus as predicted by lens and mirror equation
    // @public (read-only) {Property.<Vector2>}
    this.positionProperty = new DerivedProperty( [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {
        return this.getPosition( objectPosition, opticPosition, focalLength );
      } );

    // @public (read-only) {Property.<number>}
    // the scale can be negative, indicating the target/image is inverted.
    this.scaleProperty = new DerivedProperty( [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {
        return this.getScale( objectPosition, opticPosition, focalLength );
      } );

    // @public (read-only) {Property.<boolean>}
    this.isInvertedProperty = new DerivedProperty( [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      () => {
        return this.isInverted();
      } );

    // @public (read-only) {Property.<boolean>}
    this.isVirtualProperty = new DerivedProperty( [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      () => {
        return this.isVirtual();
      } );

    // @public (read-only) {Property.<bounds2>}
    // Bounds of the actual IMAGE  based on the representation
    this.boundsProperty = new DerivedProperty( [
        this.positionProperty,
        representationProperty,
        this.scaleProperty,
        this.isInvertedProperty ],
      ( position, representation, scale ) => {

        // @public {Vector2} displacement vector from the firstPosition to the left top - value depends on
        // representation values are in centimeters
        const initialOffsetPosition = representation.offsetPosition.timesScalar( 1 / OBJECT_SCALE_FACTOR );
        const initialWidth = representation.dimensions.width / OBJECT_SCALE_FACTOR;
        const initialHeight = representation.dimensions.height / OBJECT_SCALE_FACTOR;

        const offsetPosition = initialOffsetPosition.timesScalar( scale );
        const width = initialWidth * scale;
        const height = initialHeight * scale;

        const x1 = ( offsetPosition.x ) * this.opticGetTypeSign();
        const x2 = ( offsetPosition.x + width ) * this.opticGetTypeSign();
        const y1 = offsetPosition.y;
        const y2 = offsetPosition.y - height;

        const bounds = new Bounds2( Math.min( x1, x2 ), Math.min( y1, y2 ), Math.max( x1, x2 ), Math.max( y1, y2 ) );

        return bounds.shifted( position );
      } );

    // light intensity of the image (Hollywood) - a value between 0 and 1
    // @public (read-only) {Property.<number>}
    this.lightIntensityProperty = new DerivedProperty( [ this.scaleProperty, optic.diameterProperty ],
      ( scale, diameter ) => {

        // effect of the distance on the opacity, hollywooded as 1/scale for upscaled image
        const distanceFactor = Math.min( 1, Math.abs( 1 / scale ) );

        // effect of the diameter of the optic on the light intensity of the image (also hollywooded)
        const diameterFactor = optic.getNormalizedDiameter( diameter );

        // product of the two factors
        return distanceFactor * diameterFactor;
      } );

    // @public (read-only) {Property.<HTMLImageElement|null>}
    // determine the image with appropriate orientation to select for the display
    this.imageProperty = new DerivedProperty( [ representationProperty, this.isVirtualProperty ],
      ( representation, isVirtual ) => {
        const realImage = optic.isLens() ? representation.leftFacingInverted :
                          representation.rightFacingInverted;
        const virtualImage = optic.isLens() ? representation.rightFacingUpright :
                             representation.leftFacingUpright;
        return isVirtual ? virtualImage : realImage;
      } );
  }

  /**
   * Returns the horizontal distance between the object and the optical element.
   * A negative distance indicates that the object is to the right of the optical element.
   * @public
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @returns {number}
   */
  getObjectOpticDistance( objectPosition, opticPosition ) {
    return opticPosition.x - objectPosition.x;
  }

  /**
   * Is the horizontal distance between the object and the optical element positive
   * A positive distance indicates that the object is to the left of the optical element.
   * @public
   * @returns {boolean}
   */
  isObjectOpticDistancePositive() {
    return this.getObjectOpticDistance( this.objectPositionProperty.value, this.opticPositionProperty.value ) > 0;
  }

  /**
   * Returns the scale of the image, i.e. the ratio of the height of the image over the object
   * The scale will be negative if the image is inverted.
   * @public
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength - distance in centimeters
   * @returns {number}
   */
  getScale( objectPosition, opticPosition, focalLength ) {
    return this.getMagnification( objectPosition, opticPosition, focalLength );
  }

  /**
   * Returns the magnification of the image as defined in geometric optics courses.
   * A negative magnification implies that the image is inverted.
   * @public
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {number}
   */
  getMagnification( objectPosition, opticPosition, focalLength ) {

    // horizontal distance between object/source and optic
    const objectOpticDistance = this.getObjectOpticDistance( objectPosition, opticPosition );

    // prevent a division by zero
    if ( objectOpticDistance === 0 ) {

      // The magnification is 1 when the object is right on the lens or mirror.
      return 1;
    }
    else {
      return -1 * this.getImageOpticDistance() / objectOpticDistance;
    }
  }

  /**
   * Returns the "height" of the image in model coordinates.
   * The height is determined as the vertical offset from the optical axis of the focus point
   * The height can be negative if the image is inverted
   * @public
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {number}
   */
  getHeight( objectPosition, opticPosition, focalLength ) {
    return this.getMagnification( objectPosition, opticPosition, focalLength ) *
           ( objectPosition.y - opticPosition.y );
  }

  /**
   * Returns the horizontal distance of the image from the optic.
   * Calculated based on the thin lens law/ mirror equation.
   * For a lens, a positive distance, indicates that the image is on the opposite of object (wrt to the lens)
   * For a mirror, a positive distance indicates that the image is on the same side as the object..
   * @public
   * @returns {number}
   */
  getImageOpticDistance() {
    return this.imageOpticDistanceProperty.value;
  }

  /**
   * Returns a boolean indicating if the image is inverted
   * For a lens, the image is inverted if the image is on the opposite side of the object
   * For a mirror, the image is inverted if the image is on the same side of the object
   * @public
   * @returns {boolean}
   */
  isInverted() {
    return this.isImageOpticDistancePositive();
  }

  /**
   * Returns a boolean indicating if the image is upright
   * @public
   * @returns {boolean}
   */
  isUpright() {
    return !this.isInverted();
  }

  /**
   * Returns the position of the target point
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {Vector2}
   * @public
   */
  getPosition( objectPosition, opticPosition, focalLength ) {

    // height of the object, measured from the optical axis
    const height = this.getHeight( objectPosition, opticPosition, focalLength );

    // horizontal distance between image and optic.
    const imageOpticDistance = this.getImageOpticDistance();

    // recall that the meaning of imageOpticDistance is different for a lens and mirror.
    const horizontalDisplacement = this.opticGetTypeSign() * imageOpticDistance;

    return opticPosition.plusXY( horizontalDisplacement, height );
  }

  /**
   * Returns a boolean indicating if the image is virtual
   * For a lens, the image is virtual if the image is on the same side as the object
   * For a mirror, the image is virtual if the image is on the opposite of the object
   *
   * @public
   * @returns {boolean}
   */
  isVirtual() {
    return this.isImageOpticDistanceNegative();
  }

  /**
   * Is the image real
   * @public
   * @returns {boolean}
   */
  isReal() {
    return !this.isVirtual();
  }

  /**
   * Returns a boolean indicating if the distance between the image and optical element is positive
   * @public
   * @returns {boolean}
   */
  isImageOpticDistancePositive() {
    return this.getImageOpticDistance() > 0;
  }

  /**
   * Returns a boolean indicating if the distance between the image and optical element is negative
   * @public
   * @returns {boolean}
   */
  isImageOpticDistanceNegative() {
    return this.getImageOpticDistance() < 0;
  }
}

geometricOptics.register( 'Target', Target );
export default Target;
