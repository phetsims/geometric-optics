// Copyright 2021, University of Colorado Boulder

/**
 * OriginNode is a debugging Node used to show where the origin is of something in the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Circle } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';

class OriginNode extends Circle {
  constructor() {
    super( 3, {
      fill: 'red'
    } );
  }
}

geometricOptics.register( 'OriginNode', OriginNode );
export default OriginNode;