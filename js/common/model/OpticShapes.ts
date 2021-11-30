// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes identifies the Shapes that describe an optic. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';

interface OpticShapes {

  // Shapes used to draw the optic, semantics are defined by subclasses.
  readonly fillShape: Shape;
  readonly strokeShape: Shape;

  // Shapes used for ray hit testing
  readonly frontShape: Shape; // front (left-facing) surface, first to be hit by rays
  readonly backShape: Shape | null; // null if there is no ray hit testing on the back

  // Shape that defines the bounds of the optically-active part of the optic
  readonly activeBoundsShape: Shape;
}

export default OpticShapes;
