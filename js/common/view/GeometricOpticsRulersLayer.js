// Copyright 2021, University of Colorado Boulder

/**
 * A maximum of 1 horizontal ruler and 1 vertical ruler can be dragged out from this toolbox panel.
 * The toolbox panel shows a miniature version of these rulers.
 * Appears in the top right corner of the simulation.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';

class GeometricOpticRulersLayer extends Node {
  /**
   * @param {{horizontal: <Ruler>, vertical:<Ruler>}} rulers - model of rulers
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {Property.<number>} absoluteScaleProperty
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( rulers,
               visibleBoundsProperty,
               absoluteScaleProperty,
               modelViewTransformProperty,
               tandem,
               options ) {

    super( options );

    /**
     * Create and Add GeometricOpticsRulerNode
     * @param {Ruler} ruler
     * @param {number} absoluteScale
     * @returns {GeometricOpticsRulerNode}
     */
    const addRulerNode = ( ruler, absoluteScale ) => {

      ruler.scaleLength( 1 / absoluteScale );

      const rulerOptions = {
        majorTickDistance: 0.1 / absoluteScale // in model coordinate (m)
      };

      const rulerNode = new GeometricOpticsRulerNode( ruler,
        new BooleanProperty( true ),
        visibleBoundsProperty,
        modelViewTransformProperty.value, rulerOptions );

      this.addChild( rulerNode );

      return rulerNode;
    };

    // update rulerNode
    absoluteScaleProperty.link( absoluteScale => {

      // remove all children
      this.removeAllChildren();

      this.horizontalRulerNode = addRulerNode( rulers.horizontal, absoluteScale );
      this.verticalRulerNode = addRulerNode( rulers.vertical, absoluteScale );
    } );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.horizontalRulerNode.reset();
    this.verticalRulerNode.reset();
  }
}

geometricOptics.register( 'GeometricOpticRulersLayer', GeometricOpticRulersLayer );
export default GeometricOpticRulersLayer;
