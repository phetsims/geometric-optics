// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import CommonModel from '../../common/model/CommonModel.js';
import Lens from './Lens.js';
import LightRays from '../../common/model/LightRays.js';
import SourceObject from '../../common/model/SourceObject.js';
import TargetImage from '../../common/model/TargetImage.js';
import geometricOptics from '../../geometricOptics.js';

class LensModel extends CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    this.sourceObject = new SourceObject( tandem );
    this.opticalElement = new Lens( tandem );
    this.targetImage = new TargetImage( this.sourceObject, this.opticalElement, tandem );
    this.lightRays = new LightRays( this.sourceObject.positionProperty, this.opticalElement, this.targetImage, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.opticalElement.reset();
    this.sourceObject.reset();
    this.targetImage.reset();
    this.lightRays.reset();
  }

}


geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
