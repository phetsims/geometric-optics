// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapes is interface for describing an optic as a set of Shapes. All Shapes are in model coordinates.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';

type OpticShapesConfig = {
  fillShape: Shape,
  strokeShape: Shape,
  frontShape: Shape,
  backShape: Shape | null,
  activeBoundsShape: Shape
};

class OpticShapes {

  // Shapes used to draw the optic
  readonly fillShape: Shape;
  readonly strokeShape: Shape;

  // Shapes used for ray hit testing
  readonly frontShape: Shape;
  readonly backShape: Shape | null;

  // Shape that defines the bounds of the optically-active part of the optic
  readonly activeBoundsShape: Shape;

  /**
   * @param config
   */
  constructor( config: OpticShapesConfig ) {
    this.fillShape = config.fillShape;
    this.strokeShape = config.strokeShape;
    this.frontShape = config.frontShape;
    this.backShape = config.backShape;
    this.activeBoundsShape = config.activeBoundsShape;
  }
}

export default OpticShapes;
