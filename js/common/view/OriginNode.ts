// Copyright 2021-2022, University of Colorado Boulder

/**
 * OriginNode is a debugging Node used to show where the origin is of something in the view, by drawing a small red dot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Circle } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';

export default class OriginNode extends Circle {
  public constructor() {
    super( 3, {
      fill: 'red'
    } );
  }
}

geometricOptics.register( 'OriginNode', OriginNode );