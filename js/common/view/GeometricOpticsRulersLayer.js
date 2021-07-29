// Copyright 2021, University of Colorado Boulder

/**
 * A layer that contains 1 horizontal ruler and 1 vertical ruler
 *
 * Since the GeometricOpticRulerNode is non mutable, a new ruler node is
 *
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';

class GeometricOpticRulersLayer extends Node {
  /**
   * @param {horizontal: Ruler, vertical:Ruler} rulers - model of rulers
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

    // @public {Property.<boolean>}
    this.visibleHorizontalProperty = new BooleanProperty( false );

    // @public {Property.<boolean>}
    this.visibleVerticalProperty = new BooleanProperty( false );

    // @public {Bounds2} - will be updated later.
    this.toolboxPanelBounds = Bounds2.EVERYTHING;

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

      // only vertical ruler has tick marks on bottom
      const tickMarksOnBottom = ruler.isVertical();

      const rulerOptions = {
        majorTickDistance: 10 / absoluteScale, // in model coordinate (m)
        tickMarksOnBottom: tickMarksOnBottom
      };

      const rulerNode = new GeometricOpticsRulerNode(
        ruler,
        visibleProperty,
        visibleBoundsProperty,
        this.toolboxPanelBounds,
        modelViewTransformProperty.value,
        rulerOptions );

      this.addChild( rulerNode );

      return rulerNode;
    };

    // update rulers when scale changes
    absoluteScaleProperty.link( absoluteScale => {

      // since RulerNode is not mutable, remove all children
      this.removeAllChildren();

      // dispose of the rulers
      this.disposeRulers();

      // create and add rulers, keeping a reference to the added ruler
      this.horizontalRulerNode = addRulerNode( rulers.horizontal, absoluteScale, this.visibleHorizontalProperty );
      this.verticalRulerNode = addRulerNode( rulers.vertical, absoluteScale, this.visibleVerticalProperty );

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
   * set the panel bounds of the toolbox
   * @public
   * @param {Bounds2} bounds
   */
  setToolboxPanelBounds( bounds ) {
    this.toolboxPanelBounds = bounds;

    // passed the toolbox bounds to the ruler Nodes
    this.assignToolboxPanelBounds();
  }

  /**
   * updates the panel bounds to each ruler
   * @public
   */
  assignToolboxPanelBounds() {
    this.horizontalRulerNode.setToolboxPanelBounds( this.toolboxPanelBounds );
    this.verticalRulerNode.setToolboxPanelBounds( this.toolboxPanelBounds );
  }

  /**
   * @public
   */
  disposeRulers() {
    if ( this.horizontalRulerNode instanceof GeometricOpticsRulerNode ) {
      this.horizontalRulerNode.dispose();
    }

    if ( this.verticalRulerNode instanceof GeometricOpticsRulerNode ) {
      this.verticalRulerNode.dispose();
    }
  }
}

geometricOptics.register( 'GeometricOpticRulersLayer', GeometricOpticRulersLayer );
export default GeometricOpticRulersLayer;
