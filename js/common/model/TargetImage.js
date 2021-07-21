// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the target or image
 * Responsible for the position and scale of target.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TargetImage {

  /**
   * @param {Property.<Vector2>} objectPositionProperty
   * @param {Optic} optic
   * @param {Tandem} tandem
   */
  constructor( objectPositionProperty, optic, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @private {Property.<Vector2>}
    this.objectPositionProperty = objectPositionProperty;

    // @private {Property.<Vector2>}
    this.opticPositionProperty = optic.positionProperty;

    // @private (read-only) {function}
    this.opticGetTypeSign = optic.getTypeSign.bind( optic );

    // @public (read-only) {Property.<number>}
    this.imageOpticDistanceProperty = new DerivedProperty(
      [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {
        const opticObjectDistance = this.getObjectOpticDistance( objectPosition, opticPosition );
        if ( opticObjectDistance === focalLength ) {

          // the object is located on the focal point. Set the image distance to be very large
          return 10e6;
        }
        else {
          return ( focalLength * opticObjectDistance ) / ( opticObjectDistance - focalLength );
        }
      } );

    // updates the position of the image
    // @public (read-only) {Property.<Vector2>}
    this.positionProperty = new DerivedProperty( [ objectPositionProperty,
        optic.positionProperty,
        optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {
        return this.getPosition( objectPosition, opticPosition, focalLength );
      } );


    // @public (read-only) {Property.<number>}
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


    // light intensity of the image (Hollywood) - a value between 0 and 1
    // @public (read-only) {Property.<number>}
    this.lightIntensityProperty = new DerivedProperty( [ this.scaleProperty, optic.diameterProperty ], ( scale, diameter ) => {
      const distanceFactor = Math.min( 1, Math.abs( 1 / scale ) );
      const diameterFactor = optic.getNormalizedDiameter( diameter );
      return distanceFactor * diameterFactor;
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
   * Return the scale of the image, i.e. the ratio of the height of the image over the object
   * The scale will be negative if the image is inverted.
   * @returns {number}
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @public
   */
  getScale( objectPosition, opticPosition, focalLength ) {
    return this.getMagnification( objectPosition, opticPosition, focalLength );
  }

  /**
   * Returns the magnification of the image.
   * A negative magnification implies that the image is inverted.
   * @public
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {number}
   */
  getMagnification( objectPosition, opticPosition, focalLength ) {
    const objectOpticDistance = this.getObjectOpticDistance( objectPosition, opticPosition );
    if ( objectOpticDistance === 0 ) {

      // if the object is right on the lens or mirror, there is no magnification
      return 1;
    }
    else {
      return -1 * this.getImageOpticDistance() / this.getObjectOpticDistance( objectPosition, opticPosition );
    }
  }

  /**
   * Returns the height of the image in model coordinates.
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
   * returns the position of the image
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

geometricOptics.register( 'TargetImage', TargetImage );
export default TargetImage;
