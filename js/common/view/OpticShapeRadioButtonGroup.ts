// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapeRadioButtonGroup is the radio button group for controlling the shape of the optic's surface.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import { OpticShape } from '../model/OpticShape.js';
import Lens from '../../lens/model/Lens.js';
import MirrorNode from '../../mirror/view/MirrorNode.js';
import LensNode from '../../lens/view/LensNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {};

type OpticShapeRadioButtonGroupOptions = SelfOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'> &
  PickOptional<RectangularRadioButtonGroupOptions, 'left' | 'right' | 'centerX' | 'top' | 'bottom' | 'centerY'>;

export default class OpticShapeRadioButtonGroup extends RectangularRadioButtonGroup<OpticShape> {

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: OpticShapeRadioButtonGroupOptions ) {

    const options = optionize<OpticShapeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>( {

      // RectangularRadioButtonGroupOptions
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
      touchAreaYDilation: 5
    }, providedOptions );

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

    super( optic.opticShapeProperty, items, options );
  }
}

geometricOptics.register( 'OpticShapeRadioButtonGroup', OpticShapeRadioButtonGroup );