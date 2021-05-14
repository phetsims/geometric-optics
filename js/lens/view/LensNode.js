// Copyright 2021, University of Colorado Boulder

/**
 * View of the lens (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../../common/GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import OpticalElementNode from '../../common/view/OpticalElementNode.js';

const FILL = GeometricOpticsColorProfile.lensFillProperty;
const STROKE = GeometricOpticsColorProfile.lensStrokeProperty;
const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH;

class LensNode extends OpticalElementNode {

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

    // update the shape and position of the lens
    Property.multilink( [
        lens.positionProperty,
        lens.radiusOfCurvatureProperty,
        lens.indexOfRefractionProperty,
        lens.diameterProperty,
        lens.curveProperty ],
      () => {
        this.opticalElementPath.shape = modelViewTransform.modelToViewShape( lens.shape );
      } );

    // link the index of refraction to the opacity of the fill of the lens
    lens.indexOfRefractionProperty.link( index => {
      const normalizedIndex = lens.getNormalizedIndex( index );
      this.opticalElementPath.fill = new Color( FILL.value.red, FILL.value.green, FILL.value.blue, normalizedIndex );
    } );

  }
}

geometricOptics.register( 'LensNode', LensNode );
export default LensNode;
