// Copyright 2022, University of Colorado Boulder

/**
 * FocalLengthModel is the interface for models of focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

interface FocalLengthModel {
  readonly focalLengthProperty: IReadOnlyProperty<number>;
  readonly radiusOfCurvatureProperty: IReadOnlyProperty<number>;
  readonly indexOfRefractionProperty: IReadOnlyProperty<number>;
}

export default FocalLengthModel;