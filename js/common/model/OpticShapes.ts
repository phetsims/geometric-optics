// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes is interface for describing an optic as a set of Shapes. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';

interface OpticShapes {

  // Shapes used to draw the optic
  readonly fillShape: Shape;
  readonly strokeShape: Shape;

  // Shapes used for ray hit testing
  readonly frontShape: Shape;
  readonly backShape: Shape | null;
}

export default OpticShapes;
