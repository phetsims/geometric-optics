// Copyright 2021, University of Colorado Boulder

/**
 * A layer that contains 1 horizontal ruler and 1 vertical ruler
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Ruler from '../model/Ruler.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';

class RulersLayer extends Node {

  horizontalRulerNode: GeometricOpticsRulerNode;
  verticalRulerNode: GeometricOpticsRulerNode;

  /**
   * @param horizontalRuler
   * @param verticalRuler
   * @param zoomTransformProperty
   * @param absoluteScaleProperty
   * @param visibleBoundsProperty
   * @param options
   */
  constructor( horizontalRuler: Ruler, verticalRuler: Ruler, zoomTransformProperty: Property<ModelViewTransform2>,
               absoluteScaleProperty: Property<number>, visibleBoundsProperty: Property<Bounds2>, options?: any ) {

    super( options );

    this.horizontalRulerNode = new GeometricOpticsRulerNode( horizontalRuler,
      zoomTransformProperty, absoluteScaleProperty, visibleBoundsProperty );
    this.verticalRulerNode = new GeometricOpticsRulerNode( verticalRuler,
      zoomTransformProperty, absoluteScaleProperty, visibleBoundsProperty );
    this.addChild( this.horizontalRulerNode );
    this.addChild( this.verticalRulerNode );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.horizontalRulerNode.reset();
    this.verticalRulerNode.reset();
  }

  public setToolboxBounds( toolboxBounds: Bounds2 ): void {
    this.horizontalRulerNode.setToolboxBounds( toolboxBounds );
    this.verticalRulerNode.setToolboxBounds( toolboxBounds );
  }
}

geometricOptics.register( 'RulersLayer', RulersLayer );
export default RulersLayer;