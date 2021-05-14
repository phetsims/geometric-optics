// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import CommonModel from '../../common/model/CommonModel.js';
import Mirror from './Mirror.js';
import LightRays from '../../common/model/LightRays.js';
import TargetImage from '../../common/model/TargetImage.js';
import geometricOptics from '../../geometricOptics.js';
import FocalPoints from '../../common/model/FocalPoints.js';

class MirrorModel extends CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );

    this.optic = new Mirror( tandem );
    this.focalPoints = new FocalPoints( this.optic.positionProperty, this.optic.focalLengthProperty, tandem );
    this.targetImage = new TargetImage( this.sourceObject, this.optic, tandem );
    this.lightRays = new LightRays( this.sourceObject.positionProperty, this.optic, this.targetImage, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.optic.reset();
    this.sourceObject.reset();
    this.targetImage.reset();
    this.lightRays.reset();
  }

}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;
