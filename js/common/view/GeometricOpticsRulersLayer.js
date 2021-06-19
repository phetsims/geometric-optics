// Copyright 2021, University of Colorado Boulder

/**
 * A layer that contains 1 horizontal ruler and 1 vertical ruler
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

    // @public
    this.visibleHorizontalProperty = new BooleanProperty( false );

    // @public
    this.visibleVerticalProperty = new BooleanProperty( false );

    /**
     * Create and Add GeometricOpticsRulerNode
     * @param {Ruler} ruler
     * @param {number} absoluteScale
     * @param {Property.<boolean>} visibleProperty
     * @returns {GeometricOpticsRulerNode}
     */
    const addRulerNode = ( ruler, absoluteScale, visibleProperty ) => {

      // we want to scale model length inversely as the scale such that the view length remains the same
      ruler.scaleLength( 1 / absoluteScale );

      const rulerOptions = {
        majorTickDistance: 0.1 / absoluteScale // in model coordinate (m)
      };

      const rulerNode = new GeometricOpticsRulerNode(
        ruler,
        visibleProperty,
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
      this.horizontalRulerNode = addRulerNode( rulers.horizontal, absoluteScale, this.visibleHorizontalProperty );
      this.verticalRulerNode = addRulerNode( rulers.vertical, absoluteScale, this.visibleVerticalProperty );

      this.horizontalRulerNode.setToolboxPanelBounds( this.toolboxPanelBounds );
      this.verticalRulerNode.setToolboxPanelBounds( this.toolboxPanelBounds );
    } );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    this.horizontalRulerNode.reset();
    this.verticalRulerNode.reset();
    this.visibleHorizontalProperty.reset();
    this.visibleVerticalProperty.reset();
  }

  /**
   * passes the panel bounds to each ruler
   * @public
   * @param {Bounds2} bounds
   */
  setToolboxPanelBounds( bounds ) {
    this.toolboxPanelBounds = bounds;
    this.horizontalRulerNode.setToolboxPanelBounds( this.toolboxPanelBounds );
    this.verticalRulerNode.setToolboxPanelBounds( this.toolboxPanelBounds );
  }
}

geometricOptics.register( 'GeometricOpticRulersLayer', GeometricOpticRulersLayer );
export default GeometricOpticRulersLayer;
