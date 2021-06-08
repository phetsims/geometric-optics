// Copyright 2021, University of Colorado Boulder


/**
 * Controls the value of the curve property to determine the shape of the optic displayed in play area
 *
 * @author Sarah Chang, Swarthmore College
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Optic from '../model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Node from '../../../../scenery/js/nodes/Node.js';

class CurveControl extends RectangularRadioButtonGroup {
  constructor( curveProperty, optic, options ) {
    options = merge( {
      spacing: 5, // vertical separation of the buttons
      cornerRadius: 10,
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
      const iconShapes = optic.getFillAndOutlineShapes( new Vector2( 0, 0 ), 30, 50, curve, { thickness: 5 } );

      const iconNode = new Node();
      const iconFillNode = new Path( iconShapes.fillShape, { fill: 'rgb(133,153,197)' } );
      const iconOutlineNode = new Path( iconShapes.outlineShape, { stroke: 'white' } );

      iconNode.setChildren( [ iconFillNode, iconOutlineNode ] );

      return iconNode;
    };

    const convexNode = createIconNode( Optic.Curve.CONVEX );
    const concaveNode = createIconNode( Optic.Curve.CONCAVE );

    super( curveProperty, [ { value: Optic.Curve.CONCAVE, node: concaveNode }, { value: Optic.Curve.CONVEX, node: convexNode } ], options );
  }
}

geometricOptics.register( 'CurveControl', CurveControl );

export default CurveControl;