// Copyright 2021, University of Colorado Boulder

/**
 * LensModel is the model for the 'Lens' screen.
 *
 * @author Martin Veillette
 */

import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import Lens from './Lens.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';

class LensModel extends GeometricOpticsModel {

  constructor() {

    super( new Lens() );

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