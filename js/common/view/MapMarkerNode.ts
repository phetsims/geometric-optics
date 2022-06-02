// Copyright 2022, University of Colorado Boulder

/**
 * MapMarkerNode is the FontAwesome 'map marker' icon. It is re-purposed for position markers in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions, Path, PathOptions } from '../../../../scenery/js/imports.js';
import mapMarkerAltSolidShape from '../../../../sherpa/js/fontawesome-5/mapMarkerAltSolidShape.js';
import geometricOptics from '../../geometricOptics.js';

type MapMarkerNodeOptions = PickOptional<NodeOptions, 'scale' | 'tagName'> & PickRequired<PathOptions, 'fill' | 'stroke'>;

export default class MapMarkerNode extends Node {

  public constructor( providedOptions: MapMarkerNodeOptions ) {

    super( providedOptions );

    const mapMarkerNode = new Path( mapMarkerAltSolidShape, {
      fill: providedOptions.fill,
      stroke: providedOptions.stroke,
      lineWidth: 12,
      rotation: Math.PI,
      opacity: 0.85
    } );
    this.addChild( mapMarkerNode );

    // slight vertical elongation
    mapMarkerNode.setScaleMagnitude( 0.06, 0.07 );
  }
}

geometricOptics.register( 'MapMarkerNode', MapMarkerNode );