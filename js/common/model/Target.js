// Copyright 2021, University of Colorado Boulder

/**
 * Target is the model for what is called 'Image' in optics.  We're avoiding the term 'image' because it conflicts
 * with scenery.Image. An image can be real or virtual. It is responsible for the position, magnification, opacity,
 * and bounds.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';

class Target {

  /**
   * @param {Property.<Vector2>} objectPositionProperty - position of the source object or light source
   * @param {Optic} optic - model of the optic
   * @param {EnumerationProperty.<Representation>} representationProperty
   */
  constructor( objectPositionProperty, optic, representationProperty ) {
    assert && assert( objectPositionProperty instanceof Property );
    assert && assert( optic instanceof Optic );
    assert && assert( representationProperty instanceof EnumerationProperty );

    // @private (read-only) {number} sign (+1 or -1) for the type of optic (lens or mirror)
    this.opticSign = optic.getSign();

    // @private {DerivedProperty.<number>} horizontal "distance" between target (image) and optic
    // The distance can be negative. We follow the standard sign convention used in geometric optics courses.
    this.targetOpticDistanceProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => {

        // {number} horizontal distance between optic and source object
        const opticObjectDistance = this.getObjectOpticDistance( objectPosition, opticPosition );

        // address the case where the source object shares the same x position as the focal point
        if ( opticObjectDistance === focalLength ) {

          // Set the target distance to be very large (and arbitrarily positive).
          // This should technically be Infinity, but practically must be a (very large) finite value.
          return 10e6;
        }
        else {

          // Calculated based on the thin lens law/ mirror equation
          // For a lens, a positive distance, indicates that the target is on the opposite of object (wrt to the lens)
          // For a mirror, a positive distance indicates that the target is on the same side as the object..
          return ( focalLength * opticObjectDistance ) / ( opticObjectDistance - focalLength );
        }
      } );

    // @public
    this.visibleProperty = new BooleanProperty( false );

    // @public {DerivedProperty.<Vector2>}
    // the position of the focus as predicted by lens and mirror equation
    this.positionProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => this.getPosition( objectPosition, opticPosition, focalLength )
    );

    // @private {DerivedProperty.<number>}
    // the magnification can be negative, indicating the target/image is inverted.
    this.magnificationProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( objectPosition, opticPosition, focalLength ) => this.getMagnification( objectPosition, opticPosition, focalLength )
    );

    // @private {DerivedProperty.<boolean>}
    // For a lens, the image is virtual if the image is on the same side as the object
    // For a mirror, the image is virtual if the image is on the opposite of the object
    this.isInvertedProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      () => ( this.targetOpticDistanceProperty.value > 0 )
    );

    // @public {DerivedProperty.<boolean>}
    this.isVirtualProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      () => ( this.targetOpticDistanceProperty.value < 0 )
    );

    // @public {DerivedProperty.<bounds2>}
    // Bounds of the actual Image  based on the Representation
    this.boundsProperty = new DerivedProperty(
      [ this.positionProperty, representationProperty, this.magnificationProperty, this.isInvertedProperty ],
      ( position, representation, magnification, isInverted ) => {

        const scaleFactor = representation.getScaleFactor();
        const initialOffset = representation.rightFacingUprightOffset.timesScalar( 1 / scaleFactor );
        const initialWidth = representation.rightFacingUpright.width / scaleFactor;
        const initialHeight = representation.rightFacingUpright.height / scaleFactor;

        const offset = initialOffset.timesScalar( magnification );
        const width = initialWidth * magnification;
        const height = initialHeight * magnification;

        const x1 = this.opticSign * offset.x;
        const x2 = this.opticSign * ( offset.x + width );
        const y1 = offset.y;
        const y2 = offset.y - height;

        const bounds = new Bounds2( Math.min( x1, x2 ), Math.min( y1, y2 ), Math.max( x1, x2 ), Math.max( y1, y2 ) );

        return bounds.shifted( position );
      } );

    // @public {DerivedProperty.<number>}
    // light intensity of the image (Hollywood) - a value between 0 and 1
    this.lightIntensityProperty = new DerivedProperty(
      [ this.magnificationProperty, optic.diameterProperty ],
      ( magnification, diameter ) => {

        // effect of the distance on the opacity, Hollywooded as 1/magnification for upscaled image
        const distanceFactor = Math.min( 1, Math.abs( 1 / magnification ) );

        // effect of the diameter of the optic on the light intensity of the image (also Hollywooded)
        const diameterFactor = diameter / optic.diameterProperty.range.max;
        assert && assert( diameterFactor >= 0 && diameterFactor <= 1 );

        // product of the two factors
        return distanceFactor * diameterFactor;
      } );

    // @public {DerivedProperty.<HTMLImageElement|null>}
    // determine the image with appropriate orientation to select for the display
    this.imageProperty = new DerivedProperty(
      [ representationProperty, this.isVirtualProperty ],
      ( representation, isVirtual ) => {
        const realImage = optic.isLens() ? representation.leftFacingInverted :
                          representation.rightFacingInverted;
        const virtualImage = optic.isLens() ? representation.rightFacingUpright :
                             representation.leftFacingUpright;
        return isVirtual ? virtualImage : realImage;
      } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Returns the horizontal distance from the object to the optic.
   * A negative distance indicates that the object is to the right of the optic.
   * @private
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @returns {number}
   */
  getObjectOpticDistance( objectPosition, opticPosition ) {
    return opticPosition.x - objectPosition.x;
  }

  /**
   * Returns the magnification of the image as defined in geometric optics courses.
   * A negative magnification implies that the image is inverted.
   * @private
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength TODO not used
   * @returns {number}
   */
  getMagnification( objectPosition, opticPosition, focalLength ) {

    // horizontal distance between source object (or light source) and optic
    const objectOpticDistance = this.getObjectOpticDistance( objectPosition, opticPosition );

    // prevent a division by zero
    if ( objectOpticDistance === 0 ) {

      // The magnification is 1 when the object is right on the lens or mirror.
      return 1;
    }
    else {
      return -1 * this.targetOpticDistanceProperty.value / objectOpticDistance;
    }
  }

  /**
   * Returns the "height" of the target in model coordinates.
   * The height is determined as the vertical offset from the optical axis of the focus point.
   * The height can be negative if the target is inverted.
   * @private
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {number}
   */
  getHeight( objectPosition, opticPosition, focalLength ) {
    return this.getMagnification( objectPosition, opticPosition, focalLength ) * ( objectPosition.y - opticPosition.y );
  }

  /**
   * Returns the position of the target point
   * @private
   * @param {Vector2} objectPosition
   * @param {Vector2} opticPosition
   * @param {number} focalLength
   * @returns {Vector2}
   */
  getPosition( objectPosition, opticPosition, focalLength ) {

    // height of the object, measured from the optical axis
    const height = this.getHeight( objectPosition, opticPosition, focalLength );

    // horizontal distance between target/image and optic.
    const targetOpticDistance = this.targetOpticDistanceProperty.value;

    // recall that the meaning of targetOpticDistance is different for a lens and mirror.
    const horizontalDisplacement = this.opticSign * targetOpticDistance;

    return opticPosition.plusXY( horizontalDisplacement, height );
  }
}

geometricOptics.register( 'Target', Target );
export default Target;