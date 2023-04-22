// Copyright 2021-2023, University of Colorado Boulder

/**
 * Guide is the model element for the guides at both ends of the lens.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Optic from './Optic.js';
import geometricOptics from '../../geometricOptics.js';

export type GuideLocation = 'top' | 'bottom';

export default class Guide {

  // position of the fulcrum point, in cm
  public readonly fulcrumPositionProperty: TReadOnlyProperty<Vector2>;

  // angle of rotation of the incident guide with respect to the positive x-axis, in radians
  public readonly incidentAngleProperty: TReadOnlyProperty<number>;

  // the angle of the transmitted guide with respect to the positive x-axis, in radians
  public readonly transmittedAngleProperty: TReadOnlyProperty<number>;

  /**
   * @param optic - the optic that this guide is associated with
   * @param opticalObjectPositionProperty - position of the optical object
   * @param location - location of the guide, relative to the optic
   */
  public constructor( optic: Optic, opticalObjectPositionProperty: TReadOnlyProperty<Vector2>, location: GuideLocation ) {

    // sign is positive for top guide and negative below
    const locationSign = ( location === 'top' ) ? +1 : -1;

    this.fulcrumPositionProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty ],
      ( opticPosition, opticDiameter ) =>
        opticPosition.plusXY( 0, locationSign * opticDiameter / 2 ) );

    this.incidentAngleProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, this.fulcrumPositionProperty ],
      ( opticalObjectPosition, fulcrumPosition ) => {
        const displacementVector = opticalObjectPosition.minus( fulcrumPosition );
        return displacementVector.getAngle();
      } );

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
        const deflectedAngle = ( optic.opticSurfaceTypeProperty.value === 'convex' ) ?
                               -1 * locationSign * ( 2 * Math.atan( toa ) ) :
                               -1 * locationSign * ( Math.atan( 3 * toa ) - Math.atan( toa ) );

        return throughAngle + deflectedAngle;
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

geometricOptics.register( 'Guide', Guide );
