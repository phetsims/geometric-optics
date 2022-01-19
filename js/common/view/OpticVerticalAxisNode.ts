// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticVerticalAxisNode is the vertical axis through the center of the optic. For a lens, it bisects the symmetrical
 * lens into halves. It is shown only in Principal rays mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import RaysType from '../model/RaysType.js';

type OpticVerticalAxisNodeOptions = {
  tandem: Tandem
};

class OpticVerticalAxisNode extends Node {

  /**
   * @param optic
   * @param raysTypeProperty
   * @param visibleBoundsProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( optic: Optic, raysTypeProperty: IReadOnlyProperty<RaysType>,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2, providedOptions: OpticVerticalAxisNodeOptions ) {

    // create a vertical dashed line, through the optic - indicating the crossing plane of principal rays.
    const lineNode = new Path( modelViewTransform.modelToViewShape( optic.getVerticalAxis() ), {
      stroke: GOColors.verticalAxisStrokeProperty,
      lineWidth: 5,
      opacity: 0.4
    } );

    super( merge( {
      children: [ lineNode ]
    }, providedOptions ) );

    // Make lineNode visible when Rays mode is Principal
    raysTypeProperty.link( raysType => {
      lineNode.visible = ( raysType === 'principal' );
    } );

    // clip to the bounds
    visibleBoundsProperty.link( ( visibleBounds: Bounds2 ) => {
      this.clipArea = Shape.bounds( visibleBounds );
    } );
  }
}

geometricOptics.register( 'OpticVerticalAxisNode', OpticVerticalAxisNode );
export default OpticVerticalAxisNode;