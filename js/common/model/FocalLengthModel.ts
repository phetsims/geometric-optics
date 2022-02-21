// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthModel is the interface for models of focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

interface FocalLengthModel {

  // Magnitude of the focal length (cm), absent the sign that indicates whether it's converging or diverging.
  readonly focalLengthMagnitudeProperty: IReadOnlyProperty<number>;

  // Magnitude of the radius of curvature (cm), absent the sign that indicates whether the vertex lies to the
  // left or right of the center of curvature.
  readonly radiusOfCurvatureMagnitudeProperty: IReadOnlyProperty<number>;

  // Index of refraction (unitless)
  readonly indexOfRefractionProperty: IReadOnlyProperty<number>;
}

export default FocalLengthModel;