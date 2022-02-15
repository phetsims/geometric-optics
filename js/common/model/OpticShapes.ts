// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes identifies the Shapes that are common to all optics. Shapes are specified in model coordinates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Shape from '../../../../kite/js/Shape.js';

interface OpticShapes {

  // Shapes used for ray hit testing
  readonly frontShape: Shape; // front (left-facing) surface, first to be hit by rays
  readonly backShape: Shape | null; // null if there is no ray hit testing on the back

  // Shape that defines the bounds of the optically-active part of the optic
  readonly activeBoundsShape: Shape;
}

export default OpticShapes;
