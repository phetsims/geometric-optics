// Copyright 2021, University of Colorado Boulder

/**
 * Guide is the model element for the guides at both ends of the lens.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

class Guide {

  /**
   * @param {Optic} optic
   * @param {Property.<Vector2>} objectPositionProperty
   * @param {Guide.Location} location
   */
  constructor( optic, objectPositionProperty, location ) {

    assert && assert( objectPositionProperty instanceof Property );
    assert && assert( optic instanceof Optic );

    // sign is positive for top guide and negative below
    const locationSign = ( location === Guide.Location.TOP ) ? +1 : -1;

    // @public {DerivedProperty.<Vector2>} position of the fulcrum point
    this.fulcrumPositionProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty ],
      ( opticPosition, opticDiameter ) => opticPosition.plusXY( 0, locationSign * opticDiameter / 2 )
    );

    // @public {DerivedProperty.<number>}
    // angle of rotation of the incident guide with respect to the positive x-axis
    this.incidentAngleProperty = new DerivedProperty(
      [ objectPositionProperty, this.fulcrumPositionProperty ],
      ( objectPosition, fulcrumPosition ) => {
        const displacementVector = objectPosition.minus( fulcrumPosition );
        return displacementVector.getAngle();
      } );

    // @public {DerivedProperty.<number>}
    // find the angle of the transmitted guide with respect to the positive x-axis
    this.transmittedAngleProperty = new DerivedProperty(
      [ optic.focalLengthProperty, optic.diameterProperty, this.incidentAngleProperty ],
      ( focalLength, diameter, incidentAngle ) => {

        // transmitted angle if the optic was a blank.
        const throughAngle = incidentAngle + Math.PI;

        // ground truth for the deflection angle is determined such that the transmitted guide is perfectly aligned
        // with rays when the object is at a distance 2f on the optical axis.

        // ratio of opposite side (diameter/2) over adjacent side (2*focalLength)
        const toa = diameter / ( 4 * focalLength );

        // deflected angle is measured from the "through angle", i.e. angle of an imaginary undeflected transmitted ray
        const deflectedAngle = ( optic.isConvex( optic.opticShapeProperty.value ) ) ?
                               -1 * locationSign * ( 2 * Math.atan( toa ) ) :
                               -1 * locationSign * ( Math.atan( 3 * toa ) - Math.atan( toa ) );

        return throughAngle + deflectedAngle;
      } );
  }

  /**
   * Gets the transmitted angle of the guide (right side) with respect to the x-axis
   * @public
   * @returns {number}
   */
  getTransmittedAngle() {
    return this.transmittedAngleProperty.value;
  }

  /**
   * Gets the incident angle of the guide (left side)
   * @public
   * @returns {number}
   */
  getIncidentAngle() {
    return this.incidentAngleProperty.value;
  }
}

Guide.Location = Enumeration.byKeys( [ 'TOP', 'BOTTOM' ] );

geometricOptics.register( 'Guide', Guide );
export default Guide;