// Copyright 2021, University of Colorado Boulder

/**
 * Guide is the model element for the guides at both ends of the lens.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';

type GuideLocation = 'top' | 'bottom';

class Guide {

  // position of the fulcrum point, in cm
  readonly fulcrumPositionProperty: DerivedProperty<Vector2>;

  // angle of rotation of the incident guide with respect to the positive x-axis, in radians
  readonly incidentAngleProperty: DerivedProperty<number>;

  // the angle of the transmitted guide with respect to the positive x-axis, in radians
  readonly transmittedAngleProperty: DerivedProperty<number>;

  /**
   * @param {Optic} optic
   * @param {Property.<Vector2>} objectPositionProperty
   * @param {GuideLocation} location
   */
  // eslint-disable-next-line no-undef
  constructor( optic: Optic, objectPositionProperty: Property<Vector2>, location: GuideLocation ) {

    // sign is positive for top guide and negative below
    const locationSign = ( location === 'top' ) ? +1 : -1;

    this.fulcrumPositionProperty = new DerivedProperty<Vector2>(
      [ optic.positionProperty, optic.diameterProperty ],
      ( opticPosition: Vector2, opticDiameter: number ) =>
        opticPosition.plusXY( 0, locationSign * opticDiameter / 2 )
    );

    this.incidentAngleProperty = new DerivedProperty<number>(
      [ objectPositionProperty, this.fulcrumPositionProperty ],
      ( objectPosition: Vector2, fulcrumPosition: Vector2 ) => {
        const displacementVector = objectPosition.minus( fulcrumPosition );
        return displacementVector.getAngle();
      } );

    this.transmittedAngleProperty = new DerivedProperty<number>(
      [ optic.focalLengthProperty, optic.diameterProperty, this.incidentAngleProperty ],
      ( focalLength: number, diameter: number, incidentAngle: number ) => {

        // transmitted angle if the optic was a blank.
        const throughAngle = incidentAngle + Math.PI;

        // ground truth for the deflection angle is determined such that the transmitted guide is perfectly aligned
        // with rays when the object is at a distance 2f on the optical axis.

        // ratio of opposite side (diameter/2) over adjacent side (2*focalLength)
        const toa = diameter / ( 4 * focalLength );

        // deflected angle is measured from the "through angle", i.e. angle of an imaginary undeflected transmitted ray
        const deflectedAngle = ( optic.opticShapeProperty.value === 'convex' ) ?
                               -1 * locationSign * ( 2 * Math.atan( toa ) ) :
                               -1 * locationSign * ( Math.atan( 3 * toa ) - Math.atan( toa ) );

        return throughAngle + deflectedAngle;
      } );
  }
}

geometricOptics.register( 'Guide', Guide );
export default Guide;
export { GuideLocation };