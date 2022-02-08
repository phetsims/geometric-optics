// Copyright 2021-2022, University of Colorado Boulder

/**
 * SurfaceTypeRadioButtonGroup is the radio button group for controlling the shape of the optic's surface.
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
import { SurfaceType } from '../model/SurfaceType.js';
import Lens from '../../lens/model/Lens.js';
import MirrorNode from '../../mirror/view/MirrorNode.js';
import LensNode from '../../lens/view/LensNode.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';

type SurfaceTypeRadioButtonGroupOptions = {
  tandem: Tandem
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class SurfaceTypeRadioButtonGroup extends RectangularRadioButtonGroup<SurfaceType> {

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: SurfaceTypeRadioButtonGroupOptions ) {

    // A radio button for each shape supported by the optic
    assert && assert( optic.surfaceTypeProperty.validValues ); // {SurfaceType[]|undefined}
    const items = optic.surfaceTypeProperty.validValues!.map(
      ( surfaceType: SurfaceType ) => {
        return {
          value: surfaceType,
          node: ( optic instanceof Lens ) ? LensNode.createIconNode( surfaceType ) : MirrorNode.createIconNode( surfaceType ),
          tandemName: `${surfaceType}RadioButton`
        };
      } );

    super( optic.surfaceTypeProperty, items, merge( {

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

geometricOptics.register( 'SurfaceTypeRadioButtonGroup', SurfaceTypeRadioButtonGroup );
export default SurfaceTypeRadioButtonGroup;