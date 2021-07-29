// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';

const INDEX_OF_REFRACTION_RANGE = GeometricOpticsConstants.LENS_INDEX_OF_REFRACTION_RANGE;
const RADIUS_OF_CURVATURE_RANGE = GeometricOpticsConstants.LENS_RADIUS_OF_CURVATURE_RANGE;
const DIAMETER_RANGE = GeometricOpticsConstants.LENS_DIAMETER_RANGE;
const INITIAL_CURVATURE_TYPE = GeometricOpticsConstants.LENS_INITIAL_CURVATURE_TYPE;
const INITIAL_POSITION = GeometricOpticsConstants.LENS_INITIAL_POSITION;

class LensModel extends GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( INITIAL_POSITION, RADIUS_OF_CURVATURE_RANGE, DIAMETER_RANGE,
      INDEX_OF_REFRACTION_RANGE, INITIAL_CURVATURE_TYPE, Optic.Type.LENS, tandem );

    // @public {Guide} model for top guide associated with the first source/object
    this.firstTopGuide = new Guide( this.sourceObject.firstPositionProperty, this.optic );

    // @public {Guide} model for bottom guide associated with the first source/object
    this.firstBottomGuide = new Guide( this.sourceObject.firstPositionProperty, this.optic, { location: Guide.Location.BOTTOM } );

    // @public {Guide} model for top guide associated with the second source/object
    this.secondTopGuide = new Guide( this.sourceObject.secondPositionProperty, this.optic );

    // @public {Guide} model for bottom guide associated with the second source/object
    this.secondBottomGuide = new Guide( this.sourceObject.secondPositionProperty, this.optic, { location: Guide.Location.BOTTOM } );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
