// Copyright 2021, University of Colorado Boulder

/**
 * A layer that contains 1 horizontal ruler and 1 vertical ruler
 *
 * @author Martin Veillette
 */

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

      // we want to scale model length inversely as the scale such that the view length remains the same
      ruler.scaleLength( 1 / absoluteScale );

      const rulerOptions = {
        majorTickDistance: 0.1 / absoluteScale // in model coordinate (m)
      };

      const rulerNode = new GeometricOpticsRulerNode(
        ruler,
        visibleBoundsProperty,
        modelViewTransformProperty.value,
        rulerOptions );

      this.addChild( rulerNode );

      return rulerNode;
    };

    // update rulers when scale changes
    absoluteScaleProperty.link( absoluteScale => {

      // since RulerNode is not mutable, remove all children
      this.removeAllChildren();

      // create and add rulers, keeping a reference to the added ruler
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

  /**
   * @public
   * @param {Bounds2} bounds
   */
  setToolboxPanelBounds( bounds ) {
    this.horizontalRulerNode.setToolboxPanelBounds( bounds );
    this.verticalRulerNode.setToolboxPanelBounds( bounds );
  }
}

geometricOptics.register( 'GeometricOpticRulersLayer', GeometricOpticRulersLayer );
export default GeometricOpticRulersLayer;
