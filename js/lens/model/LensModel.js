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
      Optic.Type.LENS,
      GeometricOpticsConstants.LENS_INITIAL_CURVATURE_TYPE,
      GeometricOpticsConstants.LENS_INITIAL_POSITION,
      GeometricOpticsConstants.LENS_RADIUS_OF_CURVATURE_RANGE,
      GeometricOpticsConstants.LENS_DIAMETER_RANGE,
      GeometricOpticsConstants.LENS_INDEX_OF_REFRACTION_RANGE
    );

    // @public top guide associated with the first source/object
    this.firstTopGuide = new Guide( this.optic, this.sourceObject.positionProperty, Guide.Location.TOP );

    // @public bottom guide associated with the first source/object
    this.firstBottomGuide = new Guide( this.optic, this.sourceObject.positionProperty, Guide.Location.BOTTOM );

    // @public top guide associated with the second source/object
    this.secondTopGuide = new Guide( this.optic, this.secondSource.positionProperty, Guide.Location.TOP );

    // @public bottom guide associated with the second source/object
    this.secondBottomGuide = new Guide( this.optic, this.secondSource.positionProperty, Guide.Location.BOTTOM );
  }
}

geometricOptics.register( 'LensModel', LensModel );
export default LensModel;