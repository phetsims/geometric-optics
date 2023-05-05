// Copyright 2021-2023, University of Colorado Boulder

/**
 * OpticSurfaceTypeRadioButtonGroup is the radio button group for controlling the surface type of the optic.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import { OpticSurfaceType } from '../model/OpticSurfaceType.js';
import Lens from '../../lens/model/Lens.js';
import MirrorNode from '../../mirror/view/MirrorNode.js';
import LensNode from '../../lens/view/LensNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { GOSimOptions } from '../../GOSim.js';

type SelfOptions = EmptySelfOptions;

type OpticShapeRadioButtonGroupOptions = SelfOptions &
  PickRequired<GOSimOptions, 'isBasicsVersion'> &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'> &
  NodeTranslationOptions;

export default class OpticSurfaceTypeRadioButtonGroup extends RectangularRadioButtonGroup<OpticSurfaceType> {

  public constructor( optic: Optic, providedOptions: OpticShapeRadioButtonGroupOptions ) {

    const options = optionize<OpticShapeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      visible: !providedOptions.isBasicsVersion, // not visible in the Basics version
      orientation: 'horizontal',
      spacing: 10,
      touchAreaXDilation: 4,
      touchAreaYDilation: 5,
      radioButtonOptions: {
        baseColor: GOColors.curveRadioButtonFillProperty,
        cornerRadius: 3,
        xMargin: 14,
        yMargin: 5,
        buttonAppearanceStrategyOptions: {
          selectedStroke: GOColors.curveRadioButtonSelectedStrokeProperty,
          deselectedStroke: GOColors.curveRadioButtonDeselectedStrokeProperty,
          deselectedLineWidth: 2,
          selectedLineWidth: 2
        }
      }
    }, providedOptions );

    // A radio button for each shape supported by the optic
    assert && assert( optic.opticSurfaceTypeProperty.validValues ); // {OpticSurfaceType[]|undefined}
    const validValues = optic.opticSurfaceTypeProperty.validValues!;

    const items = validValues.map(
      ( opticSurfaceType: OpticSurfaceType ) => {
        return {
          value: opticSurfaceType,
          createNode: ( tandem: Tandem ) => ( optic instanceof Lens ) ? LensNode.createIconNode( opticSurfaceType ) : MirrorNode.createIconNode( opticSurfaceType ),
          tandemName: `${opticSurfaceType}RadioButton`
        };
      } );

    super( optic.opticSurfaceTypeProperty, items, options );
  }
}

geometricOptics.register( 'OpticSurfaceTypeRadioButtonGroup', OpticSurfaceTypeRadioButtonGroup );