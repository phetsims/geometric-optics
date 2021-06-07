// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the guides at both ends of the lens
 *
 * @author Sarah Chang, Swarthmore College
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
   * @param {object} config
   */
  constructor( objectPositionProperty, optic, config ) {

    config = merge( {
      location: Guide.Location.TOP
    }, config );

    // @public {Property.<Vector2>} position of the fulcrum point
    this.fulcrumPositionProperty = new DerivedProperty( [ optic.positionProperty, optic.diameterProperty ],
      ( opticPosition, opticDiameter ) => {
        const sign = ( config.location === Guide.Location.TOP ) ? +1 : -1;

        return opticPosition.plusXY( 0, sign * opticDiameter / 2 );
      } );

    // @public (read-only) {Property.<number>} angle of rotation of the left-guide with respect to the x-axis
    this.incidentAngleProperty = new DerivedProperty( [ objectPositionProperty, this.fulcrumPositionProperty ],
      ( objectPosition, fulcrumPosition ) => {
        const displacementVector = fulcrumPosition.minus( objectPosition );
        return displacementVector.getAngle();
      } );

    // @public (read-only) {Property.<number>} find the internal angle between the two rectangles.
    this.internalAngleProperty = new DerivedProperty( [ optic.focalLengthProperty, optic.diameterProperty ],
      ( focalLength, diameter ) => {
        const sign = ( config.location === Guide.Location.TOP ) ? +1 : -1;
        if ( optic.isConcave( optic.getCurve() ) ) {
          // return sign * Math.atan( diameter / ( 2 * focalLength ) );
          return sign * ( -Math.atan( diameter / ( 4 * focalLength ) ) + Math.atan( 3 * diameter / ( 4 * focalLength ) ) );
        }
        else {
          return sign * 2 * Math.atan( diameter / ( 4 * focalLength ) );
        }
      } );
  }

  /**
   * @public
   * @returns {number}
   */
  getInternalAngle() {
    return this.internalAngleProperty.value;
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
