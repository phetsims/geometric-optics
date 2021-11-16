// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes is interface for describing an optic as a set of Shapes. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';

interface OpticShapes {

  // the left facing contour of the optic. This can be used for ray hit testing
  readonly frontShape: Shape;

  // the right facing contour of the lens, used for ray hit testing. null for mirror.
  readonly backShape: Shape | null;

  // the external surface of the lens, or the reflecting coating of the mirror
  readonly outlineShape: Shape;

  // the entire shape of the lens, or the backing of the mirror
  readonly fillShape: Shape;
}

export default OpticShapes;
