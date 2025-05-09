// Copyright 2022-2025, University of Colorado Boulder

/**
 * PositionMarker is used to mark an arbitrary position.
 * See https://github.com/phetsims/geometric-optics/issues/355
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import TColor from '../../../../../scenery/js/util/TColor.js';
import geometricOptics from '../../../geometricOptics.js';
import GOTool, { GOToolOptions } from './GOTool.js';

type SelfOptions = {
  fill: TColor;
  stroke: TColor;
};

type PositionMarkerOptions = SelfOptions & PickRequired<GOToolOptions, 'tandem'>;

export default class PositionMarker extends GOTool {

  // fill and stroke for the marker
  public readonly fill: TColor;
  public readonly stroke: TColor;

  public constructor( providedOptions: PositionMarkerOptions ) {

    super( providedOptions );

    this.fill = providedOptions.fill;
    this.stroke = providedOptions.stroke;
  }
}

geometricOptics.register( 'PositionMarker', PositionMarker );