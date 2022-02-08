// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapeRadioButtonGroup is the radio button group for controlling the shape of the optic's surface.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import { OpticShape } from '../model/OpticShape.js';
import Lens from '../../lens/model/Lens.js';
import MirrorNode from '../../mirror/view/MirrorNode.js';
import LensNode from '../../lens/view/LensNode.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';

type OpticShapeRadioButtonGroupOptions = {
  tandem: Tandem
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class OpticShapeRadioButtonGroup extends RectangularRadioButtonGroup<OpticShape> {

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: OpticShapeRadioButtonGroupOptions ) {

    // A radio button for each shape supported by the optic
    assert && assert( optic.opticShapeProperty.validValues ); // {OpticShape[]|undefined}
    const items = optic.opticShapeProperty.validValues!.map(
      ( opticShape: OpticShape ) => {
        return {
          value: opticShape,
          node: ( optic instanceof Lens ) ? LensNode.createIconNode( opticShape ) : MirrorNode.createIconNode( opticShape ),
          tandemName: `${opticShape}RadioButton`
        };
      } );

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
      buttonContentYMargin: 5
    }, providedOptions ) );
  }
}

geometricOptics.register( 'OpticShapeRadioButtonGroup', OpticShapeRadioButtonGroup );
export default OpticShapeRadioButtonGroup;