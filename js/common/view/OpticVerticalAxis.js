// Copyright 2021, University of Colorado Boulder

/**
 * OpticVerticalAxis is the vertical axis through the center of the optic. For a lens, it bisects the symmetrical
 * lens into halves. It is shown only in Principal rays mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Optic from '../model/Optic.js';
import RaysMode from '../model/RaysMode.js';

class OpticVerticalAxis extends Node {

  /**
   * @param {Optic} optic
   * @param {Property.<RaysMode>} raysModeProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic, raysModeProperty, modelBoundsProperty, modelViewTransform, options ) {

    assert && assert( optic instanceof Optic );
    assert && assert( raysModeProperty instanceof Property );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {}, options );

    // create a vertical dashed line, through the optic - indicating the crossing plane of principal rays.
    const lineNode = new Path(
      modelViewTransform.modelToViewShape( optic.getPrincipalLine() ), {
        stroke: GeometricOpticsColors.verticalAxisStrokeProperty,
        lineWidth: GeometricOpticsConstants.AXIS_LINE_WIDTH,
        lineDash: GeometricOpticsConstants.AXIS_LINE_DASH
      } );

    assert && assert( !options.children );
    options.children = [ lineNode ];

    super( options );

    // Make lineNode visible when Rays mode is Principal
    raysModeProperty.link( raysMode => {
      lineNode.visible = ( raysMode === RaysMode.PRINCIPAL );
    } );

    // clip to the bounds
    modelBoundsProperty.link( modelBounds => {
      this.clipArea = Shape.bounds( modelViewTransform.modelToViewBounds( modelBounds ) );
    } );
  }
}

geometricOptics.register( 'OpticVerticalAxis', OpticVerticalAxis );
export default OpticVerticalAxis;