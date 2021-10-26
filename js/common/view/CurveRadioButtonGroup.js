// Copyright 2021, University of Colorado Boulder

/**
 * CurveRadioButtonGroup is the radio button group for controlling the curve shape of the lens or mirror.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import Optic from '../model/Optic.js';
import OpticShapes from '../model/OpticShapes.js';

class CurveRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( optic, options ) {

    assert && assert( optic instanceof Optic );

    options = merge( {
      orientation: 'horizontal',
      spacing: 10,
      cornerRadius: 3,
      baseColor: GeometricOpticsColors.curveRadioButtonFillProperty,
      selectedStroke: GeometricOpticsColors.curveRadioButtonSelectedStrokeProperty,
      deselectedStroke: GeometricOpticsColors.curveRadioButtonDeselectedStrokeProperty,
      deselectedLineWidth: 2,
      selectedLineWidth: 2,
      buttonContentXMargin: 14,
      buttonContentYMargin: 5,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // create an array of items for buttons for each curve.
    const buttonItems = Optic.Curve.VALUES.map( curve => {
      return {
        value: curve,
        node: CurveRadioButtonGroup.createIconNode( optic.opticType, curve, {
          buttonContentXMargin: options.buttonContentXMargin,
          buttonContentYMargin: options.buttonContentYMargin
        } ),
        tandemName: `${curve.name.toLowerCase()}RadioButton` //TODO is this OK?
      };
    } );

    // The icon that is converging should be the first in the button items.
    // If the first curve is diverging, reverse the order of the array.
    assert && assert( buttonItems.length === 2 );
    if ( optic.isDiverging( buttonItems[ 0 ].value ) ) {
      buttonItems.reverse();
    }

    // create the rectangular radio button group with the icons
    super( optic.curveProperty, buttonItems, options );
  }

  /**
   * Creates a centered icon representation of convex/concave, lens/mirror.
   * @public
   * @param {Optic.Type} opticType - the type can be lens or mirror
   * @param {Optic.Curve} curve - the curve can be convex or concave
   * @param {Object} [options] - see options below
   * @returns {Node}
   */
  static createIconNode( opticType, curve, options ) {
    assert && assert( Optic.Type.includes( opticType ) );
    assert && assert( Optic.Curve.includes( curve ) );

    options = merge( {
      radius: 22, // radius of curvature of the optic, in cm
      diameter: 30, // diameter of the optic, in cm

      /// options for the form of the icon
      fillNodeOptions: {
        fill: GeometricOpticsColors.opticFillProperty
      },

      // options for the contour or reflective surface
      outlineNodeOptions: {
        stroke: GeometricOpticsColors.opticStrokeProperty
      }
    }, options );

    // Get the appropriate shapes for the optic.
    const iconShapes = new OpticShapes( opticType, curve, options.radius, options.diameter, {
      isHollywooded: false, // does the radius of curvature match the shape of the lens?
      thickness: 4 // thickness of the backing of the mirror, in cm
    } );

    // Create the icon.
    const fillNode = new Path( iconShapes.fillShape, options.fillNodeOptions );
    const outlineNode = new Path( iconShapes.outlineShape, options.outlineNodeOptions );
    return new Node( {
      children: [ fillNode, outlineNode ]
    } );
  }
}

geometricOptics.register( 'CurveRadioButtonGroup', CurveRadioButtonGroup );
export default CurveRadioButtonGroup;