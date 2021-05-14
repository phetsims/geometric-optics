// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the target or image
 * Responsible for the position and scale of target.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class TargetImage {

  /**
   * @param {SourceObject} sourceObject
   * @param {OpticalElement} opticalElement
   * @param {Tandem} tandem
   */
  constructor( sourceObject, opticalElement, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public (read-only) {SourceObject}
    this.sourceObject = sourceObject;

    // @public (read-only) {OpticalElement}
    this.opticalElement = opticalElement;

    // @public (read-only) {DerivedProperty.<boolean>}
    this.isInvertedProperty = new DerivedProperty( [ sourceObject.positionProperty,
      opticalElement.positionProperty,
      opticalElement.focalLengthProperty ], () => {
      return this.isInverted();
    } );

    // @public (read-only) {DerivedProperty.<number>}
    this.scaleProperty = new DerivedProperty( [ sourceObject.positionProperty,
      opticalElement.positionProperty,
      opticalElement.focalLengthProperty ], () => {
      return this.scale();
    } );

    // updates the position of the image
    // @public (read-only) {DerivedProperty.<Vector2>}
    this.positionProperty = new DerivedProperty( [ sourceObject.positionProperty,
        opticalElement.positionProperty,
        opticalElement.focalLengthProperty ],
      ( objectPosition, opticalElementPosition, focalLength ) => {
        return this.position( objectPosition, opticalElementPosition, focalLength );
      } );

  }

  /**
   * Return the scale of the image, i.e. the ratio of the height of the image over the object
   * The scale will be negative if the image is inverted.
   * @returns {number}
   * @public
   */
  scale() {
    const focalLength = this.getFocalLength();
    return focalLength / ( this.getObjectOpticalElementDistance() - focalLength );
  }

  /**
   * Returns the height of the image in meter.
   * The height can be negative if the image is upside down.
   * @public
   * @returns {number}
   */
  getHeight() {
    return this.getMagnification() * ( this.sourceObject.positionProperty.value.y -
                                       this.opticalElement.positionProperty.value.y );
  }

  /**
   * Returns the magnification of the image.
   * A negative magnification implies that the image is inverted.
   * @public
   * @returns {number}
   */
  getMagnification() {
    return -1 * this.getImageOpticalElementDistance() / this.getObjectOpticalElementDistance();
  }

  /**
   * Returns the horizontal distance between the object and the optical element.
   * A negative distance indicates that the object is to the right of the optical element.
   * @public
   * @returns {number}
   */
  getObjectOpticalElementDistance() {
    return this.opticalElement.positionProperty.value.x - this.sourceObject.positionProperty.value.x;
  }

  /**
   * Returns the focal length of the optical element in meters
   * The focal length is positive for converging optical elements and negative for diverging.
   * @public
   * @returns {number}
   */
  getFocalLength() {
    return this.opticalElement.focalLengthProperty.value;
  }

  /**
   * Returns the horizontal distance of the image from the opticalElement.
   * A negative distance indicates that the image os to the left of the optical element.
   * @public
   * @returns {number}
   */
  getImageOpticalElementDistance() {
    const distanceObject = this.getObjectOpticalElementDistance();
    const f = this.getFocalLength();
    return ( f * distanceObject ) / ( distanceObject - f );
  }

  /**
   * Returns a boolean indicating if the image is inverted
   * For a lens, the image is inverted if the image is on the opposite side of the object
   * For a mirror, the image is inverted if the image is on the same side of the object
   * @public
   * @returns {boolean}
   */
  isInverted() {
    return this.opticalElement.isLens() ? this.isOppositeSide() : this.isSameSide();
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
    return this.opticalElement.isLens() ? this.isSameSide() : this.isOppositeSide();
  }

  /**
   * Returns a boolean indicating if the image is on the same (spatial) side of the object (with respect to the optical element)
   * @public
   * @returns {boolean}
   */
  isSameSide() {
    const sign = Math.sign( this.getImageOpticalElementDistance() * this.getObjectOpticalElementDistance() );
    return sign === 1;
  }

  /**
   * Returns a boolean indicating if the image is on the opposite side of the optical element from the object
   * @public
   * @returns {boolean}
   */
  isOppositeSide() {
    return !this.isSameSide();
  }

  /**
   * returns the position of the image
   * @param {Vector2} objectPosition
   * @param {Vector2} opticalElementPosition
   * @param {number} focalLength
   * @returns {Vector2}
   * @public
   */
  position( objectPosition, opticalElementPosition, focalLength ) {
    const distanceObject = opticalElementPosition.x - objectPosition.x;
    const heightObject = objectPosition.y - opticalElementPosition.y;
    const f = focalLength;
    const sign = this.opticalElement.isLens() ? 1 : -1;
    const distanceImage = sign * ( f * distanceObject ) / ( distanceObject - f );
    const magnification = -1 * distanceImage / distanceObject;
    const yOffset = sign * heightObject * magnification;
    return opticalElementPosition.plus( new Vector2( distanceImage, yOffset ) );
  }
}

geometricOptics.register( 'TargetImage', TargetImage );
export default TargetImage;
