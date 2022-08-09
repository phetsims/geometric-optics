// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthModel is the type that models of focal length must implement.
 * (I'm using type instead of interface to avoid the pitfalls of declaration merging.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type FocalLengthModel = {

  // Magnitude of the focal length in cm, absent the sign that indicates whether it's converging or diverging
  readonly focalLengthMagnitudeProperty: TReadOnlyProperty<number>;

  // Magnitude of the radius of curvature (ROC) in cm, absent the sign that indicates whether the vertex lies to the
  // left or right of the center of curvature
  readonly radiusOfCurvatureMagnitudeProperty: TReadOnlyProperty<number>;

  // Index of refraction (IOR), unitless
  readonly indexOfRefractionProperty: TReadOnlyProperty<number>;
};

export default FocalLengthModel;