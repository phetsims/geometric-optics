// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthModel is the type that models of focal length must implement.
 * (I'm using type instead of interface to avoid the pitfalls of declaration merging.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type FocalLengthModel = {

  // Magnitude of the focal length in cm, absent the sign that indicates whether it's converging or diverging
  readonly focalLengthMagnitudeProperty: IReadOnlyProperty<number>;

  // Magnitude of the radius of curvature (ROC) in cm, absent the sign that indicates whether the vertex lies to the
  // left or right of the center of curvature
  readonly radiusOfCurvatureMagnitudeProperty: IReadOnlyProperty<number>;

  // Index of refraction (IOR), unitless
  readonly indexOfRefractionProperty: IReadOnlyProperty<number>;
};

export default FocalLengthModel;