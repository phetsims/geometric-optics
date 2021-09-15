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
import OpticShapeCollection from '../model/OpticShapeCollection.js';

// constants
const RADIUS_OF_CURVATURE = 22; // in view coordinates
const DIAMETER = 30; // in view coordinates
const FILL = 'rgb(133,153,197)'; // for body of optic
const STROKE = 'white'; // for outline of optic
const THICKNESS = 4; // thickness of mirror
const STRUT_LENGTH = 42; // minimum size of the button

class CurveControl extends RectangularRadioButtonGroup {

  /**
   * @param {Property.<Optic.Curve>} curveProperty
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( curveProperty, optic, options ) {

    options = merge( {
      spacing: 10, // vertical separation of the buttons
      cornerRadius: 3,
      baseColor: 'rgba(0,0,0,0)',
      selectedStroke: 'yellow',
      deselectedStroke: 'grey',
      deselectedLineWidth: 2,
      selectedLineWidth: 2,
      buttonContentXMargin: 0,
      buttonContentYMargin: 0
    }, options );

    // create an array of items for buttons for each curve.
    const buttonItems = Optic.Curve.VALUES.map( curve => {
      return {
        value: curve,
        node: CurveControl.createIconNode( curve, optic.type, {
          buttonContentXMargin: options.buttonContentXMargin,
          buttonContentYMargin: options.buttonContentYMargin
        } )
      };
    } );

    // the icon that is converging should be the first in the button items
    // find the curve of the first item
    const firstCurve = buttonItems[ 0 ].value;

    // if the first curve is diverging, reverse the order of the array
    if ( optic.isDiverging( firstCurve ) ) {
      buttonItems.reverse();
    }

    // create the rectangular radio button group with the icons
    super( curveProperty, buttonItems, options );
  }

  /**
   * Creates a centered icon representation of convex/concave, lens/mirror.
   * @public
   * @param {Optic.Curve} curve - the curve can be convex or concave
   * @param {Optic.Type} type - the type can be lens or mirror
   * @param {Object} [options] - see options below
   * @returns {Node}
   */
  static createIconNode( curve, type, options ) {

    options = merge(
      {
        radius: RADIUS_OF_CURVATURE, // radius of curvature
        diameter: DIAMETER, // height of the optic
        thickness: THICKNESS, // thickness of the backing of the mirror
        isHollywood: false, // is the curvature radius an accurate description of shape
        form: { fill: FILL }, /// options for the form of the icon
        outline: { stroke: STROKE }, // options for the contour or reflective surface
        buttonContentXMargin: 0,
        buttonContentYMargin: 0,
        strutLength: STRUT_LENGTH // minimum size of the Node (when including spacer)
      },
      options );

    // get appropriate icon shapes
    const iconShapes = new OpticShapeCollection( options.radius, options.diameter, curve, type, options );

    // create node to layout the paths for the icon
    const iconNode = new Node();

    const iconFillNode = new Path( iconShapes.fillShape, options.form );
    const iconOutlineNode = new Path( iconShapes.outlineShape, options.outline );

    iconNode.setChildren( [ iconFillNode, iconOutlineNode ] );

    // create spacer to ensure both lens and mirror icons are the same size
    const iconSpacer = new Spacer( options.strutLength - 2 * options.buttonContentXMargin,
      options.strutLength - 2 * options.buttonContentYMargin );

    // make sure the spacer is larger than icon
    assert && assert( iconSpacer.width > iconNode.width,
      'spacer width is smaller than icon content' );
    assert && assert( iconSpacer.height > iconNode.height,
      'spacer height is smaller than icon content' );

    // center the icon in the spacer
    iconNode.center = iconSpacer.center;

    // return a node layer containing the icon and spacer
    return new Node( { children: [ iconNode, iconSpacer ] } );
  }
}

geometricOptics.register( 'CurveControl', CurveControl );
export default CurveControl;