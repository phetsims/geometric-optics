// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapes identifies the Shapes that are common to all optics. Shapes are specified in model coordinates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import { Shape } from '../../../../kite/js/imports.js';

//REVIEW: A bit confusing that this is somewhat unrelated to OpticShape
interface OpticShapes {

  // Shapes used for ray hit testing
  //REVIEW: Guidelines note that `public` use should be consistent within a repo. Add `public` here?
  readonly frontShape: Shape; // front (left-facing) surface, first to be hit by rays
  readonly backShape: Shape | null; // null if there is no ray hit testing on the back

  // Shape that defines the bounds of the optically-active part of the optic
  //REVIEW: Guidelines note that `public` use should be consistent within a repo. Add `public` here?
  readonly activeBoundsShape: Shape;
}

export default OpticShapes;
