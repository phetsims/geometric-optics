// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapeRadioButtonGroup is the radio button group for controlling the curve shape of the lens or mirror.
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
import OpticShapeEnum from '../model/OpticShapeEnum.js';
import OpticShapes from '../model/OpticShapes.js';
import OpticTypeEnum from '../model/OpticTypeEnum.js';

//TYPESCRIPT RectangularRadioButtonGroup needs to define this parameterized type for items
type RectangularRadioButtonGroupItem<T> = {
  value: T,
  node: Node,
  label?: Node,
  tandemName?: string,
  phetioDocumentation?: string,
  labelContent?: string,
  descriptionContent?: string
};

class OpticShapeRadioButtonGroup extends RectangularRadioButtonGroup<OpticShapeEnum> {

  /**
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( optic: Optic, options?: any ) { //TYPESCRIPT any

    options = merge( {

      // RectangularRadioButtonGroup options
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

    // A radio button for each shape supported by the optic
    const items = optic.opticShapeProperty.validValues.map(
      ( opticShape: OpticShapeEnum ) => createItem( optic.opticType, opticShape ) );

    super( optic.opticShapeProperty, items, options );
  }

  /**
   * Creates a centered icon representation of convex/concave, lens/mirror.
   * @param {OpticTypeEnum} opticType - the optic can be lens or mirror
   * @param {OpticShapeEnum} opticShape - the shape of the optic can be convex or concave
   * @param {Object} [options]
   * @returns {Node}
   */
  public static createIconNode( opticType: OpticTypeEnum, opticShape: OpticShapeEnum, options?: any ): Node { //TYPESCRIPT any

    options = merge( {
      radius: 22, // radius of curvature of the optic, in cm
      diameter: 30 // diameter of the optic, in cm
    }, options );

    // Get the appropriate shapes for the optic.
    const iconShapes = new OpticShapes( opticType, opticShape, options.radius, options.diameter, {
      isHollywooded: false,
      mirrorThickness: 4
    } );

    // Create the icon.
    const fillNode = new Path( iconShapes.fillShape, {
      fill: GeometricOpticsColors.opticFillProperty
    } );
    const outlineNode = new Path( iconShapes.outlineShape, {
      stroke: GeometricOpticsColors.opticStrokeProperty
    } );
    return new Node( {
      children: [ fillNode, outlineNode ]
    } );
  }
}

/**
 * Creates an item for the radio button group.
 * @param {OpticTypeEnum} opticType
 * @param {OpticShapeEnum} opticShape
 * @returns {RectangularRadioButtonGroupItem<OpticShapeEnum>}
 */
function createItem( opticType: OpticTypeEnum, opticShape: OpticShapeEnum ): RectangularRadioButtonGroupItem<OpticShapeEnum> {
  return {
    value: opticShape,
    node: OpticShapeRadioButtonGroup.createIconNode( opticType, opticShape ),
    tandemName: `${opticShape}RadioButton`
  };
}

geometricOptics.register( 'OpticShapeRadioButtonGroup', OpticShapeRadioButtonGroup );
export default OpticShapeRadioButtonGroup;