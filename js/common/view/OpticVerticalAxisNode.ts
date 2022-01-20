// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticVerticalAxisNode is the vertical axis through the center of the optic. For a lens, it bisects the symmetrical
 * lens into halves. It is shown only in Principal rays mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
   * @param modelVisibleBoundsProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( optic: Optic, raysTypeProperty: IReadOnlyProperty<RaysType>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2, providedOptions: OpticVerticalAxisNodeOptions ) {

    // Create a vertical line through the optic - indicating the crossing plane of Principal rays.
    const lineNode = new Path( null, {
      stroke: GOColors.verticalAxisStrokeProperty,
      lineWidth: 5,
      opacity: 0.4
    } );

    super( merge( {
      children: [ lineNode ]
    }, providedOptions ) );

    // Vertical line from top to bottom of visible bounds, through the center of the optic.
    Property.multilink( [ modelVisibleBoundsProperty, optic.positionProperty ],
      ( modelVisibleBounds: Bounds2, opticPosition: Vector2 ) => {
        const opticX = modelViewTransform.modelToViewPosition( opticPosition ).x;
        const viewVisibleBounds = modelViewTransform.modelToViewBounds( modelVisibleBounds );
        lineNode.shape = Shape.lineSegment( opticX, viewVisibleBounds.minY, opticX, viewVisibleBounds.maxY );
      } );

    // Visible when Rays is set to 'Principal'
    raysTypeProperty.link( raysType => {
      this.visible = ( raysType === 'principal' );
    } );
  }
}

geometricOptics.register( 'OpticVerticalAxisNode', OpticVerticalAxisNode );
export default OpticVerticalAxisNode;