// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';

class LensModel extends GeometricOpticsModel {

  constructor() {

    super(
      GeometricOpticsConstants.LENS_INITIAL_POSITION,
      GeometricOpticsConstants.LENS_RADIUS_OF_CURVATURE_RANGE,
      GeometricOpticsConstants.LENS_DIAMETER_RANGE,
      GeometricOpticsConstants.LENS_INDEX_OF_REFRACTION_RANGE,
      GeometricOpticsConstants.LENS_INITIAL_CURVATURE_TYPE,
      Optic.Type.LENS
    );

    // @public {Guide} model for top guide associated with the first source/object
    this.firstTopGuide = new Guide( this.sourceObject.firstPositionProperty, this.optic );

    // @public {Guide} model for bottom guide associated with the first source/object
    this.firstBottomGuide = new Guide( this.sourceObject.firstPositionProperty, this.optic, {
      location: Guide.Location.BOTTOM
    } );

    // @public {Guide} model for top guide associated with the second source/object
    this.secondTopGuide = new Guide( this.sourceObject.secondPositionProperty, this.optic );

    // @public {Guide} model for bottom guide associated with the second source/object
    this.secondBottomGuide = new Guide( this.sourceObject.secondPositionProperty, this.optic, {
      location: Guide.Location.BOTTOM
    } );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;