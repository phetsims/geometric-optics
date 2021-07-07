// Copyright 2021, University of Colorado Boulder

/**
 * View of the mirror (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsColorProfile from '../../common/GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import OpticNode from '../../common/view/OpticNode.js';
import geometricOptics from '../../geometricOptics.js';

const FILL = GeometricOpticsColorProfile.mirrorFillProperty;
const STROKE = GeometricOpticsColorProfile.mirrorStrokeProperty;
const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH;

class MirrorNode extends OpticNode {

  /**
   * @param {Optic} mirror
   * @param {Property.<LightRayMode>} lightRayModeProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( mirror, lightRayModeProperty, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      fill: FILL,
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    }, options );

    super( mirror, lightRayModeProperty, modelViewTransform, tandem, options );

  }
}

geometricOptics.register( 'MirrorNode', MirrorNode );
export default MirrorNode;
