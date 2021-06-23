// Copyright 2021, University of Colorado Boulder


/**
 * Controls the value of the curve property to determine the shape of the optic displayed in play area
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';

const RADIUS_OF_CURVATURE = 18; // in view coordinates
const DIAMETER = 30; // in view coordinates
const FILL = 'rgb(133,153,197)';
const STROKE = 'white';
const THICKNESS = 3; // thickness of mirror
const STRUT_LENGTH = 42;

class CurveControl extends RectangularRadioButtonGroup {

  /**
   *
   * @param {Property.<Optic.Curve>} curveProperty
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( curveProperty, optic, options ) {

    options = merge( {
      spacing: 10, // vertical separation of the buttons
      cornerRadius: 3,
      baseColor: 'rgba(0,0,0,0)',
      buttonContentXMargin: 0,
      buttonContentYMargin: 0,
      selectedStroke: 'yellow',
      deselectedStroke: 'grey',
      deselectedLineWidth: 2,
      selectedLineWidth: 2
    }, options );

    /**
     * Creates icon for button to switch between convex/concave lens/mirror
     *
     * @param {Optic.Curve} curve
     * @returns {Node}
     */
    const createIconNode = curve => {

      // create icon shapes {fillShape, outlineShape}
      const iconShapes = optic.getFillAndOutlineShapes( RADIUS_OF_CURVATURE, DIAMETER, curve, { thickness: THICKNESS } );

      // create node to layout the paths for the icon
      const iconNode = new Node();
      const iconFillNode = new Path( iconShapes.fillShape, { fill: FILL } );
      const iconOutlineNode = new Path( iconShapes.outlineShape, { stroke: STROKE } );
      iconNode.setChildren( [ iconFillNode, iconOutlineNode ] );

      // create spacer to ensure both lens and mirror icons are the same size
      const iconSpacer = new Spacer( STRUT_LENGTH, STRUT_LENGTH );

      // make sure the spacer is larger than icon
      assert && assert( iconSpacer.width > iconNode.width, 'spacer width is smaller than icon content' );
      assert && assert( iconSpacer.height > iconNode.height, 'spacer height is smaller than icon content' );

      // center the icon in the spacer
      iconNode.center = iconSpacer.center;

      // return a node layer containing the icon and spacer
      return new Node( { children: [ iconNode, iconSpacer ] } );
    };

    // create the icons
    const convexNode = createIconNode( Optic.Curve.CONVEX );
    const concaveNode = createIconNode( Optic.Curve.CONCAVE );

    // set order of buttons
    let concaveConvexNodes;

    // convex lens is top button, concave lens is bottom button
    if ( optic.isLens() ) {
      concaveConvexNodes = [
        { value: Optic.Curve.CONVEX, node: convexNode },
        { value: Optic.Curve.CONCAVE, node: concaveNode } ];
    }

    // concave mirror is top button, convex mirror is bottom button
    else if ( optic.isMirror() ) {
      concaveConvexNodes = [
        { value: Optic.Curve.CONCAVE, node: concaveNode },
        { value: Optic.Curve.CONVEX, node: convexNode } ];
    }

    // create the rectangular radio button group with the icons
    super( curveProperty, concaveConvexNodes, options );

  }
}

geometricOptics.register( 'CurveControl', CurveControl );

export default CurveControl;
