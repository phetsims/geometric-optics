// Copyright 2021, University of Colorado Boulder

/**
 * A layer that contains 1 horizontal ruler and 1 vertical ruler
 * Responsible for updating the rulers when zooming
 *
 * @author Martin Veillette
 */

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
   * @param {Object} [options]
   */
  constructor( rulers, visibleBoundsProperty, absoluteScaleProperty, modelViewTransformProperty, options ) {

    super( options );

    // @public {Bounds2} set to infinity, will be updated (mutated) later.
    this.toolboxPanelBounds = new Bounds2( Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY );

    /**
     * Returns a GeometricOpticsRulerNode
     * @param {Ruler} ruler
     * @param {number} absoluteScale
     * @returns {GeometricOpticsRulerNode}
     */
    const getGeometricOpticsRulerNode = ( ruler, absoluteScale ) => {

      const rulerOptions = getOptions( ruler, absoluteScale );

      return new GeometricOpticsRulerNode(
        ruler,
        visibleBoundsProperty,
        this.toolboxPanelBounds,
        modelViewTransformProperty.value,
        rulerOptions );
    };

    /**
     * Returns the appropriate options for the scale
     * It also updates the length of the ruler as a side effect
     * @param {Ruler} ruler
     * @param {number} absoluteScale
     * @returns {Object} [options]
     */
    const getOptions = ( ruler, absoluteScale ) => {

      // we want to scale model length inversely as the scale such that the view length remains the same
      ruler.scaleLength( 1 / absoluteScale );

      // only vertical ruler has tick marks on bottom
      const tickMarksOnBottom = ruler.isVertical();

      return {
        majorTickDistance: 10 / absoluteScale, // in model coordinate (cm)
        tickMarksOnBottom: tickMarksOnBottom
      };
    };

    /**
     * Update the GeometricOpticsRulerNode based on the new scale
     * @param {RulerNode} rulerNode
     * @param {number} absoluteScale
     */
    const updateRulerNode = ( rulerNode, absoluteScale ) => {

      // generate new options for the ruler node
      const rulerOptions = getOptions( rulerNode.ruler, absoluteScale );

      // set a new RulerNode within GeometricOpticsRulerNode
      rulerNode.setRulerNode( modelViewTransformProperty.value, rulerOptions );
    };

    //TODO: consider using OrientationPair (see #42)

    // @private {GeometricOpticsRulerNode} create the horizontal GeometricRulerNode
    this.horizontalRulerNode = getGeometricOpticsRulerNode( rulers.horizontal, absoluteScaleProperty.value );

    // @private {GeometricOpticsRulerNode} create the vertical GeometricRulerNode
    this.verticalRulerNode = getGeometricOpticsRulerNode( rulers.vertical, absoluteScaleProperty.value );

    // add both ruler to this layer
    this.addChild( this.horizontalRulerNode );
    this.addChild( this.verticalRulerNode );

    // update rulers when scale changes
    absoluteScaleProperty.link( absoluteScale => {

      // update the horizontal ruler based on the new scale
      updateRulerNode( this.horizontalRulerNode, absoluteScale );

      // update the vertical ruler based on the new scale
      updateRulerNode( this.verticalRulerNode, absoluteScale );
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
   * Sets the panel bounds of the toolbox
   * @public
   * @param {Bounds2} bounds
   */
  setToolboxPanelBounds( bounds ) {
    this.toolboxPanelBounds.set( bounds );
  }
}

geometricOptics.register( 'GeometricOpticRulersLayer', GeometricOpticRulersLayer );
export default GeometricOpticRulersLayer;