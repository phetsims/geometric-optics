// Copyright 2021, University of Colorado Boulder

/**
 * View of the mirror (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../../common/GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import OpticalElementNode from '../../common/view/OpticalElementNode.js';

const FILL = GeometricOpticsColorProfile.mirrorFillProperty;
const STROKE = GeometricOpticsColorProfile.mirrorStrokeProperty;
const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH;

class MirrorNode extends OpticalElementNode {

  /**
   * @param {OpticalElement} mirror
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( mirror, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      fill: FILL,
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    }, options );

    super( mirror, modelViewTransform, tandem, options );

    // update the shape and position of the mirror
    Property.multilink( [
        mirror.positionProperty,
        mirror.radiusOfCurvatureProperty,
        mirror.diameterProperty,
        mirror.curveProperty ],
      () => {
        this.opticalElementPath.shape = modelViewTransform.modelToViewShape( mirror.shape );
      } );
  }
}

geometricOptics.register( 'MirrorNode', MirrorNode );
export default MirrorNode;
