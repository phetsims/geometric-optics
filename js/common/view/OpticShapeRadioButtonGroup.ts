// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapeRadioButtonGroup is the radio button group for controlling the curve shape of the lens or mirror.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import Optic from '../model/Optic.js';
import OpticShapeEnum from '../model/OpticShapeEnum.js';
import Lens from '../../lens/model/Lens.js';
import MirrorNode from '../../mirror/view/MirrorNode.js';
import LensNode from '../../lens/view/LensNode.js';

class OpticShapeRadioButtonGroup extends RectangularRadioButtonGroup<OpticShapeEnum> {

  /**
   * @param optic
   * @param options
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
    assert && assert( optic.opticShapeProperty.validValues, 'valid values should be defined' );
    const items = optic.opticShapeProperty.validValues!.map(
      ( opticShape: OpticShapeEnum ) => {
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
export default OpticShapeRadioButtonGroup;