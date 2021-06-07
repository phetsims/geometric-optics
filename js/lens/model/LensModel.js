// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsModel from '../../common/model/GeometricOpticsModel.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';
import Lens from './Lens.js';
import ProjectorScreen from './ProjectorScreen.js';

class LensModel extends GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    // @public {Lens}
    this.optic = new Lens( tandem );

    this.createCommonComponents( this.optic, tandem );

    this.topGuide = new Guide( this.sourceObject.positionProperty, this.optic );

    this.bottomGuide = new Guide( this.sourceObject.positionProperty, this.optic, { location: Guide.Location.BOTTOM } );

    // @public {ProjectorScreen}
    this.projectorScreen = new ProjectorScreen( this.optic.positionProperty,
      this.optic.diameterProperty,
      this.targetImage.positionProperty,
      this.movableTargetImage.positionProperty, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
    this.optic.reset();
    this.targetImage.reset();
    this.lightRays.reset();
    this.projectorScreen.reset();
  }

}


geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
