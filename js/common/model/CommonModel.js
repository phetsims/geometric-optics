// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from './Lens.js';
import LightRays from './LightRays.js';
import SourceObject from './SourceObject.js';
import TargetImage from './TargetImage.js';

class CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    this.sourceObject = new SourceObject( tandem );
    this.lens = new Lens( tandem );
    this.targetImage = new TargetImage( this.sourceObject, this.lens, tandem );
    this.lightRays = new LightRays( this.sourceObject.positionProperty, this.lens, this.targetImage, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.lens.reset();
    this.sourceObject.reset();
    this.targetImage.reset();
    this.lightRays.reset();
  }
}

geometricOptics.register( 'CommonModel', CommonModel );
export default CommonModel;
