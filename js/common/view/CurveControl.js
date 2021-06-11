// Copyright 2021, University of Colorado Boulder


/**
 * Controls the value of the curve property to determine the shape of the optic displayed in play area
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';

const RADIUS_OF_CURVATURE = 30; // in view coordinates
const DIAMETER = 50; // in view coordinates
const FILL = 'rgb(133,153,197)';
const STROKE = 'white';
const THICKNESS = 5; // thickness of mirror

class CurveControl extends RectangularRadioButtonGroup {

  /**
   *
   * @param {Enumeration.<Optic.Curve>} curveProperty
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( curveProperty, optic, options ) {

    options = merge( {
      spacing: 5, // vertical separation of the buttons
      cornerRadius: 5,
      baseColor: 'rgba(0,0,0,0)',
      buttonContentXMargin: 20,
      buttonContentYMargin: 5,
      selectedStroke: 'yellow',
      deselectedStroke: 'grey',
      deselectedLineWidth: 2,
      selectedLineWidth: 2
    }, options );

    /**
     * Creates icon for button to switch between convex/concave lens/mirror
     *
     * @param {Optic.Curve} curve
     * @returns {Node} iconNode
     */
    const createIconNode = curve => {

      // create icon shapes {fillShape, outlineShape}
      const iconShapes = optic.getFillAndOutlineShapes( RADIUS_OF_CURVATURE, DIAMETER, curve, { thickness: THICKNESS } );

      // create node to layout the paths for the icon
      const iconNode = new Node();
      const iconFillNode = new Path( iconShapes.fillShape, { fill: FILL } );
      const iconOutlineNode = new Path( iconShapes.outlineShape, { stroke: STROKE } );

      // adding the paths to the icon node
      iconNode.setChildren( [ iconFillNode, iconOutlineNode ] );

      return iconNode;
    };

    const convexNode = createIconNode( Optic.Curve.CONVEX );
    const concaveNode = createIconNode( Optic.Curve.CONCAVE );

    super( curveProperty, [
        { value: Optic.Curve.CONCAVE, node: concaveNode },
        { value: Optic.Curve.CONVEX, node: convexNode } ],
      options );
  }
}

geometricOptics.register( 'CurveControl', CurveControl );

export default CurveControl;
