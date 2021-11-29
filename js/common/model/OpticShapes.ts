// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes is interface for describing an optic as a set of Shapes. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';

interface OpticShapes {

  // the front (left facing) contour of the optic, used for ray hit testing
  readonly frontShape: Shape;

  // the back (right facing) contour of the lens, used for ray hit testing with a lens.
  // null for mirror, because there is no hit testing for mirror.
  readonly backShape: Shape | null;

  // the entire shape of the lens, or the backing of the mirror
  readonly fillShape: Shape;

  // the external surface of the lens, or the reflective coating of the mirror
  readonly strokeShape: Shape;
}

export default OpticShapes;
