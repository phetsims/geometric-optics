// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapeRadioButtonGroup is the radio button group for controlling the shape of the optic's surface.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import { OpticShape } from '../model/OpticShape.js';
import Lens from '../../lens/model/Lens.js';
import MirrorNode from '../../mirror/view/MirrorNode.js';
import LensNode from '../../lens/view/LensNode.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import { PickOptional, PickRequired } from '../GOTypes.js';

type OpticShapeRadioButtonGroupOptions = PickRequired<NodeOptions, 'tandem'>
  & PickOptional<NodeOptions, 'left' | 'right' | 'centerX' | 'top' | 'bottom' | 'centerY'>;

class OpticShapeRadioButtonGroup extends RectangularRadioButtonGroup<OpticShape> {

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: OpticShapeRadioButtonGroupOptions ) {

    // A radio button for each shape supported by the optic
    assert && assert( optic.opticShapeProperty.validValues ); // {OpticShape[]|undefined}
    const validValues = optic.opticShapeProperty.validValues!;

    const items = validValues.map(
      ( opticShape: OpticShape ) => {
        return {
          value: opticShape,
          node: ( optic instanceof Lens ) ? LensNode.createIconNode( opticShape ) : MirrorNode.createIconNode( opticShape ),
          tandemName: `${opticShape}RadioButton`
        };
      } );

    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when RectangularRadioButtonGroupOptions exits
    super( optic.opticShapeProperty, items, merge( {

      // RectangularRadioButtonGroup options
      orientation: 'horizontal',
      spacing: 10,
      cornerRadius: 3,
      baseColor: GOColors.curveRadioButtonFillProperty,
      selectedStroke: GOColors.curveRadioButtonSelectedStrokeProperty,
      deselectedStroke: GOColors.curveRadioButtonDeselectedStrokeProperty,
      deselectedLineWidth: 2,
      selectedLineWidth: 2,
      buttonContentXMargin: 14,
      buttonContentYMargin: 5,
      touchAreaXDilation: 4,
      touchAreaYDilation: 5,
      visible: ( validValues.length > 1 ) // hide if we only have 1 choice
    }, providedOptions ) );
  }
}

geometricOptics.register( 'OpticShapeRadioButtonGroup', OpticShapeRadioButtonGroup );
export default OpticShapeRadioButtonGroup;