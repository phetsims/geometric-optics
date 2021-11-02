// Copyright 2021, University of Colorado Boulder

/**
 * OpticVerticalAxis is the vertical axis through the center of the optic. For a lens, it bisects the symmetrical
 * lens into halves. It is shown only in Principal rays mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Optic from '../model/Optic.js';
import RaysModeEnum from '../model/RaysModeEnum.js';

class OpticVerticalAxis extends Node {

  /**
   * @param {Optic} optic
   * @param {Property.<RaysModeEnum>} raysModeProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic: Optic, raysModeProperty: Property<RaysModeEnum>, modelBoundsProperty: Property<Bounds2>,
               modelViewTransform: ModelViewTransform2, options?: any ) { //TODO-TS any

    options = merge( {}, options );

    // create a vertical dashed line, through the optic - indicating the crossing plane of principal rays.
    const lineNode = new Path( modelViewTransform.modelToViewShape( optic.getVerticalAxis() ), {
      stroke: GeometricOpticsColors.verticalAxisStrokeProperty,
      lineWidth: GeometricOpticsConstants.AXIS_LINE_WIDTH,
      lineDash: GeometricOpticsConstants.AXIS_LINE_DASH
    } );

    assert && assert( !options.children );
    options.children = [ lineNode ];

    super( options );

    // Make lineNode visible when Rays mode is Principal
    raysModeProperty.link( ( raysMode: RaysModeEnum ) => {
      lineNode.visible = ( raysMode === 'principal' );
    } );

    // clip to the bounds
    modelBoundsProperty.link( ( modelBounds: Bounds2 ) => {
      this.clipArea = Shape.bounds( modelViewTransform.modelToViewBounds( modelBounds ) );
    } );
  }
}

geometricOptics.register( 'OpticVerticalAxis', OpticVerticalAxis );
export default OpticVerticalAxis;