// Copyright 2021, University of Colorado Boulder

//TODO get rid of GeometricOpticRulersLayer, move responsibilities into GeometricOpticsRulerNode
/**
 * A layer that contains 1 horizontal ruler and 1 vertical ruler
 * Responsible for updating the rulers when zooming
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import Ruler from '../model/Ruler.js';
import GeometricOpticsRulerNode from './GeometricOpticsRulerNode.js';

class GeometricOpticRulersLayer extends Node {

  toolboxPanelBounds: Bounds2;
  horizontalRulerNode: GeometricOpticsRulerNode;
  verticalRulerNode: GeometricOpticsRulerNode;

  /**
   * @param horizontalRuler
   * @param verticalRuler
   * @param visibleBoundsProperty
   * @param absoluteScaleProperty
   * @param modelViewTransformProperty
   * @param options
   */
  constructor( horizontalRuler: Ruler, verticalRuler: Ruler, visibleBoundsProperty: Property<Bounds2>,
               absoluteScaleProperty: Property<number>, modelViewTransformProperty: Property<ModelViewTransform2>,
               options?: any ) { //TYPESCRIPT any

    super( options );

    // set to infinity, will be properly initialized after constructor is called
    this.toolboxPanelBounds = new Bounds2( Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY );

    //TODO creating a new GeometricOpticsRulerNode each time the scale changes will be a problem for PhET-iO, why not just scale the ruler Node?
    /**
     * Returns a GeometricOpticsRulerNode
     * @param {Ruler} ruler
     * @param {number} absoluteScale
     * @returns {GeometricOpticsRulerNode}
     */
    const createRulerNode = ( ruler: Ruler, absoluteScale: number ): GeometricOpticsRulerNode => {

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
     * @param ruler
     * @param absoluteScale
     */
    //TYPESCRIPT return type
    const getOptions = ( ruler: Ruler, absoluteScale: number ) => {

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
     * @param {GeometricOpticsRulerNode} rulerNode
     * @param {number} absoluteScale
     */
    const updateRulerNode = ( rulerNode: GeometricOpticsRulerNode, absoluteScale: number ): void => {

      // generate new options for the ruler node
      const rulerOptions = getOptions( rulerNode.ruler, absoluteScale );

      // set a new RulerNode within GeometricOpticsRulerNode
      rulerNode.setRulerNode( modelViewTransformProperty.value, rulerOptions );
    };

    this.horizontalRulerNode = createRulerNode( horizontalRuler, absoluteScaleProperty.value );
    this.verticalRulerNode = createRulerNode( verticalRuler, absoluteScaleProperty.value );
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

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.horizontalRulerNode.reset();
    this.verticalRulerNode.reset();
  }

  //TODO this is redundant because toolboxPanelBounds is public
  public setToolboxBounds( bounds: Bounds2 ): void {
    this.toolboxPanelBounds.set( bounds );
  }
}

geometricOptics.register( 'GeometricOpticRulersLayer', GeometricOpticRulersLayer );
export default GeometricOpticRulersLayer;