// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticVerticalAxisNode is the vertical axis through the center of the optic. For a lens, it bisects the symmetrical
 * lens into halves. It is shown only in Principal rays mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import { RaysType } from '../model/RaysType.js';

class OpticVerticalAxisNode extends Node {

  /**
   * @param optic
   * @param raysTypeProperty
   * @param modelViewTransform
   */
  constructor( optic: Optic,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               modelViewTransform: ModelViewTransform2 ) {

    // Create a vertical dashed line through the optic, indicating the crossing plane of Principal rays.
    // See https://github.com/phetsims/geometric-optics/issues/140 for decisions about the look of this axis.
    const lineNode = new Path( modelViewTransform.modelToViewShape( optic.getVerticalAxis() ), {
      stroke: GOColors.verticalAxisStrokeProperty,
      lineWidth: 5,
      opacity: 0.4
    } );

    super( {
      children: [ lineNode ]
    } );

    // Make lineNode visible when Rays mode is Principal
    raysTypeProperty.link( raysType => {
      lineNode.visible = ( raysType === 'principal' );
    } );
  }
}

geometricOptics.register( 'OpticVerticalAxisNode', OpticVerticalAxisNode );
export default OpticVerticalAxisNode;