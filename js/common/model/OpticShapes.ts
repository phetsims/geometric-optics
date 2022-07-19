// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapes identifies the Shapes that must be implemented by all optics. Shapes are specified in model coordinates.
 * (I'm using type instead of interface to avoid the pitfalls of declaration merging.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import { Shape } from '../../../../kite/js/imports.js';

type OpticShapes = {

  // Shapes used for ray hit testing
  readonly frontShape: Shape; // front (left-facing) surface, first to be hit by rays
  readonly backShape: Shape | null; // null if there is no ray hit testing on the back

  // Shape that defines the bounds of the optically-active part of the optic
  readonly activeBoundsShape: Shape;
};

export default OpticShapes;
