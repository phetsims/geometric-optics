// Copyright 2021, University of Colorado Boulder

/**
 * View of the lens (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../../common/GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import OpticNode from '../../common/view/OpticNode.js';

const FILL = GeometricOpticsColorProfile.lensFillProperty;
const STROKE = GeometricOpticsColorProfile.lensStrokeProperty;
const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH;

class LensNode extends OpticNode {

  /**
   * @param {Lens} lens
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( lens, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      fill: FILL,
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    }, options );

    super( lens, modelViewTransform, tandem, options );

    // lens.shapeProperty.link( shape => {
    //   this.opticPath.shape = modelViewTransform.modelToViewShape( shape );
    // } );

    // link the index of refraction to the opacity of the fill of the lens
    lens.indexOfRefractionProperty.link( index => {
      const normalizedIndex = lens.getNormalizedIndex( index );
      const fill = FILL.value;
      this.opticPath.fill = new Color( fill.red, fill.green, fill.blue, normalizedIndex );
    } );

  }
}

geometricOptics.register( 'LensNode', LensNode );
export default LensNode;
