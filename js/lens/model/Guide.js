// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the guides at both ends of the lens
 *
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';

class Guide {
  /**
   *
   * @param {Property.<Vector2>} objectPositionProperty
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( objectPositionProperty, optic, options ) {

    options = merge( {
      location: Guide.Location.TOP
    }, options );

    // sign is positive for top guide and negative below
    const locationSign = ( options.location === Guide.Location.TOP ) ? +1 : -1;

    // @public {Property.<Vector2>} position of the fulcrum point
    this.fulcrumPositionProperty = new DerivedProperty( [ optic.positionProperty, optic.diameterProperty ],
      ( opticPosition, opticDiameter ) => {
        return opticPosition.plusXY( 0, locationSign * opticDiameter / 2 );
      } );

    // @public (read-only) {Property.<number>} angle of rotation of the incident guide with respect to the positive
    // x-axis
    this.incidentAngleProperty = new DerivedProperty( [ objectPositionProperty, this.fulcrumPositionProperty ],
      ( objectPosition, fulcrumPosition ) => {
        const displacementVector = objectPosition.minus( fulcrumPosition );
        return displacementVector.getAngle();
      } );

    // @public (read-only) {Property.<number>} find the angle of the transmitted guide with respect to the positive
    // x-axis
    this.transmittedAngleProperty = new DerivedProperty( [ optic.focalLengthProperty, optic.diameterProperty, this.incidentAngleProperty ],
      ( focalLength, diameter, incidentAngle ) => {

        // transmitted angle if the optic was a blank.
        const throughAngle = incidentAngle + Math.PI;

        // ground truth for the deflection angle is determined such that the transmitted guide is perfectly aligned
        // with rays when the object is at a distance 2f on the optical axis.

        // ratio of opposite side (diameter/2) over adjacent side (2*focalLength)
        const toa = diameter / ( 4 * focalLength );

        // deflected angle is measured from the "through angle", i.e angle of an imaginary undeflected transmitted ray
        const deflectedAngle = ( optic.isConvex( optic.getCurve() ) ) ?
                               -1 * locationSign * ( 2 * Math.atan( toa ) ) :
                               -1 * locationSign * ( Math.atan( 3 * toa ) - Math.atan( toa ) );

        return throughAngle + deflectedAngle;
      } );
  }

  /**
   * @public
   * @returns {number}
   */
  getTransmittedAngle() {
    return this.transmittedAngleProperty.value;
  }

  /**
   * @public
   * @returns {number}
   */
  getIncidentAngle() {
    return this.incidentAngleProperty.value;
  }

  /**
   * @public
   * @returns {Vector2}
   */
  getPosition() {
    return this.fulcrumPositionProperty.value;
  }
}

Guide.Location = Enumeration.byKeys( [ 'TOP', 'BOTTOM' ] );

geometricOptics.register( 'Guide', Guide );
export default Guide;
